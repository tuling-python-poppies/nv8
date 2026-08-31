export function assertLiveRealm(record) {
  if (record === null || record.destroyed || record.context === null) {
    const error = new Error("Sandbox realm has been destroyed");
    error.code = "ERR_EDGE_REALM_DESTROYED";
    throw error;
  }
  return record;
}
