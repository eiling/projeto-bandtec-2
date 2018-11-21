from django.urls import path

from . import views, ajax


urlpatterns = [
    path('', views.sign_in),
    path('sign_up', views.sign_up),
    path('main_page', views.main_page),
    path('details/<int:agent_id>', views.details),
    path('config/<int:agent_id>', views.agent_config),

    path('panels',views.panel),
    path('logout', views.logout),

    path('ajax/sign_in', ajax.sign_in),
    path('ajax/sign_up', ajax.sign_up),
    path('ajax/setup_dm', ajax.setup_discord_dm),
    path('ajax/query_data', ajax.query_last_data),
    path('ajax/ping', ajax.ping),
    path('ajax/change_agent', ajax.change_agent),
    path('ajax/remove_agent', ajax.remove_agent),

    path('test', views.test),
    path('ajax_test', views.ajax_test),
]
