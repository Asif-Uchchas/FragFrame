import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  { ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts'] },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // Deliberately discarded values — chiefly props destructured off a
      // component only to keep them from reaching the DOM — are marked with a
      // leading underscore rather than suppressed case by case.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];

export default config;
