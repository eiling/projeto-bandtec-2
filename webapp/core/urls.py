from django.urls import path

from . import views, ajax

urlpatterns = [
    path('', views.sign_in),
    path('sign_up', views.sign_up),
    path('panel', views.panel),
    path('records', views.records),
    path('settings', views.settings),
    path('panel/<int:agent_id>', views.agent_panel),
    path('settings/<int:agent_id>', views.agent_settings),
    path('results', views.results),  # records
    path('main_page', views.main_page),  # remove later

    path('logout', views.logout),

    path('ajax/sign_in', ajax.sign_in),
    path('ajax/sign_up', ajax.sign_up),
    path('ajax/setup_dm', ajax.setup_discord_dm),
    path('ajax/query_data', ajax.query_last_data),
    path('ajax/ping', ajax.ping),
    path('ajax/change_agent', ajax.change_agent),
    path('ajax/remove_agent', ajax.remove_agent),
    path('ajax/remove_discord', ajax.remove_discord),
    path('ajax/update_user', ajax.update_user),

    path('test', views.test),
    path('ajax_test', views.ajax_test),
]
