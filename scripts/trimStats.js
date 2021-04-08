const { readJson, outputFile } = require('fs-extra');

const statsFile = process.argv[2];

const isUserCode = (mod) => !(mod.name || mod.moduleName).match(/(node_modules|webpack\/runtime)/);
const dedupe = (arr) => [...new Set(arr)];

const main = async () => {
  const stats = await readJson(statsFile);
  const trimmedModules = stats.modules
    .filter(isUserCode)
    .map(({ id, name, modules, reasons }) => {
      const trimmedReasons = dedupe(reasons.filter(isUserCode).map((r) => r.moduleName))
        .filter((n) => n !== name)
        .map((moduleName) => ({ moduleName }));
      if (!trimmedReasons.length) return null;
      return {
        id,
        name,
        modules: modules && modules.map((m) => ({ name: m.name })),
        reasons: trimmedReasons,
      };
    })
    .filter(Boolean);

  await outputFile(
    statsFile.replace('.json', '.trimmed.json'),
    JSON.stringify({ modules: trimmedModules }, null, 2)
      .replace(/{\n {10}/g, '{ ')
      .replace(/\n {8}}/g, ' }')
  );
};

main();
