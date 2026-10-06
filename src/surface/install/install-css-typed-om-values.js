import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  CSSKeywordValue,
  CSSMathClamp,
  CSSMathInvert,
  CSSMathMax,
  CSSMathMin,
  CSSMathNegate,
  CSSMathProduct,
  CSSMathSum,
  CSSMathValue,
  CSSNumericArray,
  CSSNumericValue,
  CSSUnitValue,
  CSSUnparsedValue,
  CSSVariableReferenceValue,
  installCSSTypedOMConstructors,
} from "../api/css/css-typed-om-constructors.js";
import {
  fallback,
  keywordValue,
  mathLower,
  mathOperator,
  mathUpper,
  mathValue,
  mathValues,
  numericAdd,
  numericArrayEntries,
  numericArrayForEach,
  numericArrayKeys,
  numericArrayLength,
  numericArrayValues,
  numericDiv,
  numericEquals,
  numericMax,
  numericMin,
  numericMul,
  numericSub,
  numericTo,
  numericToSum,
  numericType,
  unit,
  unitValue,
  unparsedEntries,
  unparsedForEach,
  unparsedKeys,
  unparsedLength,
  unparsedValues,
  variable,
} from "../api/css/css-typed-om-members.js";

export function installCSSTypedOMValues() {
  installCSSTypedOMConstructors();
  installNumericValue();
  {

    definePrototypeGetter(CSSUnitValue.prototype, "value", ((((["value", unitValue]))[1])));

    definePrototypeGetter(CSSUnitValue.prototype, "unit", ((((["unit", unit]))[1])));

  defineConstructorBacklink(CSSUnitValue.prototype, CSSUnitValue);
  defineToStringTag(CSSUnitValue.prototype, "CSSUnitValue");
}
  {

    definePrototypeGetter(CSSKeywordValue.prototype, "value", ((((([["value", keywordValue]])[0]))[1])));

  defineConstructorBacklink(CSSKeywordValue.prototype, CSSKeywordValue);
  defineToStringTag(CSSKeywordValue.prototype, "CSSKeywordValue");
}
  {

    definePrototypeGetter(CSSVariableReferenceValue.prototype, "variable", ((((["variable", variable]))[1])));

    definePrototypeGetter(CSSVariableReferenceValue.prototype, "fallback", ((((["fallback", fallback]))[1])));

  defineConstructorBacklink(CSSVariableReferenceValue.prototype, CSSVariableReferenceValue);
  defineToStringTag(CSSVariableReferenceValue.prototype, "CSSVariableReferenceValue");
}
  installCollection(
    CSSUnparsedValue,
    "CSSUnparsedValue",
    unparsedLength,
    unparsedEntries,
    unparsedKeys,
    unparsedValues,
    unparsedForEach,
  );
  installCollection(
    CSSNumericArray,
    "CSSNumericArray",
    numericArrayLength,
    numericArrayEntries,
    numericArrayKeys,
    numericArrayValues,
    numericArrayForEach,
  );
  {

    definePrototypeGetter(CSSMathValue.prototype, "operator", ((((([["operator", mathOperator]])[0]))[1])));

  defineConstructorBacklink(CSSMathValue.prototype, CSSMathValue);
  defineToStringTag(CSSMathValue.prototype, "CSSMathValue");
}
  {

    definePrototypeGetter(CSSMathSum.prototype, "values", ((((([["values", mathValues]])[0]))[1])));

  defineConstructorBacklink(CSSMathSum.prototype, CSSMathSum);
  defineToStringTag(CSSMathSum.prototype, "CSSMathSum");
}
  {

    definePrototypeGetter(CSSMathProduct.prototype, "values", ((((([["values", mathValues]])[0]))[1])));

  defineConstructorBacklink(CSSMathProduct.prototype, CSSMathProduct);
  defineToStringTag(CSSMathProduct.prototype, "CSSMathProduct");
}
  {

    definePrototypeGetter(CSSMathNegate.prototype, "value", ((((([["value", mathValue]])[0]))[1])));

  defineConstructorBacklink(CSSMathNegate.prototype, CSSMathNegate);
  defineToStringTag(CSSMathNegate.prototype, "CSSMathNegate");
}
  {

    definePrototypeGetter(CSSMathMin.prototype, "values", ((((([["values", mathValues]])[0]))[1])));

  defineConstructorBacklink(CSSMathMin.prototype, CSSMathMin);
  defineToStringTag(CSSMathMin.prototype, "CSSMathMin");
}
  {

    definePrototypeGetter(CSSMathMax.prototype, "values", ((((([["values", mathValues]])[0]))[1])));

  defineConstructorBacklink(CSSMathMax.prototype, CSSMathMax);
  defineToStringTag(CSSMathMax.prototype, "CSSMathMax");
}
  {

    definePrototypeGetter(CSSMathInvert.prototype, "value", ((((([["value", mathValue]])[0]))[1])));

  defineConstructorBacklink(CSSMathInvert.prototype, CSSMathInvert);
  defineToStringTag(CSSMathInvert.prototype, "CSSMathInvert");
}
  {

    definePrototypeGetter(CSSMathClamp.prototype, "lower", ((((["lower", mathLower]))[1])));

    definePrototypeGetter(CSSMathClamp.prototype, "value", ((((["value", mathValue]))[1])));

    definePrototypeGetter(CSSMathClamp.prototype, "upper", ((((["upper", mathUpper]))[1])));

  defineConstructorBacklink(CSSMathClamp.prototype, CSSMathClamp);
  defineToStringTag(CSSMathClamp.prototype, "CSSMathClamp");
}
}

function installNumericValue() {

    definePrototypeMethod(CSSNumericValue.prototype, "add", ((((["add", numericAdd]))[1])));

    definePrototypeMethod(CSSNumericValue.prototype, "div", ((((["div", numericDiv]))[1])));

    definePrototypeMethod(CSSNumericValue.prototype, "equals", ((((["equals", numericEquals]))[1])));

    definePrototypeMethod(CSSNumericValue.prototype, "max", ((((["max", numericMax]))[1])));

    definePrototypeMethod(CSSNumericValue.prototype, "min", ((((["min", numericMin]))[1])));

    definePrototypeMethod(CSSNumericValue.prototype, "mul", ((((["mul", numericMul]))[1])));

    definePrototypeMethod(CSSNumericValue.prototype, "sub", ((((["sub", numericSub]))[1])));

    definePrototypeMethod(CSSNumericValue.prototype, "to", ((((["to", numericTo]))[1])));

    definePrototypeMethod(CSSNumericValue.prototype, "toSum", ((((["toSum", numericToSum]))[1])));

    definePrototypeMethod(CSSNumericValue.prototype, "type", ((((["type", numericType]))[1])));

  defineConstructorBacklink(CSSNumericValue.prototype, CSSNumericValue);
  defineToStringTag(CSSNumericValue.prototype, "CSSNumericValue");
}

function installCollection(
  constructor,
  tag,
  length,
  entries,
  keys,
  values,
  forEach,
) {
  definePrototypeMethod(constructor.prototype, "entries", entries);
  definePrototypeMethod(constructor.prototype, "keys", keys);
  definePrototypeMethod(constructor.prototype, "values", values);
  definePrototypeMethod(constructor.prototype, "forEach", forEach);
  definePrototypeGetter(constructor.prototype, "length", length);
  defineConstructorBacklink(constructor.prototype, constructor);
  defineToStringTag(constructor.prototype, tag);
  Object.defineProperty(constructor.prototype, Symbol.iterator, {
    value: values,
    writable: true,
    configurable: true,
  });
}
