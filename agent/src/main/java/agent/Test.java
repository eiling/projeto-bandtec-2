package agent;

import oshi.SystemInfo;

public class Test {
  public static void main(String[] args) {
    System.out.println(new SystemInfo().getOperatingSystem().getFamily());
    System.out.println(new SystemInfo().getOperatingSystem().getBitness());
    System.out.println(new SystemInfo().getOperatingSystem().getManufacturer());
    System.out.println(new SystemInfo().getOperatingSystem().getVersion().getBuildNumber());
    System.out.println(new SystemInfo().getOperatingSystem().getVersion().getCodeName());
    System.out.println(new SystemInfo().getOperatingSystem().getVersion().getVersion());
  }
}
