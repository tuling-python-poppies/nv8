import { registerNativeGetter } from "../../../engine/webidl/native-function.js";import { requireStylePropertyMapReadOnly } from "./style-property-map-read-only-state.js";
export const size=Object.getOwnPropertyDescriptor({get size(){return requireStylePropertyMapReadOnly(this).size;}},"size").get;registerNativeGetter(size,"size");
