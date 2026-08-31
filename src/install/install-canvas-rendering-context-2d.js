import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import * as api from "../api/canvas/canvas-2d-context-members.js";
import {
  CanvasRenderingContext2D,
  installCanvasRenderingContext2DConstructor,
} from "../api/canvas/canvas-rendering-context-2d-constructor.js";

export function installCanvasRenderingContext2D() {
  installCanvasRenderingContext2DConstructor();
  getter("canvas", api.canvas);
  accessor("lang", api.lang, api.setLang);
  accessor("font", api.font, api.setFont);
  accessor("textAlign", api.textAlign, api.setTextAlign);
  accessor("textBaseline", api.textBaseline, api.setTextBaseline);
  accessor("direction", api.direction, api.setDirection);
  accessor("fontKerning", api.fontKerning, api.setFontKerning);
  accessor("fontStretch", api.fontStretch, api.setFontStretch);
  accessor("fontVariantCaps", api.fontVariantCaps, api.setFontVariantCaps);
  accessor("letterSpacing", api.letterSpacing, api.setLetterSpacing);
  accessor("textRendering", api.textRendering, api.setTextRendering);
  accessor("wordSpacing", api.wordSpacing, api.setWordSpacing);
  accessor("globalCompositeOperation", api.globalCompositeOperation, api.setGlobalCompositeOperation);
  accessor("filter", api.filter, api.setFilter);
  accessor("imageSmoothingQuality", api.imageSmoothingQuality, api.setImageSmoothingQuality);
  accessor("strokeStyle", api.strokeStyle, api.setStrokeStyle);
  accessor("fillStyle", api.fillStyle, api.setFillStyle);
  accessor("shadowColor", api.shadowColor, api.setShadowColor);
  accessor("lineCap", api.lineCap, api.setLineCap);
  accessor("lineJoin", api.lineJoin, api.setLineJoin);
  accessor("globalAlpha", api.globalAlpha, api.setGlobalAlpha);
  accessor("imageSmoothingEnabled", api.imageSmoothingEnabled, api.setImageSmoothingEnabled);
  accessor("shadowOffsetX", api.shadowOffsetX, api.setShadowOffsetX);
  accessor("shadowOffsetY", api.shadowOffsetY, api.setShadowOffsetY);
  accessor("shadowBlur", api.shadowBlur, api.setShadowBlur);
  accessor("lineWidth", api.lineWidth, api.setLineWidth);
  accessor("miterLimit", api.miterLimit, api.setMiterLimit);
  accessor("lineDashOffset", api.lineDashOffset, api.setLineDashOffset);
  method("clip", api.clip);
  method("createConicGradient", api.createConicGradient);
  method("createImageData", api.createImageData);
  method("createLinearGradient", api.createLinearGradient);
  method("createPattern", api.createPattern);
  method("createRadialGradient", api.createRadialGradient);
  method("drawFocusIfNeeded", api.drawFocusIfNeeded);
  method("drawImage", api.drawImage);
  method("fill", api.fill);
  method("fillText", api.fillText);
  method("getContextAttributes", api.getContextAttributes);
  method("getImageData", api.getImageData);
  method("getLineDash", api.getLineDash);
  method("getTransform", api.getTransform);
  method("isContextLost", api.isContextLost);
  method("isPointInPath", api.isPointInPath);
  method("isPointInStroke", api.isPointInStroke);
  method("measureText", api.measureText);
  method("reset", api.reset);
  method("roundRect", api.roundRect);
  method("setLineDash", api.setLineDash);
  method("strokeText", api.strokeText);
  method("arc", api.arc);
  method("arcTo", api.arcTo);
  method("beginPath", api.beginPath);
  method("bezierCurveTo", api.bezierCurveTo);
  method("clearRect", api.clearRect);
  method("closePath", api.closePath);
  method("ellipse", api.ellipse);
  method("fillRect", api.fillRect);
  method("lineTo", api.lineTo);
  method("moveTo", api.moveTo);
  method("putImageData", api.putImageData);
  method("quadraticCurveTo", api.quadraticCurveTo);
  method("rect", api.rect);
  method("resetTransform", api.resetTransform);
  method("restore", api.restore);
  method("rotate", api.rotate);
  method("save", api.save);
  method("scale", api.scale);
  method("setTransform", api.setTransform);
  method("stroke", api.stroke);
  method("strokeRect", api.strokeRect);
  method("transform", api.transform);
  method("translate", api.translate);
  defineConstructorBacklink(
    CanvasRenderingContext2D.prototype,
    CanvasRenderingContext2D,
  );
  defineToStringTag(
    CanvasRenderingContext2D.prototype,
    "CanvasRenderingContext2D",
  );
}

const prototype = CanvasRenderingContext2D.prototype;
function getter(name, callback) {
  definePrototypeGetter(prototype, name, callback);
}
function accessor(name, get, set) {
  definePrototypeAccessor(prototype, name, get, set);
}
function method(name, callback) {
  definePrototypeMethod(prototype, name, callback);
}
