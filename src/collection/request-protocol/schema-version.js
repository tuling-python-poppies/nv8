/**
 * Protocol result/registry lock schema compatibility.
 *
 * This version is independent from Frame Protocol and runtime artifact schema:
 * it describes the JSON representation emitted by the Protocol layer.
 */
export const PROTOCOL_SCHEMA_VERSION = '1.0';

export function parseProtocolSchemaVersion(version) {
  if (typeof version !== 'string' || !/^\d+\.\d+$/.test(version)) {
    throw new TypeError(`Protocol schemaVersion must be major.minor: "${version}"`);
  }
  const [major, minor] = version.split('.').map(Number);
  if (!Number.isSafeInteger(major) || !Number.isSafeInteger(minor)) {
    throw new TypeError(`Protocol schemaVersion is outside the safe integer range: "${version}"`);
  }
  return Object.freeze({ major, minor });
}

export function isProtocolSchemaCompatible(producerVersion, consumerVersion = PROTOCOL_SCHEMA_VERSION) {
  const producer = parseProtocolSchemaVersion(producerVersion);
  const consumer = parseProtocolSchemaVersion(consumerVersion);
  return producer.major === consumer.major && producer.minor <= consumer.minor;
}

export function assertProtocolSchemaCompatible(
  producerVersion,
  consumerVersion = PROTOCOL_SCHEMA_VERSION,
) {
  if (!isProtocolSchemaCompatible(producerVersion, consumerVersion)) {
    const error = new Error(
      `Protocol schema "${producerVersion}" is incompatible with consumer "${consumerVersion}"`,
    );
    error.code = 'PROTOCOL_SCHEMA_UNSUPPORTED';
    error.producerVersion = producerVersion;
    error.consumerVersion = consumerVersion;
    throw error;
  }
  return producerVersion;
}
