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
        header = bytearray(2)
        self.socket.recv_into(header, 2)

        length = (header[0] >> 8) + header[1]

        message = bytearray(length)
        self.socket.recv_into(message, length)

        return message  # .decode('utf-8')

    def _send_message(self, message: str):
        msg = bytearray(message, 'utf-8')

        length = len(msg)

        header = bytearray(2)
        header[0] = (length >> 8) & 0xff
        header[1] = length & 0xff

        sent_bytes = 0
        while sent_bytes < 2:
            sent_bytes += self.socket.send(header[sent_bytes:])

        sent_bytes = 0
        while sent_bytes < length:
            sent_bytes += self.socket.send(msg[sent_bytes:])
