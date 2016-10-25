import * as ts from 'typescript';

export interface InterfaceMember {
  name: string;
  typeString: string;
}

export interface InterfaceDescription {
  name: string;
  members: InterfaceMember[];
}

export function extractInterfaceDefinitionsFromFile(sourceFilePath: string, options: ts.CompilerOptions): InterfaceDescription[] {
  const program = ts.createProgram([sourceFilePath], options);
  const emitResult = program.emit();

  const typeChecker = program.getTypeChecker();

  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
  console.log(allDiagnostics);
  console.log(` emitResult.emitSkipped = ${ emitResult.emitSkipped ? 'YES' : 'NO'}`);

  const interfaces: InterfaceDescription[] = [];

  const sourceFile = program.getSourceFile(sourceFilePath);

  const extractIfInterface = (node: ts.Node) => {
    if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
      interfaces.push(interfaceDescription(node as ts.InterfaceDeclaration, typeChecker));
    }
  }

  ts.forEachChild(sourceFile, extractIfInterface, children => children.forEach(extractIfInterface));

  return interfaces;
}

function interfaceDescription(interfaceDeclaration: ts.InterfaceDeclaration, typeChecker: ts.TypeChecker): InterfaceDescription {
  const desc: InterfaceDescription = { name: interfaceDeclaration.name.text, members: []}

 
  console.log('interface name = ', interfaceDeclaration.name.text);


  for (const member of interfaceDeclaration.members) {
    if (member.kind !== ts.SyntaxKind.PropertySignature) {
      console.error('member that was not a property signature');
      continue;
    }

    const memberName = (member.name && member.name.getText() || '');
    const type = typeChecker.getTypeAtLocation(member);
    const memberTypeSignature = typeChecker.typeToString(type);

    console.log('name:      ', memberName);
    console.log('signature: ', memberTypeSignature);

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
        desc.members.push({ name: memberName, typeString: memberTypeSignature });
        break;
      case ts.SyntaxKind.StringKeyword:
        console.log("-> string")
        desc.members.push({ name: memberName, typeString: memberTypeSignature });
        break;
      case ts.SyntaxKind.ArrayType:
        console.log("-> array type")
        desc.members.push({ name: memberName, typeString: memberTypeSignature });
        break;
      case ts.SyntaxKind.TupleType:
        console.log("-> number")
        desc.members.push({ name: memberName, typeString: memberTypeSignature });
        break;
      case ts.SyntaxKind.IntersectionType:
        console.log("-> IntersectionType")
        desc.members.push({ name: memberName, typeString: memberTypeSignature });
        break;
      case ts.SyntaxKind.UnionType:
        const unionTypeNode = memberChildType as ts.UnionTypeNode;
        console.log(unionTypeNode.types.map(tn => tn.kind).join(', '));
        console.log("-> UnionType")
        desc.members.push({ name: memberName, typeString: memberTypeSignature });
        break;
      case ts.SyntaxKind.LiteralType:
        console.log("-> LiteralType");
        desc.members.push({ name: memberName, typeString: memberTypeSignature });
        break;
      case ts.SyntaxKind.NullKeyword:
        console.log("-> null");
        desc.members.push({ name: memberName, typeString: memberTypeSignature });
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

    console.log();
  }

  return desc;
}


