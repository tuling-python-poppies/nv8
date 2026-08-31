import { styleMapMethod } from "./style-property-map-read-only-method.js";export const get=styleMapMethod("get",1,(map,args)=>map.get(`${args[0]}`.trim().toLowerCase())?.[0]);
