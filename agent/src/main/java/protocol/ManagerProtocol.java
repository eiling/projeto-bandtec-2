package protocol;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

public class ManagerProtocol implements AutoCloseable {
  private InputStream input;
  private OutputStream output;

  public ManagerProtocol(Socket socket) throws IOException {
    this.input = socket.getInputStream();
    this.output = socket.getOutputStream();
  }

  public JSONObject receive() throws IOException {
    try{
      return new JSONObject(getMessage());
    } catch (JSONException e){
      e.printStackTrace();
      return null;
    }
  }

  private String getMessage() throws IOException {
    var header = new byte[2];
    input.readNBytes(header, 0, 2);

    int length = (header[0] << 8) + header[1];
    var message = new byte[length];
    input.readNBytes(message, 0, length);

    return new String(message, StandardCharsets.UTF_8);
  }

  public void send(JSONObject message) throws IOException {
    sendMessage(message.toString());
  }

  private void sendMessage(String message) throws IOException {
    int length = message.length();

    if (length > 65535) {
      throw new IllegalArgumentException("Message maximum length is 65535.");
    }

    output.write(length >> 8);
    output.write((byte) length);

    output.write(message.getBytes(StandardCharsets.UTF_8));
  }

  @Override
  public void close(){
    try {
      input.close();
      output.close();
    } catch (IOException e){
      e.printStackTrace();
    }
  }
}
