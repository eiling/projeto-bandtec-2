package agent.system;

import org.json.JSONArray;
import org.json.JSONObject;
import oshi.SystemInfo;
import oshi.software.os.FileSystem;

public class FileStores {
  private static final FileStores instance = new FileStores();

  private final FileSystem fileSystem =
      new SystemInfo().getOperatingSystem().getFileSystem();

  private FileStores() {
  }

  public static JSONArray get() {
    final var fileStores = new JSONArray();

    final var fss = instance.fileSystem.getFileStores();

    for (var fileStore :
        fss) {
      fileStores.put(new JSONObject()
          .put("mount", fileStore.getMount())
          .put("usableSpace", fileStore.getUsableSpace())
          .put("totalSpace", fileStore.getTotalSpace())
          .put("description", fileStore.getDescription())
      );
    }

    return fileStores;
  }
}
