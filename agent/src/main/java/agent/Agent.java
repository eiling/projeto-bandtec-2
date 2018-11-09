package agent;

import agent.system.FileStores;
import agent.hardware.Memory;
import agent.hardware.Processor;
import org.json.*;
import oshi.SystemInfo;
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
    try (var reader = new BufferedReader(new FileReader("agent.cfg"))) {
      return Integer.parseInt(reader.readLine());
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

  private String getName(){
    var os = new SystemInfo().getOperatingSystem();
    return String.format(
        "%s %s - %d bits",
        os.getFamily(),
        os.getVersion().getVersion(),
        os.getBitness()
    );
  }

  public String login(String username, String password) throws IOException {
    protocol.send(new JSONObject()
        .put("type", 0)
        .put("content", new JSONObject()
            .put("username", username)
            .put("password", password)
            .put("agentId", getId())
            .put("agentName", getName())
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
          // don't send a response -> log any errors

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