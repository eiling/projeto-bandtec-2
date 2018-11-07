import socket
import json


class Protocol:
    def __init__(self, s: socket.socket):
        self.socket = s

    def receive(self):
        return json.loads(self._receive_message())

    def send(self, message):
        self._send_message(json.dumps(message))

    def _receive_message(self):
        received = 0

        header = bytearray(0)

        while received < 2:
            temp = self.socket.recv(2 - received)
            received += len(temp)
            header += temp

        length = (header[0] << 8) + header[1]

        received = 0

        message = bytearray(0)

        while received < length:
            temp = self.socket.recv(length - received)
            received += len(temp)
            message += temp

        return message  # .decode('utf-8')

    def _send_message(self, message: str):
        msg = bytearray(message, 'utf-8')

        length = len(msg)

        if length > 65535:
            raise ValueError('Message maximum length is 65535.')

        header = bytearray(2)
        header[0] = (length >> 8) & 0xff
        header[1] = length & 0xff

        sent_bytes = 0
        while sent_bytes < 2:
            sent_bytes += self.socket.send(header[sent_bytes:])

        sent_bytes = 0
        while sent_bytes < length:
            sent_bytes += self.socket.send(msg[sent_bytes:])
