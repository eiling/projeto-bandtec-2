import socket

from util.protocol import Protocol


def get_manager_response(request):
    manager = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    protocol = Protocol(manager)
    manager.connect(('localhost', 9001))

    protocol.send(request)
    response = protocol.receive()

    manager.close()

    return response
