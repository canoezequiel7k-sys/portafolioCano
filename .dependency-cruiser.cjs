module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "content-stays-independent",
      severity: "error",
      from: { path: "^src/content" },
      to: { path: "^src/(app|components|features|styles)" },
    },
    {
      name: "components-do-not-import-runtime-features",
      severity: "error",
      from: { path: "^src/components" },
      to: { path: "^src/(app|features)" },
    },
    {
      name: "core-i18n-stays-dom-free",
      severity: "error",
      from: { path: "^src/core/i18n" },
      to: { path: "^src/(app|components|features|styles)" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
  },
};
