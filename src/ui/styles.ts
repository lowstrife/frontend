import {
	PButtonConfig,
	PButtonGroupConfig,
	PCheckboxConfig,
	PFormConfig,
	PFormItemConfig,
	PInputNumberConfig,
	PTooltipConfig,
} from "@/ui/ui.types";

export const buttonConfig: PButtonConfig = {
	base: "inline-flex items-center justify-center leading-none rounded-sm cursor-pointer text-nowrap",
	defaultSize: "md",
	defaultColor: "primary",
	sizes: {
		sm: {
			base: "py-1 px-1 gap-1 text-xs h-[21px] min-w-[22px]",
			icon: "w-[12px] h-[12px]",
			spinner: "w-[12px] h-[12px]",
		},
		md: {
			base: "px-2 gap-2 text-sm h-[28px] min-w-[28px]",
			icon: "w-[16px] h-[16px]",
			spinner: "w-[16px] h-[16px]",
		},
	},
	colors: {
		primary: {
			base: "bg-blue-800 text-white",
			hover: "hover:bg-blue-700",
			disabled: "disabled:bg-blue-800/50 disabled:text-white/80",
		},
		success: {
			base: "bg-lime-500 text-black",
			hover: "hover:bg-lime-700",
			disabled: "disabled:bg-lime-500/50 disabled:text-white/80",
		},
		secondary: {
			base: "bg-gray-800 text-white",
			hover: "hover:bg-gray-700",
			disabled: "disabled:bg-gray-800/50 disabled:text-white/80",
		},
		error: {
			base: "bg-red-600 text-white",
			hover: "hover:bg-red-700",
			disabled: "disabled:bg-red-600/50 disabled:text-white/80",
		},
		warning: {
			base: "bg-gray-100 text-gray-900",
			hover: "hover:bg-gray-200",
			disabled: "disabled:bg-gray-100/50 disabled:text-gray-900",
		},
	},
};

export const checkboxConfig: PCheckboxConfig = {
	container: "inline-flex items-center",
	label: "flex items-center cursor-pointer relative",
	input: "peer h-4 w-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-table-border checked:bg-blue-800 checked:border-blue-800",
	checkIcon:
		"absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
	checkIconSVG: "h-3.5 w-3.5",
};

export const buttonGroupConfig: PButtonGroupConfig = {
	horizontal:
		"inline-flex child:rounded-none [&_button]:first:!rounded-l-sm [&_button]:last:!rounded-r-sm",
	vertical:
		"inline-flex flex-col child:rounded-none [&_button]:first:!rounded-t-sm [&_button]:last:!rounded-b-sm",
};

export const tooltipConfig: PTooltipConfig = {
	trigger: "ptooltip flex-1",
	tooltip:
		"z-50 py-1 px-2 text-sm text-white bg-black/90 border border-white/20 rounded shadow-lg",
};

export const formConfig: PFormConfig = {
	container: "grid grid-cols-[auto_1fr] child:mb-1",
};

export const formItemConfig: PFormItemConfig = {
	label: "flex items-center h-full pr-4",
	content: "flex items-center h-full",
};

export const inputNumberConfig: PInputNumberConfig = {
	container:
		"inline-flex w-full items-center leading-none rounded-sm text-nowrap bg-white/5 text-white/80",
	input: "w-full outline-0 ",
	buttonContainer: "flex flex-row ",
	buttonChangeAllowed: "text-white/70 cursor-pointer",
	buttonChangeUnallowed: "text-white/20 cursor-auto",
	sizes: {
		sm: {
			container: "gap-1 child:py-1",
			input: "px-1",
			buttonContainer: "pr-2 child:w-[20px] child:h-[20px]",
		},
		md: {
			container: "gap-1 child:py-1",
			input: "px-2",
			buttonContainer: "pr-2 child:w-[20px] child:h-[20px]",
		},
	},
};
