import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

const reactRecommendedRules = reactPlugin.configs.recommended.rules
const jsxA11yRecommended = jsxA11y.flatConfigs.recommended

export default defineConfig([
  globalIgnores(['dist', 'legacy', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['legacy/**'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      jsxA11yRecommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintConfigPrettier,
    ],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactRecommendedRules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'jsx-a11y/anchor-is-valid': 'warn',
    },
  },
])
