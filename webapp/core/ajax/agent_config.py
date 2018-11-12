import json

from django.http import HttpResponse

from util.protocol import get_manager_response


def change_agent(request):
    if request.method != 'POST':
        return HttpResponse('Wrong request method. Use POST.', content_type='text/plain')

    name = request.POST['name']
    interval = request.POST['interval']
    cpu = request.POST['cpu']
    memory = request.POST['memory']
    disk = request.POST['disk']
    agent_id = int(request.POST['agent-id'])

    # validate fields

    res = get_manager_response({
        'type': 7,
        'content': {
            'agentParams': {
                'id': agent_id,
                'name': name,
                'interval': interval,
                'cpu': cpu,
                'memory': memory,
                'disk': disk,
            },
            'userId': request.session['user_id'],
        },
    })

    if res['type'] == 0:
        obj = {'status': 0}
    else:
        obj = {'status': 1, 'message': res['content']['message']}

    return HttpResponse(json.dumps(obj), content_type='text/JSON')


def remove_agent(request):
    if request.method != 'POST':
        return HttpResponse('Wrong request method. Use POST.', content_type='text/plain')

    agent_id = int(request.POST['agent-id'])

    # validate fields

    res = get_manager_response({
        'type': 8,
        'content': {
            'userId': request.session['user_id'],
            'agentId': agent_id,
        },
    })

    if res['type'] == 0:
        obj = {'status': 0}
    else:
        obj = {'status': 1, 'message': res['content']['message']}

    return HttpResponse(json.dumps(obj), content_type='text/JSON')
