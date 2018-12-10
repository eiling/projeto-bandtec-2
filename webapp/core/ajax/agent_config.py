import json

from django.http import HttpResponse

from util.protocol import get_manager_response


def change_agent(request):
    if request.method != 'POST':
        return HttpResponse('Wrong request method. Use POST.', content_type='text/plain')

    # name, interval, interval-unit-select
    # monitor-processor, alert-processor, processor
    # monitor-memory, alert-memory, memory-select, memory, memory-unit-select
    # monitor-disk, alert-disk, memory-disk, disk, disk-unit-select
    # agent-id

    name = request.POST['name']

    temp = request.POST['interval']
    if temp:
        interval = int(temp)
        unit = int(request.POST['interval-unit-select'])
        if unit == 1:
            interval *= 1000
        elif unit == 2:
            interval *= 60000
        elif unit == 3:
            interval *= 3600000
        else:
            interval = None
    else:
        interval = None

    if 'monitor-processor' in request.POST.keys():
        if 'alert-processor' in request.POST.keys():
            temp = request.POST['processor']
            if temp:
                cpu = -int(temp)
            else:
                cpu = None
        else:
            cpu = -101
    else:
        cpu = -102

    if 'monitor-memory' in request.POST.keys():
        if 'alert-memory' in request.POST.keys():
            temp = request.POST['memory']
            if temp:
                memory = int(temp)
                alert_type = int(request.POST['memory-select'])
                if alert_type == 1:
                    memory = -memory
                elif alert_type == 2:
                    unit = int(request.POST['memory-unit-select'])
                    if unit == 1:
                        memory *= 1024
                    elif unit == 2:
                        memory *= 1024 ** 2
                    elif unit == 3:
                        memory *= 1024 ** 3
                    else:
                        memory = None
                else:
                    memory = None
            else:
                memory = None
        else:
            memory = -101
    else:
        memory = -102

    if 'monitor-disk' in request.POST.keys():
        if 'alert-disk' in request.POST.keys():
            temp = request.POST['disk']
            if temp:
                disk = int(temp)
                alert_type = int(request.POST['disk-select'])
                if alert_type == 1:
                    disk = -disk
                elif alert_type == 2:
                    unit = int(request.POST['disk-unit-select'])
                    if unit == 1:
                        disk *= 1024
                    elif unit == 2:
                        disk *= 1024 ** 2
                    elif unit == 3:
                        disk *= 1024 ** 3
                    else:
                        disk = None
                else:
                    disk = None
            else:
                disk = None
        else:
            disk = -101
    else:
        disk = -102

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
