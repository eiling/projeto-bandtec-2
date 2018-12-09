import json

from django.http import HttpResponse

from util.protocol import get_manager_response


def query_last_alerts(request):
    if request.method != 'GET':
        return HttpResponse('Wrong request method. Use GET.', content_type='text/plain')

    obj = get_manager_response({
        'type': 14,
        'content': {
            'agentId': int(request.GET['id']),
            'userId': request.session['user_id'],
        },
    })

    if obj['type'] == 0:
        alerts = []
        for alert in obj['content']['alerts']:
            alerts.append({
                'resource': alert['type'],
                'threshold': {
                    'value': alert['threshold'] if alert['threshold'] >= 0 else -alert['threshold'],
                    'type': 0 if alert['threshold'] >= 0 else 1,
                },
                'begin': alert['beginTime'],
                'end': alert['endTime'],
            })

        response = {
            'status': 0,
            'content': {
                'alerts': alerts,
            },
        }
    else:
        response = {
            'status': 1,
            'content': {
                'type': obj['type'],
                'message': obj['content']['message'],
            },
        }

    return HttpResponse(json.dumps(response), content_type='text/JSON')
