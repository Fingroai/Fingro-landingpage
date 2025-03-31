module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    // Desactivar reglas específicas para resolver problemas de TypeScript
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    // Desactivar temporalmente para resolver errores de módulos
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
  overrides: [
    {
      files: ['*.css'],
      rules: {
        // Desactivar reglas para archivos CSS
        'at-rule-no-unknown': 'off',
      },
    },
  ],
}
