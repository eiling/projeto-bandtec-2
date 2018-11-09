import json

from django.http import HttpResponse

from util.protocol import get_manager_response


def register_agent(request):
    if request.method != 'POST':
        return HttpResponse('Wrong request method. Use POST.', content_type='text/plain')

    name = request.POST['name']
    interval = request.POST['interval']
    cpu = request.POST['cpu']
    memory = request.POST['memory']
    disc = request.POST['disc']
    agent_id = request.POST['agent-id']

    # validate fields

    res = get_manager_response({
        'type': 7,
        'content': {
            'name': name,
            'interval': interval,
            'cpu': cpu,
            'memory': memory,
            'disc': disc,
            'agentId': int(agent_id),
            'userId': request.session['user_id'],
        },
    })

    if res['type'] == 0:
        obj = {'status': 0}
    else:
        obj = {'status': 1}

    return HttpResponse(json.dumps(obj), content_type='text/JSON')
