import {
  createCollector,
  createMemoryResultSink,
  createStubTransport,
  PaginationStop,
  createPaginationScheduler,
} from '../src/collection/collector/index.js';

const pages = [
  { cursor: 'page-1', items: [{ id: 1 }, { id: 2 }] },
  { cursor: 'page-2', items: [{ id: 2 }, { id: 3 }] },
];
let call = 0;
const transport = createStubTransport([{
  match: () => true,
  respond: () => {
    const page = pages[call++] ?? { cursor: null, items: [] };
    return {
      status: 200,
      headers: [],
      body: page,
    };
  },
}]);
const collector = createCollector({
  transport,
  policy: {
    enabled: true,
    allowedOrigins: ['https://example.test'],
  },
});
const sink = createMemoryResultSink({
  batchSize: 2,
  keyOf: item => item.id,
});
const scheduler = createPaginationScheduler({
  collector,
  nextRequest: ({ index, previous }) => {
    if (index >= pages.length) return null;
    const cursor = previous?.response.body.cursor ?? 'page-1';
    return {
      method: 'GET',
      url: `https://example.test/items?cursor=${encodeURIComponent(cursor)}`,
    };
  },
  extractItems: page => page.response.body.items,
  cursorOf: page => page.response.body.cursor,
  limits: { maxPages: 4 },
});

try {
  let stop = null;
  for await (const page of scheduler.pages()) {
    if (page.stop !== null) {
      stop = page.stop;
      break;
    }
    await sink.write(page.items);
  }
  await sink.close();
  console.log(JSON.stringify({
    stop: stop?.reason ?? PaginationStop.EXHAUSTED,
    items: sink.items(),
    sink: sink.stats(),
    requests: transport.calls.length,
  }, null, 2));
} finally {
  await collector.dispose();
}
