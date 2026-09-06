import test from "node:test";
import assert from "node:assert/strict";

import { createSandbox } from "../src/public/create-sandbox.js";

const PAGE_HTML = `<!doctype html><html><body>
  <iframe id="blank"></iframe>
  <iframe id="srcdoc" srcdoc="<!doctype html><html><body><p>child</p></body></html>"></iframe>
</body></html>`;

test("blank and srcdoc iframes separate document URL from inherited origin", async () => {
  const sandbox = await createSandbox("https://parent.test/page", {
    page: { html: PAGE_HTML },
    limits: { timeoutMs: 30_000 },
  });
  try {
    const observed = JSON.parse(await sandbox.run(`JSON.stringify((() => {
      const blank = document.getElementById("blank");
      const srcdoc = document.getElementById("srcdoc");
      return {
        blank: {
          href: blank.contentWindow.location.href,
          origin: blank.contentWindow.location.origin,
          documentURL: blank.contentDocument.URL,
          sameOrigin: blank.contentWindow.document !== document
            && blank.contentWindow.document.defaultView === blank.contentWindow,
        },
        srcdoc: {
          href: srcdoc.contentWindow.location.href,
          origin: srcdoc.contentWindow.location.origin,
          documentURL: srcdoc.contentDocument.URL,
          sameOrigin: srcdoc.contentWindow.document !== document
            && srcdoc.contentWindow.document.defaultView === srcdoc.contentWindow,
        },
      };
    })())`));

    assert.deepEqual(observed, {
      blank: {
        href: "about:blank",
        origin: "https://parent.test",
        documentURL: "about:blank",
        sameOrigin: true,
      },
      srcdoc: {
        href: "about:srcdoc",
        origin: "https://parent.test",
        documentURL: "about:srcdoc",
        sameOrigin: true,
      },
    });
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
});

test("an opt-in prewarmed blank iframe keeps about:blank URL and inherited origin", async () => {
  const sandbox = await createSandbox("https://parent.test/page", {
    page: { html: "<!doctype html><html><body></body></html>" },
    limits: { prewarmChildRealms: 1, timeoutMs: 30_000 },
  });
  try {
    const observed = JSON.parse(await sandbox.run(`JSON.stringify((() => {
      const frame = document.createElement("iframe");
      document.body.appendChild(frame);
      return {
        available: frame.contentWindow !== null,
        href: frame.contentWindow?.location.href,
        origin: frame.contentWindow?.location.origin,
      };
    })())`));
    assert.deepEqual(observed, {
      available: true,
      href: "about:blank",
      origin: "https://parent.test",
    });
  } finally {
    await sandbox.close();
    createSandbox.drain();
  }
});
