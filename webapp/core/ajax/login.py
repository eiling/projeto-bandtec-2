import socket
import json

from django.http import HttpResponse

from util.protocol.protocol import Protocol


def login(request):
    if request.method != 'POST':
        return HttpResponse('Wrong request method. Use POST.', content_type='text/plain')

    u = request.POST['username']
    p = request.POST['password']

    manager = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    protocol = Protocol(manager)
    manager.connect(('localhost', 9000))

    protocol.send({'type': 0, 'content': {'username': u, 'password': p}})
    resp = protocol.receive()

    manager.close()

    if resp['type'] == 0:
        request.session['user_id'] = resp['content']['id']
        obj = {'status': 0}
    else:
        obj = {'status': 1}

    return HttpResponse(json.dumps(obj), content_type='text/JSON')
