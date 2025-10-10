import { defineConfig } from 'eslint/config'
import globals from 'globals'

export default defineConfig([
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: globals.node
		}
	},
	{
		rules: {
			'indent': [
				'error', 'tab', { SwitchCase: 1 }
			],
			'no-cond-assign': 'off',
			'linebreak-style': [
				'error', 'unix'
			],
			'quotes': [
				'error', 'single'
			],
			'semi': [
				'error', 'never'
			],
			'no-console': [
				'error', {
					'allow': ['warn', 'error']
				}
			],
			'no-empty': 'error',
			'no-undef': 'error',
			'eqeqeq': [
				'error', 'always'
			],
			'no-var': 'error',
			'prefer-const': 'error',
			'no-func-assign': 'error',
			'no-multi-spaces': 'error',
			'no-with': 'error',
			'camelcase': ['error', {'properties': 'always'}],
			'comma-spacing': ['error', {'before': false, 'after': true}],
			'comma-style': ['error', 'last'],
			'computed-property-spacing': ['error', 'never'],
			'func-call-spacing': ['error', 'never'],
			'func-style': ['error', 'declaration', { 'allowArrowFunctions': true }],
			'key-spacing': [
				'error', {
					'beforeColon': false,
					'afterColon': true,
					'mode': 'strict'
				}
			],
			'keyword-spacing': ['error', { 'before': true, 'after': true }],
			'space-before-blocks': ['error', 'always'],
			'padding-line-between-statements': ['error',
				{ 'blankLine': 'always', 'prev': '*', 'next': ['var', 'let', 'const'] },
				{ 'blankLine': 'always', 'prev': ['var', 'let', 'const'], 'next': '*' },
				{ 'blankLine': 'always', 'prev': '*', 'next': ['if', 'for', 'while', 'switch', 'try'] },
				{ 'blankLine': 'always', 'prev': ['if', 'for', 'while', 'switch', 'try'], 'next': '*' },
				{ 'blankLine': 'always', 'prev': '*', 'next': ['return', 'throw', 'break', 'continue'] },
				{ 'blankLine': 'never', 'prev': ['var', 'let', 'const'], 'next': ['var', 'let', 'const'] }
			]
		}
	}
])
