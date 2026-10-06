export function installDocumentReadinessEventMembers(accessor) {
  for (const [name, entry] of documentHandlerDescriptorPart1Table) accessor(name, entry.get, entry.set);
}

export function installDocumentPointerLockEventMembers(accessor) {
  for (const [name, entry] of documentHandlerDescriptorPart2Table) accessor(name, entry.get, entry.set);
}

export function installDocumentLifecycleEventMembers(accessor) {
  for (const [name, entry] of documentHandlerDescriptorPart3Table) accessor(name, entry.get, entry.set);
}

export function installDocumentFullscreenEventMembers(accessor) {
  for (const [name, entry] of documentHandlerDescriptorPart4Table) accessor(name, entry.get, entry.set);
}

export function installDocumentWebkitFullscreenEventMembers(accessor) {
  for (const [name, entry] of documentHandlerDescriptorPart5Table) accessor(name, entry.get, entry.set);
}

export function installDocumentMainEventMembers(accessor) {
  for (const [name, entry] of documentHandlerDescriptorPart6Table) accessor(name, entry.get, entry.set);
}

export function installDocumentPostConstructorEventMembers(accessor) {
  for (const [name, entry] of documentHandlerDescriptorPart7Table) accessor(name, entry.get, entry.set);
}

export function installDocumentLateEventMembers(accessor) {
  for (const [name, entry] of documentHandlerDescriptorPart8Table) accessor(name, entry.get, entry.set);
}

import { documentHandlerDescriptor } from "./document-handler-property.js";

const DOCUMENT_HANDLER_DESCRIPTOR_PART1_TABLE_ROWS = [
  ["onreadystatechange", "onreadystatechange"],
];

export const documentHandlerDescriptorPart1Table = DOCUMENT_HANDLER_DESCRIPTOR_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentHandlerDescriptor(...args)],
);

const DOCUMENT_HANDLER_DESCRIPTOR_PART2_TABLE_ROWS = [
  ["onpointerlockchange", "onpointerlockchange"],
  ["onpointerlockerror", "onpointerlockerror"],
];

export const documentHandlerDescriptorPart2Table = DOCUMENT_HANDLER_DESCRIPTOR_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentHandlerDescriptor(...args)],
);

const DOCUMENT_HANDLER_DESCRIPTOR_PART3_TABLE_ROWS = [
  ["onbeforecopy", "onbeforecopy"],
  ["onbeforecut", "onbeforecut"],
  ["onbeforepaste", "onbeforepaste"],
  ["onfreeze", "onfreeze"],
  ["onprerenderingchange", "onprerenderingchange"],
  ["onresume", "onresume"],
  ["onsearch", "onsearch"],
  ["onvisibilitychange", "onvisibilitychange"],
];

export const documentHandlerDescriptorPart3Table = DOCUMENT_HANDLER_DESCRIPTOR_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentHandlerDescriptor(...args)],
);

const DOCUMENT_HANDLER_DESCRIPTOR_PART4_TABLE_ROWS = [
  ["onfullscreenchange", "onfullscreenchange"],
  ["onfullscreenerror", "onfullscreenerror"],
];

export const documentHandlerDescriptorPart4Table = DOCUMENT_HANDLER_DESCRIPTOR_PART4_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentHandlerDescriptor(...args)],
);

const DOCUMENT_HANDLER_DESCRIPTOR_PART5_TABLE_ROWS = [
  ["onwebkitfullscreenchange", "onwebkitfullscreenchange"],
  ["onwebkitfullscreenerror", "onwebkitfullscreenerror"],
];

export const documentHandlerDescriptorPart5Table = DOCUMENT_HANDLER_DESCRIPTOR_PART5_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentHandlerDescriptor(...args)],
);

const DOCUMENT_HANDLER_DESCRIPTOR_PART6_TABLE_ROWS = [
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

export const documentHandlerDescriptorPart6Table = DOCUMENT_HANDLER_DESCRIPTOR_PART6_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentHandlerDescriptor(...args)],
);

const DOCUMENT_HANDLER_DESCRIPTOR_PART7_TABLE_ROWS = [
  ["onpointerrawupdate", "onpointerrawupdate"],
];

export const documentHandlerDescriptorPart7Table = DOCUMENT_HANDLER_DESCRIPTOR_PART7_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentHandlerDescriptor(...args)],
);

const DOCUMENT_HANDLER_DESCRIPTOR_PART8_TABLE_ROWS = [
  ["onscrollsnapchange", "onscrollsnapchange"],
  ["onscrollsnapchanging", "onscrollsnapchanging"],
];

export const documentHandlerDescriptorPart8Table = DOCUMENT_HANDLER_DESCRIPTOR_PART8_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentHandlerDescriptor(...args)],
);
