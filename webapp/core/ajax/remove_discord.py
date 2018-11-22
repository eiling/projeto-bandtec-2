import json

from django.http import HttpResponse

from util.protocol import get_manager_response


def remove_discord(request):
    if request.method != 'POST':
        return HttpResponse('Wrong request method. Use POST.', content_type='text/plain')

    res = get_manager_response({'type': 10, 'content': {
        'userId': request.session['user_id'],
    }})

    if res['type'] == 0:
        obj = {'status': 0}
    else:
        obj = {'status': 1}
        print(res['content']['message'])

    return HttpResponse(json.dumps(obj), content_type='text/JSON')
