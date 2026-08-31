import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
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
  do {
    definePrototypeGetter((CSSUnitValue).prototype, ("value"), ((((([["value", unitValue], ["unit", unit]])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSUnitValue).prototype, ("unit"), ((((([["value", unitValue], ["unit", unit]])[1]))[1])));
  } while (false);
  defineConstructorBacklink((CSSUnitValue).prototype, (CSSUnitValue));
  defineToStringTag((CSSUnitValue).prototype, ("CSSUnitValue"));
}
  {
  do {
    definePrototypeGetter((CSSKeywordValue).prototype, ("value"), ((((([["value", keywordValue]])[0]))[1])));
  } while (false);
  defineConstructorBacklink((CSSKeywordValue).prototype, (CSSKeywordValue));
  defineToStringTag((CSSKeywordValue).prototype, ("CSSKeywordValue"));
}
  {
  do {
    definePrototypeGetter((CSSVariableReferenceValue).prototype, ("variable"), ((((([["variable", variable], ["fallback", fallback]])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSVariableReferenceValue).prototype, ("fallback"), ((((([["variable", variable], ["fallback", fallback]])[1]))[1])));
  } while (false);
  defineConstructorBacklink((CSSVariableReferenceValue).prototype, (CSSVariableReferenceValue));
  defineToStringTag((CSSVariableReferenceValue).prototype, ("CSSVariableReferenceValue"));
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
  do {
    definePrototypeGetter((CSSMathValue).prototype, ("operator"), ((((([["operator", mathOperator]])[0]))[1])));
  } while (false);
  defineConstructorBacklink((CSSMathValue).prototype, (CSSMathValue));
  defineToStringTag((CSSMathValue).prototype, ("CSSMathValue"));
}
  {
  do {
    definePrototypeGetter((CSSMathSum).prototype, ("values"), ((((([["values", mathValues]])[0]))[1])));
  } while (false);
  defineConstructorBacklink((CSSMathSum).prototype, (CSSMathSum));
  defineToStringTag((CSSMathSum).prototype, ("CSSMathSum"));
}
  {
  do {
    definePrototypeGetter((CSSMathProduct).prototype, ("values"), ((((([["values", mathValues]])[0]))[1])));
  } while (false);
  defineConstructorBacklink((CSSMathProduct).prototype, (CSSMathProduct));
  defineToStringTag((CSSMathProduct).prototype, ("CSSMathProduct"));
}
  {
  do {
    definePrototypeGetter((CSSMathNegate).prototype, ("value"), ((((([["value", mathValue]])[0]))[1])));
  } while (false);
  defineConstructorBacklink((CSSMathNegate).prototype, (CSSMathNegate));
  defineToStringTag((CSSMathNegate).prototype, ("CSSMathNegate"));
}
  {
  do {
    definePrototypeGetter((CSSMathMin).prototype, ("values"), ((((([["values", mathValues]])[0]))[1])));
  } while (false);
  defineConstructorBacklink((CSSMathMin).prototype, (CSSMathMin));
  defineToStringTag((CSSMathMin).prototype, ("CSSMathMin"));
}
  {
  do {
    definePrototypeGetter((CSSMathMax).prototype, ("values"), ((((([["values", mathValues]])[0]))[1])));
  } while (false);
  defineConstructorBacklink((CSSMathMax).prototype, (CSSMathMax));
  defineToStringTag((CSSMathMax).prototype, ("CSSMathMax"));
}
  {
  do {
    definePrototypeGetter((CSSMathInvert).prototype, ("value"), ((((([["value", mathValue]])[0]))[1])));
  } while (false);
  defineConstructorBacklink((CSSMathInvert).prototype, (CSSMathInvert));
  defineToStringTag((CSSMathInvert).prototype, ("CSSMathInvert"));
}
  {
  do {
    definePrototypeGetter((CSSMathClamp).prototype, ("lower"), ((((([["lower", mathLower], ["value", mathValue], ["upper", mathUpper]])[0]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSMathClamp).prototype, ("value"), ((((([["lower", mathLower], ["value", mathValue], ["upper", mathUpper]])[1]))[1])));
  } while (false);
do {
    definePrototypeGetter((CSSMathClamp).prototype, ("upper"), ((((([["lower", mathLower], ["value", mathValue], ["upper", mathUpper]])[2]))[1])));
  } while (false);
  defineConstructorBacklink((CSSMathClamp).prototype, (CSSMathClamp));
  defineToStringTag((CSSMathClamp).prototype, ("CSSMathClamp"));
}
}

function installNumericValue() {
  do {
    definePrototypeMethod(CSSNumericValue.prototype, ("add"), ((((([
    ["add", numericAdd],
    ["div", numericDiv],
    ["equals", numericEquals],
    ["max", numericMax],
    ["min", numericMin],
    ["mul", numericMul],
    ["sub", numericSub],
    ["to", numericTo],
    ["toSum", numericToSum],
    ["type", numericType],
  ])[0]))[1])));
  } while (false);
do {
    definePrototypeMethod(CSSNumericValue.prototype, ("div"), ((((([
    ["add", numericAdd],
    ["div", numericDiv],
    ["equals", numericEquals],
    ["max", numericMax],
    ["min", numericMin],
    ["mul", numericMul],
    ["sub", numericSub],
    ["to", numericTo],
    ["toSum", numericToSum],
    ["type", numericType],
  ])[1]))[1])));
  } while (false);
do {
    definePrototypeMethod(CSSNumericValue.prototype, ("equals"), ((((([
    ["add", numericAdd],
    ["div", numericDiv],
    ["equals", numericEquals],
    ["max", numericMax],
    ["min", numericMin],
    ["mul", numericMul],
    ["sub", numericSub],
    ["to", numericTo],
    ["toSum", numericToSum],
    ["type", numericType],
  ])[2]))[1])));
  } while (false);
do {
    definePrototypeMethod(CSSNumericValue.prototype, ("max"), ((((([
    ["add", numericAdd],
    ["div", numericDiv],
    ["equals", numericEquals],
    ["max", numericMax],
    ["min", numericMin],
    ["mul", numericMul],
    ["sub", numericSub],
    ["to", numericTo],
    ["toSum", numericToSum],
    ["type", numericType],
  ])[3]))[1])));
  } while (false);
do {
    definePrototypeMethod(CSSNumericValue.prototype, ("min"), ((((([
    ["add", numericAdd],
    ["div", numericDiv],
    ["equals", numericEquals],
    ["max", numericMax],
    ["min", numericMin],
    ["mul", numericMul],
    ["sub", numericSub],
    ["to", numericTo],
    ["toSum", numericToSum],
    ["type", numericType],
  ])[4]))[1])));
  } while (false);
do {
    definePrototypeMethod(CSSNumericValue.prototype, ("mul"), ((((([
    ["add", numericAdd],
    ["div", numericDiv],
    ["equals", numericEquals],
    ["max", numericMax],
    ["min", numericMin],
    ["mul", numericMul],
    ["sub", numericSub],
    ["to", numericTo],
    ["toSum", numericToSum],
    ["type", numericType],
  ])[5]))[1])));
  } while (false);
do {
    definePrototypeMethod(CSSNumericValue.prototype, ("sub"), ((((([
    ["add", numericAdd],
    ["div", numericDiv],
    ["equals", numericEquals],
    ["max", numericMax],
    ["min", numericMin],
    ["mul", numericMul],
    ["sub", numericSub],
    ["to", numericTo],
    ["toSum", numericToSum],
    ["type", numericType],
  ])[6]))[1])));
  } while (false);
do {
    definePrototypeMethod(CSSNumericValue.prototype, ("to"), ((((([
    ["add", numericAdd],
    ["div", numericDiv],
    ["equals", numericEquals],
    ["max", numericMax],
    ["min", numericMin],
    ["mul", numericMul],
    ["sub", numericSub],
    ["to", numericTo],
    ["toSum", numericToSum],
    ["type", numericType],
  ])[7]))[1])));
  } while (false);
do {
    definePrototypeMethod(CSSNumericValue.prototype, ("toSum"), ((((([
    ["add", numericAdd],
    ["div", numericDiv],
    ["equals", numericEquals],
    ["max", numericMax],
    ["min", numericMin],
    ["mul", numericMul],
    ["sub", numericSub],
    ["to", numericTo],
    ["toSum", numericToSum],
    ["type", numericType],
  ])[8]))[1])));
  } while (false);
do {
    definePrototypeMethod(CSSNumericValue.prototype, ("type"), ((((([
    ["add", numericAdd],
    ["div", numericDiv],
    ["equals", numericEquals],
    ["max", numericMax],
    ["min", numericMin],
    ["mul", numericMul],
    ["sub", numericSub],
    ["to", numericTo],
    ["toSum", numericToSum],
    ["type", numericType],
  ])[9]))[1])));
  } while (false);
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
