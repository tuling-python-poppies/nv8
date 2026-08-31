import { registryMethod } from "./custom-element-registry-method.js";export const get=registryMethod("get",1,(state,args)=>state.definitions.get(`${args[0]}`));
