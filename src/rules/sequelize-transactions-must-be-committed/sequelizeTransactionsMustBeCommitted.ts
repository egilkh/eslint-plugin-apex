import { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/createRule';
import { simpleTraverse } from '@typescript-eslint/typescript-estree';

export const sequelizeTransactionsMustBeCommitted = (
  node:
    | TSESTree.MethodDefinition
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionDeclaration,
): boolean => {
  let didFindTransaction = false;

  simpleTraverse(node, {
    enter: (node, parent) => {
      const isParentMemberExpression =
        parent?.type === TSESTree.AST_NODE_TYPES.MemberExpression;

      if (
        node?.type === TSESTree.AST_NODE_TYPES.Identifier &&
        node?.name === 'transaction' &&
        isParentMemberExpression
      ) {
        didFindTransaction = true;
      }
    },
  });

  if (!didFindTransaction) {
    return false;
  }

  let didFindCommit = false;
  let didFindRollback = false;

  simpleTraverse(node, {
    enter: (node) => {
      if (
        node?.type === TSESTree.AST_NODE_TYPES.Identifier &&
        node?.name === 'commit'
      ) {
        didFindCommit = true;
      }
      if (
        node?.type === TSESTree.AST_NODE_TYPES.Identifier &&
        node?.name === 'rollback'
      ) {
        didFindRollback = true;
      }
    },
  });

  return !(didFindCommit && didFindRollback);
};

const rule = createRule({
  name: 'sequelize-transactions-must-be-committed',
  meta: {
    docs: {
      description:
        'when using a sequelize.transaction ensure it will be committed and rolled back',
      recommended: false,
      requiresTypeChecking: false,
    },
    messages: {
      sequelizeTransactionsMustBeCommitted:
        'A transaction must be committed and rolled back',
    },
    schema: [],
    hasSuggestions: false,
    type: 'suggestion',
  },
  defaultOptions: [],

  create(
    context: Readonly<
      TSESLint.RuleContext<'sequelizeTransactionsMustBeCommitted', never[]>
    >,
  ) {
    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      MethodDefinition(node: TSESTree.MethodDefinition): void {
        if (sequelizeTransactionsMustBeCommitted(node)) {
          context.report({
            node: node,
            messageId: 'sequelizeTransactionsMustBeCommitted',
          });
        }
      },
      ArrowFunctionExpression(node: TSESTree.ArrowFunctionExpression): void {
        if (sequelizeTransactionsMustBeCommitted(node)) {
          context.report({
            node: node,
            messageId: 'sequelizeTransactionsMustBeCommitted',
          });
        }
      },
      FunctionDeclaration(node: TSESTree.FunctionDeclaration): void {
        if (sequelizeTransactionsMustBeCommitted(node)) {
          context.report({
            node: node,
            messageId: 'sequelizeTransactionsMustBeCommitted',
          });
        }
      },
    };
  },
});

export default rule;
