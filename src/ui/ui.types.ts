export type SizeKey = "sm" | "md";
export type ColorKey =
	| "primary"
	| "success"
	| "error"
	| "warning"
	| "secondary";

export interface PButtonConfig {
	base: string;
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

export interface PButtonGroupConfig {
	horizontal: string;
	vertical: string;
}

export interface PTooltipConfig {
	trigger: string;
	tooltip: string;
}

export interface PFormConfig {
	container: string;
}

export interface PFormItemConfig {
	label: string;
	content: string;
}

export interface PInputNumberConfig {
	container: string;
	input: string;
	buttonContainer: string;
	buttonChangeAllowed: string;
	buttonChangeUnallowed: string;
	sizes: Record<
		SizeKey,
		{ container: string; input: string; buttonContainer: string }
	>;
}
