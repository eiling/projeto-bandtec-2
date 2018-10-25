import socket
import json

from django.http import HttpResponse

from util.protocol.protocol import Protocol


def signup(request):
    if request.method != 'POST':
        return HttpResponse('Wrong request method. Use POST.', content_type='text/plain')

    name = request.POST['name']
    username = request.POST['username']
    password = request.POST['password']
    repeat = request.POST['repeat-password']

    if password != repeat:
        return HttpResponse(json.dumps({'status': 1}), content_type='text/JSON')

    manager = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    protocol = Protocol(manager)
    manager.connect(('localhost', 9000))

    protocol.send({'type': 1, 'content': {
        'name': name,
        'username': username,
        'password': password,
    }})
    resp = protocol.receive()

    manager.close()

    if resp['type'] == 0:
        request.session['user_id'] = resp['content']['id']
        obj = {'status': 0}
    else:
        obj = {'status': 2}

    return HttpResponse(json.dumps(obj), content_type='text/JSON')
