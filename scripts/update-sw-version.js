const fs   = require("fs");
const path = require("path");

const buildIdPath = path.join(__dirname, "../.next/BUILD_ID");
const swPath      = path.join(__dirname, "../public/sw.js");

if (!fs.existsSync(buildIdPath)) {
  console.log("⚠️  Pas de BUILD_ID trouvé — version SW inchangée (mode dev ?)");
  process.exit(0);
}

const buildId = fs.readFileSync(buildIdPath, "utf8").trim().slice(0, 10);

let sw = fs.readFileSync(swPath, "utf8");

sw = sw.replace(
  /const CACHE_STATIC = "sunalaa-static-[^"]+"/,
  `const CACHE_STATIC = "sunalaa-static-${buildId}"`
);
sw = sw.replace(
  /const CACHE_PAGES\s*=\s*"sunalaa-pages-[^"]+"/,
  `const CACHE_PAGES  = "sunalaa-pages-${buildId}"`
);

fs.writeFileSync(swPath, sw);
console.log(`✅  SW cache version → ${buildId}`);
