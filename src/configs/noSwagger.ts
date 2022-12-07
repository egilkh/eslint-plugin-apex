// Should turn off swagger rules for folks not using swagger typings
export = {
  parser: '@typescript-eslint/parser',
  parserOptions: { sourceType: 'module' },
  rules: {
    'nestjs-typed/api-method-should-specify-api-response': 'off',
    'nestjs-apex/branded-properties-should-have-api-property-decorator-with-type':
      'off',
  },
};
