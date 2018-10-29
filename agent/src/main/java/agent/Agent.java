package agent;

import org.json.*;
import oshi.SystemInfo;
import oshi.hardware.CentralProcessor;
import oshi.util.FormatUtil;
import oshi.util.Util;
import protocol.ManagerProtocol;

import java.io.IOException;
import java.net.Socket;
import java.util.Arrays;

public class Agent {
  public static void main(String[] args) {
    try (
        var socket = new Socket("localhost", 9000);
        var protocol = new ManagerProtocol(socket)
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
}