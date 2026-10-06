export function installHTMLElementEarlyEventMembers(install) {
  for (const [name, entry] of htmlElementHandlerDescriptorPart1Table) install(name, entry.get, entry.set);
}

export function installHTMLElementLateEventMembers(install) {
  for (const [name, entry] of htmlElementHandlerDescriptorPart2Table) install(name, entry.get, entry.set);
}

export function installHTMLElementAfterConstructorEventMembers(install) {
  for (const [name, entry] of htmlElementHandlerDescriptorPart3Table) install(name, entry.get, entry.set);
}

import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";

const HTML_ELEMENT_HANDLER_DESCRIPTOR_PART1_TABLE_ROWS = [
  ["onabort", "onabort"],
  ["onbeforeinput", "onbeforeinput"],
  ["onbeforematch", "onbeforematch"],
  ["onbeforetoggle", "onbeforetoggle"],
  ["onblur", "onblur"],
  ["oncancel", "oncancel"],
  ["oncanplay", "oncanplay"],
  ["oncanplaythrough", "oncanplaythrough"],
  ["onchange", "onchange"],
  ["onclick", "onclick"],
  ["onclose", "onclose"],
  ["oncommand", "oncommand"],
  ["oncontentvisibilityautostatechange", "oncontentvisibilityautostatechange"],
  ["oncontextlost", "oncontextlost"],
  ["oncontextmenu", "oncontextmenu"],
  ["oncontextrestored", "oncontextrestored"],
  ["oncuechange", "oncuechange"],
  ["ondblclick", "ondblclick"],
  ["ondrag", "ondrag"],
  ["ondragend", "ondragend"],
  ["ondragenter", "ondragenter"],
  ["ondragleave", "ondragleave"],
  ["ondragover", "ondragover"],
  ["ondragstart", "ondragstart"],
  ["ondrop", "ondrop"],
  ["ondurationchange", "ondurationchange"],
  ["onemptied", "onemptied"],
  ["onended", "onended"],
  ["onerror", "onerror"],
  ["onfocus", "onfocus"],
  ["onformdata", "onformdata"],
  ["oninput", "oninput"],
  ["oninvalid", "oninvalid"],
  ["onkeydown", "onkeydown"],
  ["onkeypress", "onkeypress"],
  ["onkeyup", "onkeyup"],
  ["onload", "onload"],
  ["onloadeddata", "onloadeddata"],
  ["onloadedmetadata", "onloadedmetadata"],
  ["onloadstart", "onloadstart"],
  ["onmousedown", "onmousedown"],
  ["onmouseenter", "onmouseenter"],
  ["onmouseleave", "onmouseleave"],
  ["onmousemove", "onmousemove"],
  ["onmouseout", "onmouseout"],
  ["onmouseover", "onmouseover"],
  ["onmouseup", "onmouseup"],
  ["onmousewheel", "onmousewheel"],
  ["onpause", "onpause"],
  ["onplay", "onplay"],
  ["onplaying", "onplaying"],
  ["onprogress", "onprogress"],
  ["onratechange", "onratechange"],
  ["onreset", "onreset"],
  ["onresize", "onresize"],
  ["onscroll", "onscroll"],
  ["onscrollend", "onscrollend"],
  ["onsecuritypolicyviolation", "onsecuritypolicyviolation"],
  ["onseeked", "onseeked"],
  ["onseeking", "onseeking"],
  ["onselect", "onselect"],
  ["onslotchange", "onslotchange"],
  ["onstalled", "onstalled"],
  ["onsubmit", "onsubmit"],
  ["onsuspend", "onsuspend"],
  ["ontimeupdate", "ontimeupdate"],
  ["ontoggle", "ontoggle"],
  ["onvolumechange", "onvolumechange"],
  ["onwaiting", "onwaiting"],
  ["onwebkitanimationend", "onwebkitanimationend"],
  ["onwebkitanimationiteration", "onwebkitanimationiteration"],
  ["onwebkitanimationstart", "onwebkitanimationstart"],
  ["onwebkittransitionend", "onwebkittransitionend"],
  ["onwheel", "onwheel"],
  ["onauxclick", "onauxclick"],
  ["ongotpointercapture", "ongotpointercapture"],
  ["onlostpointercapture", "onlostpointercapture"],
  ["onpointerdown", "onpointerdown"],
  ["onpointermove", "onpointermove"],
  ["onpointerup", "onpointerup"],
  ["onpointercancel", "onpointercancel"],
  ["onpointerover", "onpointerover"],
  ["onpointerout", "onpointerout"],
  ["onpointerenter", "onpointerenter"],
  ["onpointerleave", "onpointerleave"],
  ["onselectstart", "onselectstart"],
  ["onselectionchange", "onselectionchange"],
  ["onanimationcancel", "onanimationcancel"],
  ["onanimationend", "onanimationend"],
  ["onanimationiteration", "onanimationiteration"],
  ["onanimationstart", "onanimationstart"],
  ["ontransitionrun", "ontransitionrun"],
  ["ontransitionstart", "ontransitionstart"],
  ["ontransitionend", "ontransitionend"],
  ["ontransitioncancel", "ontransitioncancel"],
  ["onbeforexrselect", "onbeforexrselect"],
  ["oncopy", "oncopy"],
  ["oncut", "oncut"],
  ["onpaste", "onpaste"],
];

export const htmlElementHandlerDescriptorPart1Table = HTML_ELEMENT_HANDLER_DESCRIPTOR_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlElementHandlerDescriptor(...args)],
);

const HTML_ELEMENT_HANDLER_DESCRIPTOR_PART2_TABLE_ROWS = [
  ["onscrollsnapchange", "onscrollsnapchange"],
  ["onscrollsnapchanging", "onscrollsnapchanging"],
];

export const htmlElementHandlerDescriptorPart2Table = HTML_ELEMENT_HANDLER_DESCRIPTOR_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlElementHandlerDescriptor(...args)],
);

const HTML_ELEMENT_HANDLER_DESCRIPTOR_PART3_TABLE_ROWS = [
  ["onpointerrawupdate", "onpointerrawupdate"],
];

export const htmlElementHandlerDescriptorPart3Table = HTML_ELEMENT_HANDLER_DESCRIPTOR_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlElementHandlerDescriptor(...args)],
);
