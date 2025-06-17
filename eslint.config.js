import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import ts from "typescript-eslint";

export default [
	{
		languageOptions: {
			ecmaVersion: "latest",
			globals: {
				window: "readonly",
				document: "readonly",
				console: "readonly",
				setTimeout: "readonly",
				clearTimeout: "readonly",
				setInterval: "readonly",
				clearInterval: "readonly",
			},
		},
	},

	// js
	js.configs.recommended,

	// ts
	...ts.configs.recommended,
	{
		rules: {
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-expressions": [
				"error",
				{ allowTernary: true },
			],
			"no-async-promise-executor": "off",
		},
	},

	// vue
	...vue.configs["flat/recommended"],
	{
		// files: ['*.vue', '**/*.vue'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
			},
		},
	},
	{
		rules: {
			"vue/multi-word-component-names": "off",
			"vue/no-unused-vars": ["error", { ignorePattern: "^_" }],
			"vue/max-attributes-per-line": ["error", { singleline: 5 }],
			"vue/html-indent": "off",
			"vue/singleline-html-element-content-newline": "off",
			"vue/html-closing-bracket-newline": "off",
			"vue/html-self-closing": "off",
		},
	},
];
