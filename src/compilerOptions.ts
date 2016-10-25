import * as ts from 'typescript';

export const compilerOptions: ts.CompilerOptions = {
  traceResolution: false,
  declaration: true,
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ES6,
  noEmitOnError: false,
  noImplicitAny: true,
  removeComments: true,
  preserveConstEnums: true,
  inlineSourceMap: false,
  sourceMap: true,
  strictNullChecks: true,
  noFallthroughCasesInSwitch: true,
  allowJs: false,
  // outDir: "build",
};