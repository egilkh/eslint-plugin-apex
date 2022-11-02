// Should turn off swagger rules for folks not using swagger typings
export = {
  parser: '@typescript-eslint/parser',
  parserOptions: { sourceType: 'module' },
  rules: {
    'nestjs-typed/api-method-should-specify-api-response': 'off',
  },
};
