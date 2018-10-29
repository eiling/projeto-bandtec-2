import socket
import json

from django.http import HttpResponse

from util.protocol.protocol import Protocol


def setup_discord_dm(request):
    if request.method != 'POST':
        return HttpResponse('Wrong request method. Use POST.', content_type='text/plain')

    user_tag = request.POST['discord-tag']

    manager = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    protocol = Protocol(manager)
    manager.connect(('localhost', 9000))

    protocol.send({'type': 3, 'content': {
        'userId': request.session['user_id'],
        'userTag': user_tag,
    }})
    resp = protocol.receive()

    manager.close()

    if resp['type'] == 0:
        obj = {'status': 0}
    else:
        obj = {'status': 1}
        print(resp['content']['message'])

    return HttpResponse(json.dumps(obj), content_type='text/JSON')
