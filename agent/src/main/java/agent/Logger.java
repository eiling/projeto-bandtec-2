package agent;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class Logger {
  private static final String separator = System.getProperty("file.separator");

  private static final Logger instance = new Logger();

  private BufferedWriter writer;

  private Logger() {
    new File("log").mkdir();

    try {
      writer = new BufferedWriter(new FileWriter(new File(
          String.format(".%slog%s%d.log", separator, separator, System.currentTimeMillis())
      )));
    } catch (IOException e) {
      System.err.println("Error initialising Logger");
      e.printStackTrace();
      System.exit(0);
    }
  }

  public static void log(Object o) {
    var writer = instance.writer;

    try {
      writer.write("TIMESTAMP: " + System.currentTimeMillis());
      writer.newLine();
      writer.write(o.toString());
      writer.newLine();
      writer.newLine();
      writer.flush();
    } catch (IOException ignored) {
    }
  }
}
