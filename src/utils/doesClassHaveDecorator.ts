import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';

export const doesClassDeclarationHaveDecorator = (
  node: TSESTree.ClassDeclaration,
  decoratorName: string,
): boolean => {
  const decoratorsMatching =
    node.decorators?.filter((d) => {
      if (
        d.expression.type === AST_NODE_TYPES.CallExpression &&
        d.expression.callee.type === AST_NODE_TYPES.Identifier
      ) {
        return d.expression.callee.name === decoratorName;
      }

      return false;
    }) ?? [];

  return decoratorsMatching.length > 0;
};
