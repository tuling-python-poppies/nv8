import {
  ArtifactKind,
  createArtifactSet,
  createProtocolRegistry,
  createRequestPlan,
  createRuntimeArtifact,
  createTransform,
  defineProtocolAdapter,
} from '../src/collection/request-protocol/index.js';
import {
  createCollector,
  createStubTransport,
} from '../src/collection/collector/index.js';

const request = createRequestPlan({
  method: 'GET',
  url: 'https://example.test/api',
});
const artifacts = createArtifactSet([
  createRuntimeArtifact({
    id: 'example.signature',
    kind: ArtifactKind.SIGNATURE,
    value: 'offline-signature',
    producer: 'example-script',
  }),
]);
const adapter = defineProtocolAdapter({
  id: 'example-signer',
  version: '1.0.0',
  consumes: [{ id: 'example.signature' }],
  plan: ({ artifacts: input }) => [
    createTransform('set-header', {
      name: 'x-signature',
      value: input.require('example.signature').value,
    }),
  ],
});
const protocolResult = createProtocolRegistry([adapter]).apply({
  request,
  artifacts,
});

const transport = createStubTransport([{
  match: () => true,
  response: { status: 200, headers: [['content-type', 'application/json']], body: { ok: true } },
}]);
const collector = createCollector({
  transport,
  policy: {
    enabled: true,
    allowedOrigins: ['https://example.test'],
  },
});

try {
  const result = await collector.send(protocolResult.plan);
  console.log(JSON.stringify({
    status: result.response.status,
    signature: result.request.headers.find(({ name }) => name === 'x-signature')?.values,
    transportCalls: transport.calls.length,
  }, null, 2));
} finally {
  await collector.dispose();
}
