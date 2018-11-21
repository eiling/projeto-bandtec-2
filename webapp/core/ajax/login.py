import json

from django.http import HttpResponse

from util.protocol import get_manager_response


def login(request):
    if request.method != 'POST':
        return HttpResponse('Wrong request method. Use POST.', content_type='text/plain')

    u = request.POST['username']
    p = request.POST['password']

    res = get_manager_response({'type': 0, 'content': {'username': u, 'password': p}})

    if res['type'] == 0:
        request.session['user_id'] = res['content']['id']
        obj = {'status': 0}
    else:
        obj = {'status': 1}

    return HttpResponse(json.dumps(obj), content_type='text/JSON')
