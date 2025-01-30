// place files you want to import through the `$lib` alias in this folder.
export function isValidSemver(version: string): boolean {
	// Regular expression for semantic versioning (with optional 'v' prefix)
	const semverRegex =
		/^v?(\d+)\.(\d+)\.(\d+)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?$/i;
	return semverRegex.test(version);
}
