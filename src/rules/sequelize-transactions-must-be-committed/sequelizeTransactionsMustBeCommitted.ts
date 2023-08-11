import { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/createRule';
import { simpleTraverse } from '@typescript-eslint/typescript-estree';

export const sequelizeTransactionsMustBeCommitted = (
  node:
    | TSESTree.FunctionDeclaration
    | TSESTree.ArrowFunctionExpression
    | TSESTree.FunctionExpression,
): boolean => {
  let didFindTransaction = false;

  simpleTraverse(node, {
    enter: (enterNode) => {
      if (enterNode.type === TSESTree.AST_NODE_TYPES.CallExpression) {
        const { callee } = enterNode;

        if (
          callee.type === TSESTree.AST_NODE_TYPES.MemberExpression &&
          callee.property.type === TSESTree.AST_NODE_TYPES.Identifier &&
          callee.property.name === 'transaction'
        ) {
          didFindTransaction = true;
        }
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

const rule = createRule<[], 'sequelizeTransactionsMustBeCommitted'>({
  name: 'sequelize-transactions-must-be-committed',
  meta: {
    docs: {
      description:
        'when using a sequelize.transaction ensure it will be committed and rolled back',
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
      FunctionExpression(node: TSESTree.FunctionExpression): void {
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
