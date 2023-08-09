import { createRule } from '../../utils/createRule';
import { TSESTree } from '@typescript-eslint/utils';
import decoratorIsInArray from '../../utils/decoratorIsInArray';

const rule = createRule<
  [],
  'validateNestedNeedsIsOptionalOrIsDefinedDecorator'
>({
  name: 'validate-nested-property-needs-is-optional-or-is-defined',
  meta: {
    docs: {
      description:
        'A non-optional property using @ValidateNested() should have @IsDefined().',
      requiresTypeChecking: false,
    },
    messages: {
      validateNestedNeedsIsOptionalOrIsDefinedDecorator:
        'A non-optional property using @ValidateNested() should have @IsDefined().',
    },
    hasSuggestions: false,
    schema: [],
    type: 'suggestion',
  },
  defaultOptions: [],

  create(context) {
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
          messageId: 'validateNestedNeedsIsOptionalOrIsDefinedDecorator',
        });
      },
    };
  },
});

export default rule;
