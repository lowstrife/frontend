import { PButtonConfig } from "@/ui/ui.types";

export const buttonConfig: PButtonConfig = {
	base: "inline-flex items-center leading-none rounded-sm cursor-pointer",
	iconBase: "inline-flex items-center justify-center",
	defaultSize: "md",
	defaultColor: "primary",
	sizes: {
		sm: {
			base: "py-1 px-1 gap-1 text-xs",
			icon: "w-[12px] h-[12px]",
			spinner: "w-[12px] h-[12px]",
		},
		md: {
			base: "py-1 px-2 gap-2 text-sm",
			icon: "w-4 h-4",
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
			base: "bg-green-600 text-white",
			hover: "hover:bg-green-700",
			disabled: "disabled:bg-green-600/50 disabled:text-white/80",
		},
		secondary: {
			base: "bg-gray-600 text-white",
			hover: "hover:bg-gray-700",
			disabled: "disabled:bg-gray-600/50 disabled:text-white/80",
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
