import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';

export default (
  decorators: TSESTree.Decorator[],
  decoratorName: string,
): boolean => {
  const decoratorsMatching = decorators.filter((decorator) => {
    const { expression } = decorator;

    if (
      expression.type === AST_NODE_TYPES.CallExpression &&
      expression.callee.type === AST_NODE_TYPES.Identifier
    ) {
      return expression.callee.name === decoratorName;
    }

    return false;
  });

  return decoratorsMatching.length > 0;
};
