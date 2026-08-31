import { installHeaders } from './install-headers.js';
import { installRequestResponse } from './install-request-response.js';
import {
  configureFetchReplay,
  installFetch as installFetchFunction,
} from '../api/fetch/fetch-replay.js';

export { configureFetchReplay };

export function installFetch() {
  installHeaders();
  installRequestResponse();
  installFetchFunction();
}
