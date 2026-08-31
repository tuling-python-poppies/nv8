import { installURLCanParse } from "../api/url/url-can-parse.js";
import {
  installURLConstructor,
  installURLConstructorBacklink,
} from "../api/url/url-constructor.js";
import { installURLCreateObjectURL } from "../api/url/url-create-object-url.js";
import { installURLParse } from "../api/url/url-parse.js";
import { installURLProperties } from "../api/url/url-properties.js";
import { installURLRevokeObjectURL } from "../api/url/url-revoke-object-url.js";
import { installURLToJSON } from "../api/url/url-to-json.js";
import { installURLToString } from "../api/url/url-to-string.js";

export function installURL() {
  installURLConstructor();
  installURLProperties();
  installURLToJSON();
  installURLToString();
  installURLConstructorBacklink();
  installURLCanParse();
  installURLParse();
  installURLCreateObjectURL();
  installURLRevokeObjectURL();
}
