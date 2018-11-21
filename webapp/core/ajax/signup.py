import json

from django.http import HttpResponse

from util.protocol import get_manager_response


def signup(request):
    if request.method != 'POST':
        return HttpResponse('Wrong request method. Use POST.', content_type='text/plain')

    name = request.POST['name']
    username = request.POST['username']
    password = request.POST['password']
    repeat = request.POST['repeat-password']

    # field validations go here
    if password != repeat:
        return HttpResponse(json.dumps({'status': 1}), content_type='text/JSON')

    res = get_manager_response({'type': 1, 'content': {
        'name': name,
        'username': username,
        'password': password,
    }})

    if res['type'] == 0:
        # request.session['user_id'] = res['content']['id']  login the user?
        obj = {'status': 0}
    else:
        obj = {'status': 2}
        print(res['content']['message'])

    return HttpResponse(json.dumps(obj), content_type='text/JSON')
