package agent.hardware;

import org.json.JSONArray;
import org.json.JSONObject;
import oshi.SystemInfo;
import oshi.software.os.OSFileStore;

public class FileStores {
  private static final FileStores instance = new FileStores();

  private final OSFileStore[] fileStores =
      new SystemInfo().getOperatingSystem().getFileSystem().getFileStores();

  public static JSONArray get(){
    var fileStores = new JSONArray();

    for (var fileStore :
        instance.fileStores) {
      fileStores.put(new JSONObject()
          .put("mount", fileStore.getMount())
          .put("usableSpace", fileStore.getUsableSpace())
          .put("totalSpace", fileStore.getTotalSpace())
      );
    }

    return fileStores;
  }
}
