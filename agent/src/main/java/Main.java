import agent.Agent;
import agent.Logger;

import java.io.IOException;
import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    try (var agent = new Agent()) {
      System.out.println("Enter username and password");  // because gradle delete later

      try (var in = new Scanner(System.in)) {
        do {
          System.out.print("Username: ");
          var username = in.nextLine();
          System.out.print("Password: ");
          var password = in.nextLine();
          Logger.log(agent.login(username, password));
        } while (!agent.isLoggedIn());
      }

      Logger.log("Starting agent");

      agent.start();

      Logger.log("Agent stopped");
    } catch (IOException e) {
      Logger.log(e);
    }
  }
}
