export = {
  parser: '@typescript-eslint/parser',
  parserOptions: { sourceType: 'module' },
  rules: {
    //  "nestjs-typed/api-methods-have-documentation": "error",
    'nestjs-apex/api-method-should-specify-api-response': 'error',
    'nestjs-apex/validated-non-primitive-property-needs-type-decorator':
      'error',
    'nestjs-apex/all-properties-are-whitelisted': 'error',
  },
};
