import socket
import json

from django.http import HttpResponse

from util.protocol.protocol import Protocol


def query_last_data(request):
    if request.method != 'GET':
        return HttpResponse('Wrong request method. Use GET.', content_type='text/plain')

    manager = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    protocol = Protocol(manager)
    manager.connect(('localhost', 9000))

    protocol.send({'type': 2, 'content': {'userId': request.session['user_id']}})

    obj = protocol.receive()

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
