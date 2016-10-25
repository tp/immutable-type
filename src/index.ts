// import x from 'asdf-ts';

import {readFileSync} from 'fs';

import {compilerOptions} from './compilerOptions';

import {extractInterfaceDefinitionsFromFile} from './extractInterfaceDefinitions';

const sourceFilePath = 'src/person.ts';

const interfaceDescriptions = extractInterfaceDefinitionsFromFile(sourceFilePath, compilerOptions);

console.log('### OUTPUT ###');

for (const desc of interfaceDescriptions) {
  console.log(`export interface ${desc.name} {`);

  for (const member of desc.members) {
    console.log(`  readonly ${member.name}: ${member.typeString};`);
  }

  console.log(`}`);
  console.log();
}