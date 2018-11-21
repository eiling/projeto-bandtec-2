from django.shortcuts import render, redirect

from util.protocol import get_manager_response


def sign_in(request):
    if 'user_id' in request.session.keys():
        return redirect('/main_page')

    return render(request, 'core/sign-in.html')


def sign_up(request):
    if 'user_id' in request.session.keys():
        return redirect('/main_page')

    return render(request, 'core/old/signup.html')


def main_page(request):
    if 'user_id' not in request.session.keys():
        return redirect('/')

    res = get_manager_response({'type': 4, 'content': {'userId': request.session['user_id']}})

    context = {
        'agents': res['content']['agents'],
    }

    return render(request, 'core/old/main_page.html', context)


def details(request, agent_id):
    if 'user_id' not in request.session.keys():
        return redirect('/')

    res = get_manager_response({'type': 5, 'content': {'agentId': agent_id, 'userId': request.session['user_id']}})

    if res['type'] == 0:
        return render(request, 'core/old/details.html', {'agent': res['content']['agent']})
    else:
        return render(request, 'core/old/details.html')


def agent_config(request, agent_id):
    if 'user_id' not in request.session.keys():
        return redirect('/')

    res = get_manager_response({'type': 5, 'content': {'agentId': agent_id, 'userId': request.session['user_id']}})

    if res['type'] == 0:
        return render(request, 'core/old/agent_config.html', {'agent': res['content']['agent']})
    else:
        return render(request, 'core/old/agent_config.html')


def logout(request):
    request.session.flush()

    return redirect('/')


def test(request):
    return render(request, 'core/index.html')


def ajax_test(request):
    from django.http import HttpResponse
    if request.method != 'POST':
        return HttpResponse('Wrong request method. Use POST.', content_type='text/plain')
    return HttpResponse('{}', content_type='text/json')


def panel(request):
    return render(request, 'core/panel.html')