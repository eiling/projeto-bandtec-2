from django.shortcuts import render, redirect

from util.protocol import get_manager_response


def index(request):
    if 'user_id' in request.session.keys():
        return redirect('/main_page')

    return render(request, 'core/index.html')


def signup(request):
    if 'user_id' in request.session.keys():
        return redirect('/main_page')

    return render(request, 'core/signup.html')


def main_page(request):
    if 'user_id' not in request.session.keys():
        return redirect('/')

    res = get_manager_response({'type': 4, 'content': {'userId': request.session['user_id']}})

    context = {
        'agents': res['content']['agents'],
    }

    return render(request, 'core/main_page.html', context)


def details(request, agent_id):
    if 'user_id' not in request.session.keys():
        return redirect('/')

    res = get_manager_response({'type': 5, 'content': {'agentId': agent_id, 'userId': request.session['user_id']}})

    if res['type'] == 0:
        return render(request, 'core/details.html', {'agent': res['content']['agent']})
    else:
        return render(request, 'core/details.html')


def agent_config(request, agent_id):
    if 'user_id' not in request.session.keys():
        return redirect('/')

    res = get_manager_response({'type': 5, 'content': {'agentId': agent_id, 'userId': request.session['user_id']}})

    if res['type'] == 0:
        return render(request, 'core/agent_config.html', {'agent': res['content']['agent']})
    else:
        return render(request, 'core/agent_config.html')


def logout(request):
    request.session.flush()

    return redirect('/')
