import { styleMapMethod } from "./style-property-map-read-only-method.js";export const entries=styleMapMethod("entries",0,map=>([...map].map(([key,values])=>[key,[...values]])).values());
