package agent.resources.hardware;

import org.json.JSONObject;
import oshi.SystemInfo;
import oshi.hardware.CentralProcessor;

public class Processor {
  private static final Processor instance = new Processor();

  private final CentralProcessor centralProcessor = new SystemInfo().getHardware().getProcessor();

  private Processor() {
  }

  public static JSONObject get() {
    final var p = instance.centralProcessor;

    return new JSONObject()
        .put("systemCpuLoad", p.getSystemCpuLoad())
        .put("name", p.getName());
  }
}
