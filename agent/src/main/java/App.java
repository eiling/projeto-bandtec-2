//import oshi.SystemInfo;
//
//public class App {
//  public static void main(String[] args) {
//    var sys = new SystemInfo();
//    var hardware = sys.getHardware();
//    var cpu = hardware.getProcessor();
//    var mem = hardware.getMemory();
//
//    var memUsed = mem.getTotal() - mem.getAvailable();
//
//    while (true) {
//      try {
//        System.out.println("CPU:           " + cpu.getSystemCpuLoad());
//        System.out.println("Memoria Total: " + mem.getTotal());
//        System.out.println("Memoria Free:  " + mem.getAvailable());
//        System.out.println("Memoria Usada: " + memUsed);
//        Thread.sleep(1000);
//      } catch (Exception ignored) {
//      }
//    }
//
//
//  }
//}
