import { styleMapMethod } from "./style-property-map-read-only-method.js";export const has=styleMapMethod("has",1,(map,args)=>map.has(`${args[0]}`.trim().toLowerCase()));
