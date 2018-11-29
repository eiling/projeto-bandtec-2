# coding=utf-8
from django.http import HttpResponse
from django.shortcuts import render, redirect

from util.protocol import get_manager_response


def sign_in(request):
    if 'user_id' in request.session.keys():
        return redirect('/panel')

    return render(request, 'core/sign-in.html')


def sign_up(request):
    if 'user_id' in request.session.keys():
        return redirect('/panel')

    return render(request, 'core/sign-up.html')


def panel(request):
    if 'user_id' not in request.session.keys():
        return redirect('/')

    res = get_manager_response({'type': 4, 'content': {'userId': request.session['user_id']}})
    agents = res['content']['agents']

    context = {
        'agents': agents,
    }

    res = get_manager_response({'type': 11, 'content': {'userId': request.session['user_id']}})

    if res['type'] == 0:
        context['name'] = res['content']['user']['name']
    else:
        context['name'] = 'usuário'

    return render(request, 'core/panel.html', context)


def records(request):
    if 'user_id' not in request.session.keys():
        return redirect('/')

    res = get_manager_response({'type': 4, 'content': {'userId': request.session['user_id']}})
    agents = res['content']['agents']

    context = {
        'agents': agents,
    }

    res = get_manager_response({'type': 11, 'content': {'userId': request.session['user_id']}})

    if res['type'] == 0:
        context['name'] = res['content']['user']['name']
    else:
        context['name'] = 'usuário'

    return render(request, 'core/records.html', context)


def settings(request):
    if 'user_id' not in request.session.keys():
        return redirect('/')

    res = get_manager_response({'type': 4, 'content': {'userId': request.session['user_id']}})
    agents = res['content']['agents']

    context = {
        'agents': agents,
    }

    res = get_manager_response({'type': 9, 'content': {'userId': request.session['user_id']}})

    if res['type'] == 0:
        context['discord_tag'] = res['content']['discordTag']

    res = get_manager_response({'type': 11, 'content': {'userId': request.session['user_id']}})

    if res['type'] == 0:
        context['name'] = res['content']['user']['name']
    else:
        context['name'] = 'usuário'

    return render(request, 'core/settings.html', context)


def agent_panel(request, agent_id):
    if 'user_id' not in request.session.keys():
        return redirect('/')

    res = get_manager_response({'type': 2, 'content': {'agentId': agent_id, 'userId': request.session['user_id']}})

    if res['type'] == 1:
        return redirect('/panel')
    elif res['type'] != 0:
        return HttpResponse('Agent not found', content_type='text/plain')

    context = {
        'data': res['content']['data']
    }

    res = get_manager_response({'type': 5, 'content': {'agentId': agent_id, 'userId': request.session['user_id']}})

    if res['type'] == 0:
        context['agent_name'] = res['content']['agent']['name']
        context['agent_id'] = res['content']['agent']['id']

    res = get_manager_response({'type': 11, 'content': {'userId': request.session['user_id']}})

    if res['type'] == 0:
        context['name'] = res['content']['user']['name']
    else:
        context['name'] = 'usuário'

    return render(request, 'core/agent_panel.html', context)


def agent_settings(request, agent_id):
    if 'user_id' not in request.session.keys():
        return redirect('/')

    res = get_manager_response({'type': 5, 'content': {'agentId': agent_id, 'userId': request.session['user_id']}})

    if res['type'] == 0:
        return render(request, 'core/agent_settings.html', {'agent': res['content']['agent']})
    else:
        return redirect('/settings')


def results(request):
    if 'user_id' not in request.session.keys():
        return redirect('/')

    context = {
        'begin_date': request.GET['begin-date'],
        'end_date': request.GET['end-date'],
    }

    res = get_manager_response({'type': 13, 'content': {
        'userId': request.session['user_id'],
        'agentId': request.GET['agent-select'],
        'beginDate': request.GET['begin-date'],
        'endDate': request.GET['end-date'],
    }})

    if res['type'] == 0:
        context['agent_name'] = res['content']['agentName']

    res = get_manager_response({'type': 11, 'content': {'userId': request.session['user_id']}})

    if res['type'] == 0:
        context['name'] = res['content']['user']['name']
    else:
        context['name'] = 'usuário'

    return render(request, 'core/results.html', context)


def logout(request):
    request.session.flush()

    return redirect('/')









def details(request, agent_id):
    if 'user_id' not in request.session.keys():
        return redirect('/')

    res = get_manager_response({'type': 5, 'content': {'agentId': agent_id, 'userId': request.session['user_id']}})

    if res['type'] == 0:
        return render(request, 'core/old/details.html', {'agent': res['content']['agent']})
    else:
        return render(request, 'core/old/details.html')


def main_page(request):
    if 'user_id' not in request.session.keys():
        return redirect('/')

    res = get_manager_response({'type': 4, 'content': {'userId': request.session['user_id']}})

    context = {
        'agents': res['content']['agents'],
    }

    return render(request, 'core/old/main_page.html', context)


def test(request):
    return render(request, 'core/settings.html')


def ajax_test(request):
    from django.http import HttpResponse
    if request.method != 'POST':
        return HttpResponse('Wrong request method. Use POST.', content_type='text/plain')
    return HttpResponse('{}', content_type='text/json')
