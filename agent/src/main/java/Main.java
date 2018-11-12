import agent.Agent;

import java.io.IOException;

public class Main {
  public static void main(String[] args) {
    try (var agent = new Agent()) {
      while(agent.login("a", "a") != null);

      agent.start();
    } catch (IOException e) {
      e.printStackTrace();
      System.exit(1);
    }
  }
}
