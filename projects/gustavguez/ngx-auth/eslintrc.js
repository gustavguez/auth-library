module.exports = {
    extends: [
		'@gustavguez/eslint-config'
	].map(require.resolve),
    parserOptions: {
        project: "tsconfig.json",
    },
    rules: {
		"@typescript-eslint/no-extraneous-class": "off",
		"@typescript-eslint/no-magic-numbers": "off",
		"@typescript-eslint/restrict-plus-operands": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-unsafe-call": "off",
		"@typescript-eslint/no-unsafe-member-access": "off",
		"@typescript-eslint/no-unsafe-assignment": "off",
		"@typescript-eslint/no-unsafe-return": "off",
	}
}