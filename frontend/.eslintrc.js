module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended'
  ],
  root: true,
  rules: {
    // Desactivar todas las reglas para el despliegue
    'no-unused-vars': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off'
  }
}
