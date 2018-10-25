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

  public ManagerProtocol(Socket socket) {
    try {
      this.input = socket.getInputStream();
      this.output = socket.getOutputStream();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public JSONObject receive(){
    try{
      var m = getMessage();
      if (m == null){
        return null;
      }

      return new JSONObject(m);
    } catch (JSONException e){
      e.printStackTrace();
      return null;
    }
  }

  private String getMessage() {
    try {
      var header = new byte[2];
      input.readNBytes(header, 0, 2);

      int length = (header[0] << 8) + header[1];
      var message = new byte[length];
      input.readNBytes(message, 0, length);

      return new String(message, StandardCharsets.UTF_8);
    } catch (IOException e) {
      e.printStackTrace();
      return null;
    }
  }

  public void send(JSONObject message){
    sendMessage(message.toString());
  }

  private void sendMessage(String message) {
    int length = message.length();

    if (length > 65535) {
      throw new IllegalArgumentException("Message maximum length is 65535.");
    }

    try {
      output.write(length >> 8);
      output.write((byte) length);

      output.write(message.getBytes(StandardCharsets.UTF_8));
    } catch (IOException e) {
      e.printStackTrace();
    }
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
