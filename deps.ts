// 3rd-party dependencies from Denoland
//
// Run the following script after making change in this file:
//   deno bundle deps.ts vendor/deno-deps.js
//
// You must use a 1.x version of Deno, e.g. v1.43.1
//
// Deno Bundle does not support npm dependencies, we have to load them via CDN
export { getFullnodeUrl, SuiClient } from 'https://esm.sh/@mysten/sui@1.24.0/client';
