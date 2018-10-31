package agent.hardware;

import org.json.JSONObject;
import oshi.SystemInfo;
import oshi.hardware.GlobalMemory;

public class Memory {
  private static final Memory instance = new Memory();

  private final GlobalMemory globalMemory = new SystemInfo().getHardware().getMemory();

  public static JSONObject get(){
    final var m = instance.globalMemory;

    return new JSONObject()
        .put("available", m.getAvailable())
        .put("total", m.getTotal());
  }
}
