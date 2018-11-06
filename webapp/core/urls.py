from django.urls import path

from . import views, ajax


urlpatterns = [
    path('', views.index),
    path('signup', views.signup),
    path('main_page', views.main_page),
    path('test', views.test),

    path('logout', views.logout),

    path('ajax/login', ajax.login),
    path('ajax/signup', ajax.signup),
    path('ajax/setup_dm', ajax.setup_discord_dm),
    path('ajax/query_data', ajax.query_last_data),
]
