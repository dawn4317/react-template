'use strict';

module.exports = {
	root: true,
	env: {
		es6: true,
		browser: true,
		node: true
	},
	globals: {
		DEBUG: true
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		useJSXTextNode: true,
		project: './tsconfig.json',
		extraFileExtensions: ['.ts', '.tsx', '.vue']
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:react/recommended'
		// 'react-app'
	],
	// https://github.com/yannickcr/eslint-plugin-react#configuration
	settings: {
		react: {
			createClass: 'createReactClass', // Regex for Component Factory to use,
			pragma: 'React', // Pragma to use, default to "React"
			version: 'detect'
		},
		linkComponents: [
			// Components used as alternatives to <a> for linking, eg. <Link to={ url } />
			'Hyperlink',
			{ name: 'Link', linkAttribute: 'to' }
		]
	},
	rules: {
		'no-debugger': 'off',
		'linebreak-style': ['error', 'unix'],
		indent: 'off',
		'@typescript-eslint/indent': [
			'error',
			'tab',
			{
				SwitchCase: 1,
				VariableDeclarator: 1
			}
		],
		semi: 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/semi': ['error', 'always'],
		'@typescript-eslint/array-type': [
			'error',
			{
				default: 'generic',
				readonly: 'generic'
			}
		],
		camelcase: 'off',
		'@typescript-eslint/camelcase': [
			'error',
			{
				properties: 'always',
				ignoreDestructuring: true
			}
		],
		'@typescript-eslint/no-use-before-define': [
			'error',
			{
				functions: false,
				classes: false,
				typedefs: false
			}
		],
		'@typescript-eslint/prefer-regexp-exec': 'off',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				vars: 'local',
				args: 'none'
			}
		]
	}
};
