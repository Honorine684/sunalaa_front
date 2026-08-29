const fs = require("fs");
const path = require("path");

function getKeys(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) => {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      return getKeys(value, full);
    }
    return [full];
  });
}

const root = path.join(__dirname, "..");
const en = JSON.parse(fs.readFileSync(path.join(root, "messages/en.json"), "utf8"));
const fr = JSON.parse(fs.readFileSync(path.join(root, "messages/fr.json"), "utf8"));

const enKeys = new Set(getKeys(en));
const frKeys = new Set(getKeys(fr));

const missingInFr = [...enKeys].filter((k) => !frKeys.has(k));
const missingInEn = [...frKeys].filter((k) => !enKeys.has(k));

let hasErrors = false;

if (missingInFr.length > 0) {
  console.error(`\n❌  ${missingInFr.length} clé(s) présente(s) en EN mais absente(s) en FR :`);
  missingInFr.forEach((k) => console.error(`     - ${k}`));
  hasErrors = true;
}

if (missingInEn.length > 0) {
  console.error(`\n❌  ${missingInEn.length} clé(s) présente(s) en FR mais absente(s) en EN :`);
  missingInEn.forEach((k) => console.error(`     - ${k}`));
  hasErrors = true;
}

if (hasErrors) {
  console.error("\n⚠️  Corrige les clés manquantes avant de pusher.\n");
  process.exit(1);
} else {
  console.log(`\n✅  i18n OK — ${enKeys.size} clés synchronisées (EN = FR).\n`);
}
