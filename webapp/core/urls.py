from django.urls import path

from . import views, ajax


urlpatterns = [
    path('', views.index),
    path('main_page', views.main_page),
    path('logout', views.logout),
    path('ajax/login', ajax.login),
]
