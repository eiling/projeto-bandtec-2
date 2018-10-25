from django.shortcuts import render, redirect


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


def logout(request):
    request.session.flush()

    return redirect('/')
