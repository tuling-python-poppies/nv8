import { mutableRectProperty } from "./dom-rect-property.js";
const xDescriptor=mutableRectProperty("x"); export const mutableX=xDescriptor.get; export const setX=xDescriptor.set;
const yDescriptor=mutableRectProperty("y"); export const mutableY=yDescriptor.get; export const setY=yDescriptor.set;
const widthDescriptor=mutableRectProperty("width"); export const mutableWidth=widthDescriptor.get; export const setWidth=widthDescriptor.set;
const heightDescriptor=mutableRectProperty("height"); export const mutableHeight=heightDescriptor.get; export const setHeight=heightDescriptor.set;
