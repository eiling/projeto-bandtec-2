import json

from django.http import HttpResponse

from util.protocol import get_manager_response


def query_last_data(request):
    if request.method != 'GET':
        return HttpResponse('Wrong request method. Use GET.', content_type='text/plain')

    obj = get_manager_response({
        'type': 2,
        'content': {
            'agentId': int(request.GET['id']),
            'userId': request.session['user_id'],
        },
    })

    if obj['type'] == 0:
        response = {
            'status': 0,
            'content': obj['content'],
        }
    else:
        response = {
            'status': 1,
        }

    return HttpResponse(json.dumps(response), content_type='text/JSON')
