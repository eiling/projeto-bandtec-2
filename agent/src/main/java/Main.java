import agent.Agent;

import java.io.IOException;

public class Main {
  public static void main(String[] args) {
    try (var agent = new Agent()) {
      agent.start();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
