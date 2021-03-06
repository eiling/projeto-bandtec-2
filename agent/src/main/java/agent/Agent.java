package agent;

import agent.resources.system.FileStores;
import agent.resources.hardware.Memory;
import agent.resources.hardware.Processor;
import org.json.*;
import oshi.SystemInfo;
import agent.util.protocol.Protocol;

import java.io.*;
import java.net.Socket;

public class Agent implements AutoCloseable {
  private final Socket socket;
  private final Protocol protocol;

  private boolean loggedIn;

  public Agent() throws IOException {
    socket = new Socket("35.237.245.135", 9000);
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

  private String getName() {
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
      setId(response.getJSONObject("content").getInt("id"));

      return "Logged in";
    } else {
      return response.getJSONObject("content").getString("message");
    }
  }

  public boolean isLoggedIn(){
    return loggedIn;
  }

  private void loop() throws IOException {
    while (true) {
      var request = protocol.receive();

      Logger.log("Received request");

      if (request.getInt("type") == 0) {
        var content = new JSONObject();

        var resources = request.getJSONObject("content").getJSONArray("resources");

        Logger.log("Request resources: " + resources);

        for(int i = 0, l = resources.length(); i < l; i++){
          switch (resources.getString(i)){
            case "cpu":
              content.put("processor", Processor.get());
              break;

            case "memory":
              content.put("memory", Memory.get());
              break;

            case "disk":
              content.put("fileStores", FileStores.get());
              break;

            default:  // ignore
              break;
          }
        }

        Logger.log("Sending data");

        protocol.send(new JSONObject()
            .put("type", 0)
            .put("content", content)
        );
      } else {
        Logger.log("Request status is not zero");
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
