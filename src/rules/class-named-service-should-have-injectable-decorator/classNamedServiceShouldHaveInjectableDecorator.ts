import { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/createRule';
import { doesClassDeclarationHaveDecorator } from '../../utils/doesClassHaveDecorator';

const rule = createRule({
  name: 'class-named-service-should-have-injectable-decorator',
  meta: {
    docs: {
      description:
        'Class named Service should have the Injectable() decorator.',
      recommended: false,
      requiresTypeChecking: false,
    },
    messages: {
      classNamedServiceShouldHaveInjectableDecorator: `Class named Service should have the Injectable() decorator.`,
    },
    schema: [],
    hasSuggestions: false,
    type: 'suggestion',
  },
  defaultOptions: [],

  create(
    context: Readonly<
      TSESLint.RuleContext<
        'classNamedServiceShouldHaveInjectableDecorator',
        never[]
      >
    >,
  ) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration): void {
        if (
          node.id?.name.endsWith('Service') &&
          !doesClassDeclarationHaveDecorator(node, 'Injectable')
        ) {
          context.report({
            node: node,
            messageId: 'classNamedServiceShouldHaveInjectableDecorator',
          });
        }
      },
    };
  },
});

export default rule;
