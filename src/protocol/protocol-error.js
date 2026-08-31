export class ProtocolError extends Error {
  constructor(message, code = "ERR_EDGE_PROTOCOL") {
    super(message);
    this.name = "ProtocolError";
    this.code = code;
  }
}

export class RemoteSandboxError extends Error {
  constructor(record) {
    super(record.message);
    this.name = record.name || "Error";
    this.code = record.code || "ERR_EDGE_SANDBOX";
    this.stack = record.stack || `${this.name}: ${this.message}`;
  }
}
