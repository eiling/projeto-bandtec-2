import agent.Agent;

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
          System.out.println(agent.login(username, password));
        } while (!agent.isLoggedIn());
      }

      System.out.println("Starting agent...");
      agent.start();
    } catch (IOException e) {
      e.printStackTrace();
      System.exit(1);
    }
  }
}
