from django.urls import path

from . import views, ajax


urlpatterns = [
    path('', views.index),
    path('signup', views.signup),
    path('main_page', views.main_page),
    path('details/<int:agent_id>', views.details),
    path('register_agent/<int:agent_id>', views.register_agent),

    path('logout', views.logout),

    path('ajax/login', ajax.login),
    path('ajax/signup', ajax.signup),
    path('ajax/setup_dm', ajax.setup_discord_dm),
    path('ajax/query_data', ajax.query_last_data),
    path('ajax/ping', ajax.ping),
    path('ajax/register_agent', ajax.register_agent),
]
