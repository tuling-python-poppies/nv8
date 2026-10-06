export function installDocumentReadinessEventMembers(accessor) {
  accessor("onreadystatechange", onreadystatechange, setOnreadystatechange);
}

export function installDocumentPointerLockEventMembers(accessor) {
  accessor("onpointerlockchange", onpointerlockchange, setOnpointerlockchange);
  accessor("onpointerlockerror", onpointerlockerror, setOnpointerlockerror);
}

export function installDocumentLifecycleEventMembers(accessor) {
  accessor("onbeforecopy", onbeforecopy, setOnbeforecopy);
  accessor("onbeforecut", onbeforecut, setOnbeforecut);
  accessor("onbeforepaste", onbeforepaste, setOnbeforepaste);
  accessor("onfreeze", onfreeze, setOnfreeze);
  accessor("onprerenderingchange", onprerenderingchange, setOnprerenderingchange);
  accessor("onresume", onresume, setOnresume);
  accessor("onsearch", onsearch, setOnsearch);
  accessor("onvisibilitychange", onvisibilitychange, setOnvisibilitychange);
}

export function installDocumentFullscreenEventMembers(accessor) {
  accessor("onfullscreenchange", onfullscreenchange, setOnfullscreenchange);
  accessor("onfullscreenerror", onfullscreenerror, setOnfullscreenerror);
}

export function installDocumentWebkitFullscreenEventMembers(accessor) {
  accessor("onwebkitfullscreenchange", onwebkitfullscreenchange, setOnwebkitfullscreenchange);
  accessor("onwebkitfullscreenerror", onwebkitfullscreenerror, setOnwebkitfullscreenerror);
}

export function installDocumentMainEventMembers(accessor) {
  accessor("onabort", onabort, setOnabort);
  accessor("onbeforeinput", onbeforeinput, setOnbeforeinput);
  accessor("onbeforematch", onbeforematch, setOnbeforematch);
  accessor("onbeforetoggle", onbeforetoggle, setOnbeforetoggle);
  accessor("onblur", onblur, setOnblur);
  accessor("oncancel", oncancel, setOncancel);
  accessor("oncanplay", oncanplay, setOncanplay);
  accessor("oncanplaythrough", oncanplaythrough, setOncanplaythrough);
  accessor("onchange", onchange, setOnchange);
  accessor("onclick", onclick, setOnclick);
  accessor("onclose", onclose, setOnclose);
  accessor("oncommand", oncommand, setOncommand);
  accessor("oncontentvisibilityautostatechange", oncontentvisibilityautostatechange, setOncontentvisibilityautostatechange);
  accessor("oncontextlost", oncontextlost, setOncontextlost);
  accessor("oncontextmenu", oncontextmenu, setOncontextmenu);
  accessor("oncontextrestored", oncontextrestored, setOncontextrestored);
  accessor("oncuechange", oncuechange, setOncuechange);
  accessor("ondblclick", ondblclick, setOndblclick);
  accessor("ondrag", ondrag, setOndrag);
  accessor("ondragend", ondragend, setOndragend);
  accessor("ondragenter", ondragenter, setOndragenter);
  accessor("ondragleave", ondragleave, setOndragleave);
  accessor("ondragover", ondragover, setOndragover);
  accessor("ondragstart", ondragstart, setOndragstart);
  accessor("ondrop", ondrop, setOndrop);
  accessor("ondurationchange", ondurationchange, setOndurationchange);
  accessor("onemptied", onemptied, setOnemptied);
  accessor("onended", onended, setOnended);
  accessor("onerror", onerror, setOnerror);
  accessor("onfocus", onfocus, setOnfocus);
  accessor("onformdata", onformdata, setOnformdata);
  accessor("oninput", oninput, setOninput);
  accessor("oninvalid", oninvalid, setOninvalid);
  accessor("onkeydown", onkeydown, setOnkeydown);
  accessor("onkeypress", onkeypress, setOnkeypress);
  accessor("onkeyup", onkeyup, setOnkeyup);
  accessor("onload", onload, setOnload);
  accessor("onloadeddata", onloadeddata, setOnloadeddata);
  accessor("onloadedmetadata", onloadedmetadata, setOnloadedmetadata);
  accessor("onloadstart", onloadstart, setOnloadstart);
  accessor("onmousedown", onmousedown, setOnmousedown);
  accessor("onmouseenter", onmouseenter, setOnmouseenter);
  accessor("onmouseleave", onmouseleave, setOnmouseleave);
  accessor("onmousemove", onmousemove, setOnmousemove);
  accessor("onmouseout", onmouseout, setOnmouseout);
  accessor("onmouseover", onmouseover, setOnmouseover);
  accessor("onmouseup", onmouseup, setOnmouseup);
  accessor("onmousewheel", onmousewheel, setOnmousewheel);
  accessor("onpause", onpause, setOnpause);
  accessor("onplay", onplay, setOnplay);
  accessor("onplaying", onplaying, setOnplaying);
  accessor("onprogress", onprogress, setOnprogress);
  accessor("onratechange", onratechange, setOnratechange);
  accessor("onreset", onreset, setOnreset);
  accessor("onresize", onresize, setOnresize);
  accessor("onscroll", onscroll, setOnscroll);
  accessor("onscrollend", onscrollend, setOnscrollend);
  accessor("onsecuritypolicyviolation", onsecuritypolicyviolation, setOnsecuritypolicyviolation);
  accessor("onseeked", onseeked, setOnseeked);
  accessor("onseeking", onseeking, setOnseeking);
  accessor("onselect", onselect, setOnselect);
  accessor("onslotchange", onslotchange, setOnslotchange);
  accessor("onstalled", onstalled, setOnstalled);
  accessor("onsubmit", onsubmit, setOnsubmit);
  accessor("onsuspend", onsuspend, setOnsuspend);
  accessor("ontimeupdate", ontimeupdate, setOntimeupdate);
  accessor("ontoggle", ontoggle, setOntoggle);
  accessor("onvolumechange", onvolumechange, setOnvolumechange);
  accessor("onwaiting", onwaiting, setOnwaiting);
  accessor("onwebkitanimationend", onwebkitanimationend, setOnwebkitanimationend);
  accessor("onwebkitanimationiteration", onwebkitanimationiteration, setOnwebkitanimationiteration);
  accessor("onwebkitanimationstart", onwebkitanimationstart, setOnwebkitanimationstart);
  accessor("onwebkittransitionend", onwebkittransitionend, setOnwebkittransitionend);
  accessor("onwheel", onwheel, setOnwheel);
  accessor("onauxclick", onauxclick, setOnauxclick);
  accessor("ongotpointercapture", ongotpointercapture, setOngotpointercapture);
  accessor("onlostpointercapture", onlostpointercapture, setOnlostpointercapture);
  accessor("onpointerdown", onpointerdown, setOnpointerdown);
  accessor("onpointermove", onpointermove, setOnpointermove);
  accessor("onpointerup", onpointerup, setOnpointerup);
  accessor("onpointercancel", onpointercancel, setOnpointercancel);
  accessor("onpointerover", onpointerover, setOnpointerover);
  accessor("onpointerout", onpointerout, setOnpointerout);
  accessor("onpointerenter", onpointerenter, setOnpointerenter);
  accessor("onpointerleave", onpointerleave, setOnpointerleave);
  accessor("onselectstart", onselectstart, setOnselectstart);
  accessor("onselectionchange", onselectionchange, setOnselectionchange);
  accessor("onanimationcancel", onanimationcancel, setOnanimationcancel);
  accessor("onanimationend", onanimationend, setOnanimationend);
  accessor("onanimationiteration", onanimationiteration, setOnanimationiteration);
  accessor("onanimationstart", onanimationstart, setOnanimationstart);
  accessor("ontransitionrun", ontransitionrun, setOntransitionrun);
  accessor("ontransitionstart", ontransitionstart, setOntransitionstart);
  accessor("ontransitionend", ontransitionend, setOntransitionend);
  accessor("ontransitioncancel", ontransitioncancel, setOntransitioncancel);
  accessor("onbeforexrselect", onbeforexrselect, setOnbeforexrselect);
  accessor("oncopy", oncopy, setOncopy);
  accessor("oncut", oncut, setOncut);
  accessor("onpaste", onpaste, setOnpaste);
}

export function installDocumentPostConstructorEventMembers(accessor) {
  accessor("onpointerrawupdate", onpointerrawupdate, setOnpointerrawupdate);
}

export function installDocumentLateEventMembers(accessor) {
  accessor("onscrollsnapchange", onscrollsnapchange, setOnscrollsnapchange);
  accessor("onscrollsnapchanging", onscrollsnapchanging, setOnscrollsnapchanging);
}

import { documentHandlerDescriptor } from "./document-handler-property.js";

const DOCUMENT_HANDLER_DESCRIPTOR_TABLE_ROWS = [
  ["onabort", "onabort"],
  ["onanimationcancel", "onanimationcancel"],
  ["onanimationend", "onanimationend"],
  ["onanimationiteration", "onanimationiteration"],
  ["onanimationstart", "onanimationstart"],
  ["onauxclick", "onauxclick"],
  ["onbeforecopy", "onbeforecopy"],
  ["onbeforecut", "onbeforecut"],
  ["onbeforeinput", "onbeforeinput"],
  ["onbeforematch", "onbeforematch"],
  ["onbeforepaste", "onbeforepaste"],
  ["onbeforetoggle", "onbeforetoggle"],
  ["onbeforexrselect", "onbeforexrselect"],
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
  ["oncopy", "oncopy"],
  ["oncuechange", "oncuechange"],
  ["oncut", "oncut"],
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
  ["onfreeze", "onfreeze"],
  ["onfullscreenchange", "onfullscreenchange"],
  ["onfullscreenerror", "onfullscreenerror"],
  ["ongotpointercapture", "ongotpointercapture"],
  ["oninput", "oninput"],
  ["oninvalid", "oninvalid"],
  ["onkeydown", "onkeydown"],
  ["onkeypress", "onkeypress"],
  ["onkeyup", "onkeyup"],
  ["onload", "onload"],
  ["onloadeddata", "onloadeddata"],
  ["onloadedmetadata", "onloadedmetadata"],
  ["onloadstart", "onloadstart"],
  ["onlostpointercapture", "onlostpointercapture"],
  ["onmousedown", "onmousedown"],
  ["onmouseenter", "onmouseenter"],
  ["onmouseleave", "onmouseleave"],
  ["onmousemove", "onmousemove"],
  ["onmouseout", "onmouseout"],
  ["onmouseover", "onmouseover"],
  ["onmouseup", "onmouseup"],
  ["onmousewheel", "onmousewheel"],
  ["onpaste", "onpaste"],
  ["onpause", "onpause"],
  ["onplay", "onplay"],
  ["onplaying", "onplaying"],
  ["onpointercancel", "onpointercancel"],
  ["onpointerdown", "onpointerdown"],
  ["onpointerenter", "onpointerenter"],
  ["onpointerleave", "onpointerleave"],
  ["onpointerlockchange", "onpointerlockchange"],
  ["onpointerlockerror", "onpointerlockerror"],
  ["onpointermove", "onpointermove"],
  ["onpointerout", "onpointerout"],
  ["onpointerover", "onpointerover"],
  ["onpointerrawupdate", "onpointerrawupdate"],
  ["onpointerup", "onpointerup"],
  ["onprerenderingchange", "onprerenderingchange"],
  ["onprogress", "onprogress"],
  ["onratechange", "onratechange"],
  ["onreadystatechange", "onreadystatechange"],
  ["onreset", "onreset"],
  ["onresize", "onresize"],
  ["onresume", "onresume"],
  ["onscroll", "onscroll"],
  ["onscrollend", "onscrollend"],
  ["onscrollsnapchange", "onscrollsnapchange"],
  ["onscrollsnapchanging", "onscrollsnapchanging"],
  ["onsearch", "onsearch"],
  ["onsecuritypolicyviolation", "onsecuritypolicyviolation"],
  ["onseeked", "onseeked"],
  ["onseeking", "onseeking"],
  ["onselect", "onselect"],
  ["onselectionchange", "onselectionchange"],
  ["onselectstart", "onselectstart"],
  ["onslotchange", "onslotchange"],
  ["onstalled", "onstalled"],
  ["onsubmit", "onsubmit"],
  ["onsuspend", "onsuspend"],
  ["ontimeupdate", "ontimeupdate"],
  ["ontoggle", "ontoggle"],
  ["ontransitioncancel", "ontransitioncancel"],
  ["ontransitionend", "ontransitionend"],
  ["ontransitionrun", "ontransitionrun"],
  ["ontransitionstart", "ontransitionstart"],
  ["onvisibilitychange", "onvisibilitychange"],
  ["onvolumechange", "onvolumechange"],
  ["onwaiting", "onwaiting"],
  ["onwebkitanimationend", "onwebkitanimationend"],
  ["onwebkitanimationiteration", "onwebkitanimationiteration"],
  ["onwebkitanimationstart", "onwebkitanimationstart"],
  ["onwebkitfullscreenchange", "onwebkitfullscreenchange"],
  ["onwebkitfullscreenerror", "onwebkitfullscreenerror"],
  ["onwebkittransitionend", "onwebkittransitionend"],
  ["onwheel", "onwheel"],
];

export const documentHandlerDescriptorTable = DOCUMENT_HANDLER_DESCRIPTOR_TABLE_ROWS.map(
  ([name, ...args]) => [name, documentHandlerDescriptor(...args)],
);

