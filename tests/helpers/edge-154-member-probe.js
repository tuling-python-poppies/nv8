export function edge154MemberProbe() {
  const attempt = callback => {
    try { return { value: callback() }; }
    catch (error) { return { name: error.name, message: error.message }; }
  };
  const parent = document.createElement("div");
  const element = document.createElement("div");
  parent.appendChild(element);
  document.body.appendChild(parent);
  const attributes = [null, "", "on", "off", "ON", "OFF", "foo"].map(value => {
    if (value === null) element.removeAttribute("autocorrect");
    else element.setAttribute("autocorrect", value);
    return [value, element.autocorrect];
  });
  parent.setAttribute("autocorrect", "off");
  element.removeAttribute("autocorrect");
  const inherited = element.autocorrect;
  const assignments = [false, true, "off", "", null, undefined, 0, 1].map(value => {
    element.autocorrect = value;
    return [String(value), element.autocorrect, element.getAttribute("autocorrect")];
  });
  parent.remove();

  const face = new FontFace("Test", "url(test.woff2)");
  const widths = ["normal", "expanded", "condensed", "50%", "invalid", "EXpanded",
    "75% 125%", "0%", "-1%", "+5.5%", "100.00%", "1e2%", "100% 50%",
    "ultra-expanded", "semi-expanded", "normal condensed", "inherit", "  Expanded  "]
    .map(value => [value, attempt(() => { face.width = value; return face.width; })]);
  const constructors = ["invalid", "expanded", "75% 125%"].map(value => {
    const font = new FontFace("Test", "url(test.woff2)", { width: value });
    font.loaded.catch(() => {});
    return [value, font.width, font.status];
  });
  face.width = "expanded";
  const alias = [face.width, face.stretch];
  face.stretch = "condensed";
  alias.push(face.width, face.stretch);

  let iterator = null;
  if (typeof Iterator === "function") {
    let closed = 0;
    function* values() { try { yield 1; yield 2; } finally { closed += 1; } }
    const includes = Iterator.from(values()).includes(1);
    let nextReads = 0;
    let valueReads = 0;
    const joined = Iterator.prototype.join.call({
      get next() {
        nextReads += 1;
        let count = 0;
        return () => ++count > 1 ? { done: true } : {
          done: false, get value() { valueReads += 1; return "a"; },
        };
      },
    });
    let returnCalls = 0;
    const abrupt = attempt(() => Iterator.prototype.join.call({
      next() { return { done: false, value: { toString() { throw new Error("original"); } } }; },
      return() { returnCalls += 1; throw new Error("close"); },
    }));
    const steps = {};
    for (const method of ["join", "includes"]) {
      steps[method] = {};
      for (const stage of ["next", "done", "value"]) {
        let returns = 0;
        const target = {
          next() {
            if (stage === "next") throw new Error(stage);
            return {
              get done() { if (stage === "done") throw new Error(stage); return false; },
              get value() { if (stage === "value") throw new Error(stage); return 1; },
            };
          },
          return() { returns += 1; return { done: true }; },
        };
        steps[method][stage] = {
          result: attempt(() => Iterator.prototype[method].call(target, method === "join" ? "|" : 1)),
          returns,
        };
      }
    }
    let separatorReturns = 0;
    const separator = attempt(() => Iterator.prototype.join.call({
      get next() { throw new Error("next must not be read"); },
      return() { separatorReturns += 1; return { done: true }; },
    }, { toString() { throw new Error("separator"); } }));
    iterator = { includes, closed, joined, nextReads, valueReads, abrupt, returnCalls,
      steps, separator, separatorReturns, sameValueZero: Iterator.from([NaN]).includes(NaN),
      nullValues: Iterator.from([null, undefined, 1]).join("|") };
  }

  const capture = {};
  for (const tag of ["camera", "microphone"]) {
    const target = document.createElement(tag);
    const events = [];
    target.ontrack = function (event) { events.push(["first", event.type, this === target]); };
    target.addEventListener("track", () => events.push(["listener"]));
    target.ontrack = function (event) { events.push(["replacement", event.type, this === target]); };
    target.dispatchEvent(new Event("track"));
    target.ontrack = null;
    target.dispatchEvent(new Event("track"));
    capture[tag] = { events, error: target.error, track: target.track };
  }
  return { autocorrect: { attributes, inherited, assignments },
    fonts: { widths, constructors, alias }, iterator, capture };
}
