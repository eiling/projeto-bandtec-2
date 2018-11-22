import json

from django.http import HttpResponse

from util.protocol import get_manager_response


def update_user(request):
    if request.method != 'POST':
        return HttpResponse('Wrong request method. Use POST.', content_type='text/plain')

    name = request.POST['name']
    username = request.POST['username']
    password = request.POST['password']
    repeat = request.POST['confirm-password']
    current = request.POST['current-password']

    # field validations go here
    if password != repeat:
        return HttpResponse(json.dumps({'status': 1}), content_type='text/JSON')

    params = {}

    if name:
        params['name'] = name
    if username:
        params['username'] = username
    if password:
        params['password'] = password

    res = get_manager_response({'type': 12, 'content': {
        'userId': request.session['user_id'],
        'currentPassword': current,
        'params': params,
    }})

    if res['type'] == 0:
        obj = {'status': 0}
    else:
        obj = {'status': 2}
        print(res['content']['message'])

    return HttpResponse(json.dumps(obj), content_type='text/JSON')
