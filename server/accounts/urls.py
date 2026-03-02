from django.urls import path
from .views import RegisterView, ProfileView, VerifyEmailView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", CustomTokenObtainPairView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("verify/<uidb64>/<token>/", VerifyEmailView.as_view()),
]