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

    return render(request, 'core/main_page.html')


def test(request):
    if 'user_id' not in request.session.keys():
        return redirect('/')

    res = get_manager_response({'type': 4, 'content': {'userId': request.session['user_id']}})

    context = {
        'agents': {
            'registered': res['content']['registered'],
            'unregistered': res['content']['unregistered'],
        },
    }

    return render(request, 'core/test.html', context)


def logout(request):
    request.session.flush()

    return redirect('/')
