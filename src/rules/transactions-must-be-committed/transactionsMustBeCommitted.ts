import { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/createRule';
import { simpleTraverse } from '@typescript-eslint/typescript-estree';

export const transactionsMustBeCommitted = (
  node: TSESTree.MethodDefinition,
): boolean => {
  let didFindTransaction = false;

  simpleTraverse(node, {
    enter: (node) => {
      if (
        node?.type === TSESTree.AST_NODE_TYPES.Identifier &&
        node?.name === 'transaction'
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
  name: 'transactions-must-be-committed',
  meta: {
    docs: {
      description:
        'when using a sequelize.transaction ensure it will be committed and rolled back',
      recommended: false,
      requiresTypeChecking: false,
    },
    messages: {
      transactionsMustBeCommitted:
        'A transaction must be committed and rolled back',
    },
    schema: [],
    hasSuggestions: false,
    type: 'suggestion',
  },
  defaultOptions: [],

  create(
    context: Readonly<
      TSESLint.RuleContext<'transactionsMustBeCommitted', never[]>
    >,
  ) {
    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      MethodDefinition(node: TSESTree.MethodDefinition): void {
        if (transactionsMustBeCommitted(node)) {
          context.report({
            node: node,
            messageId: 'transactionsMustBeCommitted',
          });
        }
      },
    };
  },
});

export default rule;
