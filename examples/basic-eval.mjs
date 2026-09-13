import { nv8Eval } from '../src/index.js';

const value = await nv8Eval(
  '({ sum: 2 + 3, hasProcess: typeof process !== "undefined" })',
  { profile: 'minimal' },
);

console.log(JSON.stringify(value, null, 2));
