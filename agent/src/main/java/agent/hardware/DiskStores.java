package agent.hardware;

import org.json.JSONArray;
import org.json.JSONObject;
import oshi.SystemInfo;
import oshi.hardware.HWDiskStore;

public class DiskStores {
  private static final DiskStores instance = new DiskStores();

  private final HWDiskStore[] diskStores = new SystemInfo().getHardware().getDiskStores();

  private DiskStores() {
  }

  public static JSONArray get() {
    final var diskStores = instance.diskStores;

    final var diskStoresJson = new JSONArray();

    for (var diskStore :
        diskStores) {
      final var diskStoreJson = new JSONObject();

      diskStoreJson.put("name", diskStore.getName());
      diskStoreJson.put("size", diskStore.getSize());

      final var partitionsJson = new JSONArray();

      var partitions = diskStore.getPartitions();

      for (var partition :
          partitions) {
        final var partitionJson = new JSONObject();

        partitionJson.put("name", partition.getName());
        partitionJson.put("size", partition.getSize());
        partitionJson.put("major", partition.getMajor());
        partitionJson.put("minor", partition.getMinor());
        partitionJson.put("mountPoint", partition.getMountPoint());

        partitionsJson.put(partitionJson);
      }

      diskStoreJson.put("partitions", partitionsJson);

      diskStoresJson.put(diskStoreJson);
    }

    return diskStoresJson;
  }
}
