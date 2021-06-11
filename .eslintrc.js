module.exports = {
	env: {
		commonjs: true,
		es2021: true,
		node: true,
	},
	extends: [
		'airbnb-base',
	],
	parserOptions: {
		ecmaVersion: 12,
	},
	rules: {
		indent: ['error', 'tab'],
		'no-tabs': 'off',
		'no-plusplus': 'off',
		'no-restricted-syntax': 'off',
		'no-console': 'off',
		'global-require': 'off',
		'import/no-dynamic-require': 'off',
	},
};
