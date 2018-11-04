package agent;

import agent.hardware.FileStores;
import agent.hardware.Memory;
import agent.hardware.Processor;
import org.json.*;
import oshi.SystemInfo;
import oshi.util.FormatUtil;
import util.protocol.Protocol;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.Socket;
import java.util.Scanner;

public class Agent implements AutoCloseable {
  private final Socket socket;
  private final Protocol protocol;

  private int id;

  private boolean loggedIn;

  public Agent() throws IOException {
    socket = new Socket("localhost", 9000);
    protocol = new Protocol(socket);

    id = getId();
  }

  private int getId(){
    try{
      return new Scanner(new File("agent.cfg")).nextInt();
    } catch (FileNotFoundException e) {
      e.printStackTrace();
      return -1;
    }
  }

  private void setId(int id){
    this.id = id;


  }

  public String login(String username, String password) throws IOException {
    protocol.send(new JSONObject()
        .put("type", 0)
        .put("content", new JSONObject()
            .put("username", username)
            .put("password", password)
            .put("id", id)
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

  @Override
  public void close() throws IOException {
    protocol.close();
    socket.close();
  }
}