// import x from 'asdf-ts';

import * as ts from 'typescript';
import {readFileSync} from 'fs';

const sourceFilePath = '/Users/timm/Projects/ImmutableStruct.ts/src/person.ts';

function convertTemplate(filePath: string, options: ts.CompilerOptions): void {
  const program = ts.createProgram([filePath], options);
  const emitResult = program.emit();

  const typeChecker = program.getTypeChecker();

  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
  console.log(allDiagnostics);
  console.log(` emitResult.emitSkipped = ${ emitResult.emitSkipped ? 'YES' : 'NO'}`);
/*
    allDiagnostics.forEach(diagnostic => {
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    });
    */

   let sourceFile = program.getSourceFile(sourceFilePath);
	ts.forEachChild(sourceFile, printExpressionType, children => children.forEach(printExpressionType));

	function printExpressionType(node: ts.Node) {
    if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
      console.log('interface dec');

      console.log(node.getFullText())

      const interfaceDeclation = node as ts.InterfaceDeclaration;

      console.log('interface name = ', interfaceDeclation.name.text);


      for (const member of interfaceDeclation.members) {
        if (member.kind !== ts.SyntaxKind.PropertySignature) {
          console.error('member that was not a property signature');
          continue;
        }

        console.log('name:      ', member.name && member.name.getText());
        const type = typeChecker.getTypeAtLocation(member);
        console.log('signature: ', typeChecker.typeToString(type));

        /*
        const propSig = member as ts.PropertySignature;
        console.log("ini", propSig.initializer);
        console.log("mod", propSig.modifiers);
        propSig.getChildren().map(n => console.log(n.kind));
        */

        const memberChildType = member.getChildCount() === 4 ? member.getChildAt(2) : member.getChildAt(3); // to support optional fields like x?: number;

        switch (memberChildType.kind) {
          case ts.SyntaxKind.NumberKeyword:
            console.log("-> number")
            break;
          case ts.SyntaxKind.StringKeyword:
            console.log("-> string")
            break;
          case ts.SyntaxKind.ArrayType:
            console.log("-> array type")
            break;
          case ts.SyntaxKind.TupleType:
            console.log("-> number")
            break;
          case ts.SyntaxKind.IntersectionType:
            console.log("-> IntersectionType")
            break;
          case ts.SyntaxKind.UnionType:
            const unionTypeNode = memberChildType as ts.UnionTypeNode;
            console.log(unionTypeNode.types.map(tn => tn.kind).join(', '));
            console.log("-> UnionType")
            break;
          case ts.SyntaxKind.LiteralType:
            console.log("-> LiteralType");
            break;
          case ts.SyntaxKind.NullKeyword:
            console.log("-> null");
            break;
          case ts.SyntaxKind.TypeReference:
            console.log("-> TypeReference");
            const typeRefNode = memberChildType as ts.TypeReferenceNode;
            // TODO: How to check if optional? See other member children or is this somehow available on the typeRefNode?
            console.log('    type name: ', typeRefNode.typeName.getText());
            console.log('decorators', typeRefNode.decorators)
            console.log('flags', typeRefNode.flags)
            break;
          case ts.SyntaxKind.FunctionType:
            console.log("-> FunctionType (unsupported)");
            break;
          default:
            console.log("-> ???", memberChildType.kind);
        }

        // PropertySignature = 144,
        // PropertyDeclaration = 145,
        console.log(member.kind)
        
        console.log('  ', member.getChildCount());
        
        console.log(interfaceDeclation.typeParameters)
        
        // .getSignaturesOfType(type, ts.SignatureKind.Call);
        //console.log(p)
        const baseTypes = type.getBaseTypes()
        if (baseTypes) {
          for (const baseType of baseTypes) {
            console.log('     ', typeChecker.typeToString(baseType));
          }
        }

        console.log();
      }
    }
/*
		let type = typeChecker.getTypeAtLocation(node);
		console.log('Node text = ' + node.getText() + ' has type ' + typeChecker.typeToString(type));

		ts.forEachChild(node, printExpressionType, children => children.forEach(printExpressionType));
    */
	}
}

const options: ts.CompilerOptions = {
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


convertTemplate(sourceFilePath, options);
 // Parse a file
/*
const sourceFile = ts.createSourceFile(sourceFilePath, readFileSync(sourceFilePath).toString(), ts.ScriptTarget.ES6, true);

for (const stmt of sourceFile.statements) {
  // stmt.decorators
  if (stmt.kind === ts.SyntaxKind.InterfaceDeclaration) {
    console.log('interface!');
    
    console.log((stmt as any).members);
  }
}
*/
