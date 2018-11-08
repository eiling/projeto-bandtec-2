import json

from django.http import HttpResponse

from util.protocol import get_manager_response


def ping(request):
    if request.method != 'GET':
        return HttpResponse('Wrong request method. Use GET.', content_type='text/plain')

    res = get_manager_response({'type': 6, 'content': {'userId': request.session['user_id']}})

    if res['type'] == 0:
        obj = {'status': 0}
    else:
        obj = {'status': 1}

    return HttpResponse(json.dumps(obj), content_type='text/JSON')
