import { typeSetMethod } from "./view-transition-type-set-method.js";export const add=typeSetMethod("add",1,(set,args,self)=>{set.add(`${args[0]}`);return self;});
