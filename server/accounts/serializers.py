from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta: 
        model = User
        fields = ["username", "email", "phone", "bio", "password", "password2"]

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists")
        return value
    
    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("User with this phone already exists")
        return value
    
    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError("Passwords do not match")

        validate_password(attrs["password"])
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)
        user.is_active = False   
        user.save()

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        verification_link = f"http://localhost:8000/api/verify/{uid}/{token}/"

        html_message = f"""
        <h3>Verify your account</h3>
        <p>Click button below to verify</p>

        <a href="{verification_link}" 
        style="padding:10px 20px;
                background:#2563eb;
                color:white;
                text-decoration:none;
                border-radius:6px;">
        Verify Account
        </a>
        """
        send_mail(
            subject="Verify your account",
            message="",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            html_message=html_message,
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"detail": "Account not found"}
            )

        if not user.check_password(password):
            raise serializers.ValidationError(
                {"detail": "Incorrect password"}
            )

        if not user.is_active:
            raise serializers.ValidationError(
                {"detail": "Please verify your email first"}
            )

        data = super().validate(attrs)
        return data