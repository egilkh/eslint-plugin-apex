import { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/createRule';
import { doesClassDeclarationHaveDecorator } from '../../utils/doesClassHaveDecorator';

const rule = createRule({
  name: 'class-named-guard-should-have-injectable-decorator',
  meta: {
    docs: {
      description: 'Class named Guard should have the Injectable() decorator.',
      recommended: false,
      requiresTypeChecking: false,
    },
    messages: {
      classNamedGuardShouldHaveInjectableDecorator: `Class named Guard should have the Injectable() decorator.`,
    },
    schema: [],
    hasSuggestions: false,
    type: 'suggestion',
  },
  defaultOptions: [],

  create(
    context: Readonly<
      TSESLint.RuleContext<
        'classNamedGuardShouldHaveInjectableDecorator',
        never[]
      >
    >,
  ) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration): void {
        if (
          node.id?.name.endsWith('Guard') &&
          !doesClassDeclarationHaveDecorator(node, 'Injectable')
        ) {
          context.report({
            node: node,
            messageId: 'classNamedGuardShouldHaveInjectableDecorator',
          });
        }
      },
    };
  },
});

export default rule;
