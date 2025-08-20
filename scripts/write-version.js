/**
 * Small helper script executed on build to create
 * a version.json file containing the build date.
 *
 * @author jplacht
 */

import { writeFileSync } from "fs";

const commit = process.env.COMMIT_REF;
const fallback = new Date().toISOString();
const version = commit || fallback;

writeFileSync("dist/version.json", JSON.stringify({ version }, null, 2));

console.log(`version.json: ${version}`);
