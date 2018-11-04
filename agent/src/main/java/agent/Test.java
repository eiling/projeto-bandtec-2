package agent;

import agent.hardware.FileStores;
import oshi.SystemInfo;

public class Test {
  public static void main(String[] args) {
    System.out.println(new SystemInfo().getHardware().getComputerSystem().getBaseboard().getSerialNumber());
    // System.out.println(FileStores.get().toString(2));
  }
}
