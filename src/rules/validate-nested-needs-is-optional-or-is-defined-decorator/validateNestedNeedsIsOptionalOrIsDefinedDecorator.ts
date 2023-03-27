import { createRule } from '../../utils/createRule';
import { TSESLint, TSESTree } from '@typescript-eslint/utils';
import decoratorIsInArray from '../../utils/decoratorIsInArray';

const rule = createRule({
  name: 'validate-nested-property-needs-is-optional-or-is-defined',
  meta: {
    docs: {
      description:
        'A non-optional property using @ValidateNested() should have @IsDefined().',
      recommended: false,
      requiresTypeChecking: false,
    },
    messages: {
      shouldUseIsDefinedOrIsOptionalDecorator:
        'A non-optional property using @ValidateNested() should have @IsDefined().',
    },
    hasSuggestions: false,
    schema: [],
    type: 'suggestion',
  },
  defaultOptions: [],

  create(
    context: Readonly<
      TSESLint.RuleContext<'shouldUseIsDefinedOrIsOptionalDecorator', never[]>
    >,
  ) {
    return {
      PropertyDefinition(node: TSESTree.PropertyDefinition): void {
        const { decorators } = node;

        if (!decorators?.length) {
          return;
        }

        const hasValidateNestedDecorator = decoratorIsInArray(
          decorators,
          'ValidateNested',
        );

        if (!hasValidateNestedDecorator) {
          return;
        }

        const hasIsOptionalDecorator = decoratorIsInArray(
          decorators,
          'IsOptional',
        );

        if (hasIsOptionalDecorator) {
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
          messageId: 'shouldUseIsDefinedOrIsOptionalDecorator',
        });
      },
    };
  },
});

export default rule;
