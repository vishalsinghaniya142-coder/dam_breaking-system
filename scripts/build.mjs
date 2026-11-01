import { stat } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const { build: buildServer } = require("esbuild");
const { build: buildFrontend } = require("vite");

const projectRoot = process.cwd();
const serverEntry = path.join(projectRoot, "server.ts");
const serverOutput = path.join(projectRoot, "dist", "server.cjs");
const frontendOutput = path.join(projectRoot, "dist", "public", "index.html");

await buildFrontend();

await buildServer({
  entryPoints: [serverEntry],
  bundle: true,
  platform: "node",
  format: "cjs",
  packages: "external",
  sourcemap: true,
  outfile: serverOutput,
});

for (const artifact of [serverOutput, frontendOutput]) {
  const file = await stat(artifact).catch((error) => {
    if (error.code === "ENOENT") {
      throw new Error(`Production build did not generate required artifact: ${artifact}`);
    }

    throw error;
  });

  if (!file.isFile() || file.size === 0) {
    throw new Error(`Production build generated an invalid artifact: ${artifact}`);
  }
}

console.log(`Verified production server bundle: ${serverOutput}`);
console.log(`Verified production frontend entry: ${frontendOutput}`);
