import { createRule } from '../../utils/createRule';
import { TSESLint, TSESTree } from '@typescript-eslint/utils';
import decoratorIsInArray from '../../utils/decoratorIsInArray';

const rule = createRule({
  name: 'non-optional-validate-nested-needs-is-defined',
  meta: {
    docs: {
      description:
        'A non-optional property using @ValidateNested() should have @IsDefined().',
      recommended: false,
      requiresTypeChecking: false,
    },
    messages: {
      shouldUseIsDefinedDecorator:
        'A non-optional property using @ValidateNested() should have @IsDefined().',
    },
    hasSuggestions: false,
    schema: [],
    type: 'suggestion',
  },
  defaultOptions: [],

  create(
    context: Readonly<
      TSESLint.RuleContext<'shouldUseIsDefinedDecorator', never[]>
    >,
  ) {
    return {
      PropertyDefinition(node: TSESTree.PropertyDefinition): void {
        const { decorators } = node;

        if (!decorators?.length) {
          return;
        }

        const hasIsOptionalDecorator = decoratorIsInArray(
          decorators,
          'IsOptional',
        );

        if (hasIsOptionalDecorator) {
          return;
        }

        const hasValidateNestedDecorator = decoratorIsInArray(
          decorators,
          'ValidateNested',
        );

        if (!hasValidateNestedDecorator) {
          return;
        }

        const hasIsDefinedDecorator = decoratorIsInArray(
          decorators,
          'IsDefined',
        );

        if (hasIsDefinedDecorator) {
          return;
        }

        context.report({
          node: node,
          messageId: 'shouldUseIsDefinedDecorator',
        });
      },
    };
  },
});

export default rule;
