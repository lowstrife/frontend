export type SizeKey = "sm" | "md";
export type ColorKey =
	| "primary"
	| "success"
	| "error"
	| "warning"
	| "secondary";

export interface PButtonConfig {
	base: string;
	iconBase: string;
	sizes: Record<SizeKey, { base: string; icon: string; spinner: string }>;
	colors: Record<
		ColorKey,
		{ base: string; hover?: string; text?: string; disabled?: string }
	>;
	defaultSize: SizeKey;
	defaultColor: ColorKey;
}

export interface PCheckboxConfig {
	container: string;
	label: string;
	input: string;
	checkIcon: string;
	checkIconSVG: string;
}
