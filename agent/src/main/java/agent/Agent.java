package agent;

import agent.hardware.FileStores;
import agent.hardware.Memory;
import agent.hardware.Processor;
import org.json.*;
import oshi.SystemInfo;
import oshi.util.FormatUtil;
import util.protocol.Protocol;

import java.io.IOException;
import java.net.Socket;

public class Agent implements AutoCloseable {
  private final Socket socket;
  private final Protocol protocol;

  private boolean loggedIn;

  public Agent() throws IOException {
    socket = new Socket("localhost", 9000);
    protocol = new Protocol(socket);
  }

  public String login(String username, String password) throws IOException {
    protocol.send(new JSONObject()
        .put("type", 0)
        .put("content", new JSONObject()
            .put("username", username)
            .put("password", password)
        )
    );

    var response = protocol.receive();

    if (response.getInt("type") == 0) {
      loggedIn = true;

      return null;
    } else {
      return response.getJSONObject("content").getString("message");
    }
  }

  private void loop() throws IOException {
    while (true) {
      var request = protocol.receive();

      if (request.getInt("type") != 0) {
        System.out.println("broke");
        break;
      }

      protocol.send(new JSONObject()
          .put("type", 0)
          .put("content", new JSONObject()
              .put("processor", Processor.get())
              .put("memory", Memory.get())
              .put("fileStores", FileStores.get())
          )
      );
    }
  }

  public void start() throws IOException {
    if(!loggedIn) {
      throw new IllegalStateException("You must sign in first!");
    }

    loop();
  }

  public static void main(String[] args) {
    try (
        var socket = new Socket("localhost", 9000);
        var protocol = new Protocol(socket)
    ) {
      var loginRequest = new JSONObject();

      loginRequest.put("type", 100);

      var content = new JSONObject();
      content.put("username", "a");
      content.put("password", "a");

      loginRequest.put("content", content);

      protocol.send(loginRequest);

      var loginResponse = protocol.receive();

      if (loginResponse.getInt("type") == 0) {
        System.out.println("logged in");

        var sys = new SystemInfo();
        var hardware = sys.getHardware();
        var cpu = hardware.getProcessor();
        var mem = hardware.getMemory();

        while (true) {
          var serverRequest = protocol.receive();  // PARSE PARAMETERS FROM HERE

          var data = new JSONObject();

          data.put("type", 0);  // not 0 means something wen't wrong

          content = new JSONObject();

          content.put("cpuLoad", String.format("%.1f%%", cpu.getSystemCpuLoad() * 100));
          content.put("memory", String.format("%.1f%% (%s/%s)",
              (double) (mem.getTotal() - mem.getAvailable()) * 100 / (double) mem.getTotal(),
              FormatUtil.formatBytes(mem.getTotal() - mem.getAvailable()),
              FormatUtil.formatBytes(mem.getTotal())
          ));

          data.put("content", content);

          protocol.send(data);
        }
      }
    } catch (IOException e) {  // fix this later
      e.printStackTrace();
      System.exit(0);
    }
  }

  @Override
  public void close() throws IOException {
    protocol.close();
    socket.close();
  }
}