package agent;

import agent.hardware.FileStores;

public class Test {
  public static void main(String[] args) {
   System.out.println(FileStores.get().toString());
  }
}
