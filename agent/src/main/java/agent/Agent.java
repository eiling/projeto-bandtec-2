package agent;

import agent.hardware.FileStores;
import agent.hardware.Memory;
import agent.hardware.Processor;
import org.json.*;
import util.protocol.Protocol;

import java.io.*;
import java.net.Socket;

public class Agent implements AutoCloseable {
  private final Socket socket;
  private final Protocol protocol;

  private boolean loggedIn;

  public Agent() throws IOException {
    socket = new Socket("localhost", 9000);
    protocol = new Protocol(socket);
  }

  private int getId() throws IOException {
    try {
      return Integer.parseInt(new BufferedReader(new FileReader("agent.cfg")).readLine());
    } catch (FileNotFoundException | NumberFormatException e) {
      new File("agent.cfg").createNewFile();

      try (var writer = new BufferedWriter(new FileWriter("agent.cfg"))) {
        writer.write("-1");
        writer.newLine();
      }

      return -1;
    }
  }

  private void setId(int id) throws IOException {
    try (var writer = new BufferedWriter(new FileWriter("agent.cfg"))) {
      writer.write(String.format("%d", id));
      writer.newLine();
    }
  }

  public String login(String username, String password) throws IOException {
    protocol.send(new JSONObject()
        .put("type", 0)
        .put("content", new JSONObject()
            .put("username", username)
            .put("password", password)
            .put("agentId", getId())
            .put("agentName", "NAME")
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
    var running = true;

    while (running) {
      var request = protocol.receive();

      switch (request.getInt("type")) {
        case 0:
          protocol.send(new JSONObject()
              .put("type", 0)
              .put("content", new JSONObject()
                  .put("processor", Processor.get())
                  .put("memory", Memory.get())
                  .put("fileStores", FileStores.get())
              )
          );

          break;

        case 1:  //register ID
          setId(request.getJSONObject("content").getInt("id"));
          protocol.send(new JSONObject()
              .put("type", 0)
              .put("content", new JSONObject()));

          break;

        default:
          System.out.println("broke");
          running = false;

          break;
      }
    }
  }

  public void start() throws IOException {
    if (!loggedIn) {
      throw new IllegalStateException("You must sign in first!");
    }

    loop();
  }

  @Override
  public void close() throws IOException {
    protocol.close();
    socket.close();
  }
}