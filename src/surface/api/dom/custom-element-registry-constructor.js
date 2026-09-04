import { traceConstruct } from "../../../infra/trace/trace-function.js";
import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { initializeCustomElementRegistry } from "./custom-element-registry-state.js";
export function CustomElementRegistry(){if(new.target===undefined)throw new TypeError("Please use the 'new' operator, this DOM object constructor cannot be called as a function.");initializeCustomElementRegistry(this);traceConstruct("window.CustomElementRegistry",[],"CustomElementRegistry");}
registerNativeFunction(CustomElementRegistry,"CustomElementRegistry");
export function installCustomElementRegistryConstructor(){delete CustomElementRegistry.prototype.constructor;defineGlobalConstructor("CustomElementRegistry",CustomElementRegistry);}
