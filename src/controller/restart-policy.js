export function shouldRestartAfterFailure(error) {
  return error?.code === "ERR_EDGE_SANDBOX_TIMEOUT"
    || error?.code === "ERR_EDGE_CHILD_EXIT"
    || error?.code === "ERR_EDGE_CHILD_PROTOCOL";
}
