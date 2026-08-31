import { styleMapMethod } from "./style-property-map-read-only-method.js";export const getAll=styleMapMethod("getAll",1,(map,args)=>[...(map.get(`${args[0]}`.trim().toLowerCase())??[])]);
