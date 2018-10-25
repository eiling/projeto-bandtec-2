package agent;

import org.json.*;
import oshi.SystemInfo;
import protocol.ManagerProtocol;

import java.io.IOException;
import java.net.Socket;

public class Agent {
  public static void main(String[] args) {
    try (
        var socket = new Socket("localhost", 9000);
        var protocol = new ManagerProtocol(socket)
    ) {
      var loginRequest = new JSONObject();

      loginRequest.put("type", 100);

      var content = new JSONObject();
      content.put("username", "user");
      content.put("password", "passwd");

      loginRequest.put("content", content);

      protocol.send(loginRequest);

      var loginResponse = protocol.receive();

      if(loginResponse.getInt("type") == 0){
        System.out.println("logged in");

        var sys = new SystemInfo();
        var hardware = sys.getHardware();
        var cpu = hardware.getProcessor();
        var mem = hardware.getMemory();

        while(true){
          var serverRequest = protocol.receive();  // ignored for now

          var data = new JSONObject();

          data.put("type", 0);  // not 0 means something wen't wrong

          content = new JSONObject();

          content.put("cpuLoad", cpu.getSystemCpuLoad());
          content.put("memTotal", mem.getTotal());
          content.put("memAvailable", mem.getAvailable());

          data.put("content", content);

          protocol.send(data);
        }
      }
    } catch (IOException e) {
      e.printStackTrace();
      System.exit(0);
    }
  }
}