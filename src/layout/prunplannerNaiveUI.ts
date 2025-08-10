import type { GlobalThemeOverrides } from "naive-ui";

const WHITE: string = "#ffffff";
const BLACK: string = "#000000";
const BASE: string = "#212529";
const BACKGROUND: string = "#1e1e1e";
const ERROR: string = "#ef4444";
const HOVER: string = "#2a61bd";
const DARK_BLUE: string = "#212d40";
const BUTTON_BG: string = "#1e3a8a";
const GREEN_BG: string = "#22c55e";
const GREEN_BG_HOVER: string = "#179c48";
const GRAY_DARK: string = "#151515";

export const prunplannerTheme: GlobalThemeOverrides = {
	common: {
		primaryColor: "#6ea8fe",
		inputColor: DARK_BLUE,
		inputColorDisabled: BASE,
		baseColor: BLACK,
		// borderColor: "#404040",
		fontFamily: "Roboto, Helvetica, Arial, sans-serif",
		fontFamilyMono: "Roboto, serif",
		hoverColor: "#222222",
		actionColor: WHITE,
	},
	Card: {
		color: GRAY_DARK,
		colorModal: GRAY_DARK,
		actionColor: GRAY_DARK,

		borderRadius: "6px",
		borderColor: "rgba(255,255,255,0.05)",
		boxShadow:
			"0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1)",

		textColor: "rgba(255,255,255,0.8)",

		// font sizes
		titleFontWeight: "bold",
		titleFontSizeMedium: "16px",
		fontSizeMedium: "14px",
		// paddings
		paddingMedium: "5px 10px",
	},
	Form: {
		labelTextColor: "rgba(255,255,255,0.8)",
		labelFontSizeLeftSmall: "14px",
		labelPaddingHorizontal: "0 20px 0 0",
		feedbackHeightSmall: "5px",
	},
	Input: {
		fontSizeSmall: "14px",
		textColor: "rgba(255,255,255,0.8)",
		color: GRAY_DARK,
		// border
		border: "0",
		borderError: "0",
		borderHover: GRAY_DARK,
		borderPressed: GRAY_DARK,
		borderFocus: GRAY_DARK,
		colorFocus: GRAY_DARK,
	},
	InputNumber: {
		color: GRAY_DARK,

		// border
		border: "0",
		borderError: "0",
		borderHover: GRAY_DARK,
		borderPressed: GRAY_DARK,
		borderFocus: GRAY_DARK,
	},
	Button: {
		fontWeight: "regular",
		fontSizeTiny: "12px",
		fontSizeSmall: "14px",

		paddingTiny: "0 5px",
		paddingSmall: "0 10px 0 10px",
		paddingMedium: "0 20px 0 20px",

		// icon
		iconSizeSmall: "16px",
		iconMarginSmall: "3px",

		// color
		color: BUTTON_BG,
		colorFocus: BUTTON_BG,
		colorHover: HOVER,
		colorPressed: HOVER,
		colorDisabled: BASE,

		// tertiary
		colorTertiary: GRAY_DARK,
		colorTertiaryHover: GRAY_DARK,
		colorTertiaryPressed: GRAY_DARK,

		textColorTertiary: WHITE,

		// error
		textColorError: WHITE,
		textColorHoverError: WHITE,
		textColorTextHoverError: WHITE,
		textColorDisabledError: WHITE,
		colorError: ERROR,
		colorFocusError: ERROR,
		colorHoverError: "#c22f2f",
		colorPressedError: "#c22f2f",
		colorDisabledError: "#3b0404",
		borderHoverError: "0",

		// success
		textColorSuccess: WHITE,
		textColorHoverSuccess: WHITE,
		textColorTextHoverSuccess: WHITE,
		colorHoverSuccess: GREEN_BG_HOVER,
		colorSuccess: GREEN_BG,
		colorHoverSucess: GREEN_BG_HOVER,
		colorPressedSucess: GREEN_BG_HOVER,
		colorDisabledSucess: BASE,
		rippleColorSuccess: GREEN_BG_HOVER,
		borderHoverSuccess: "0",

		// text
		textColor: WHITE,
		textColorHover: WHITE,
		textColorPressed: WHITE,
		textColorFocus: WHITE,
		textColorTextHover: WHITE,
		textColorTextPressed: WHITE,
		textColorTextFocus: WHITE,
		textColorGhostHover: WHITE,
		textColorGhostPressed: WHITE,
		textColorGhostFocus: WHITE,

		// border
		border: "0",
		borderError: "0",
		borderSuccess: "0",
		borderHover: WHITE,
		borderPressed: WHITE,
		borderFocus: WHITE,
	},
	DataTable: {
		thTextColor: "rgba(255,255,255,0.9)",
		tdTextColor: "rgba(255,255,255,0.8)",
		fontSizeMedium: "14px",
		thFontWeight: "bold",
		// colors
		thColor: GRAY_DARK,
		tdColorStriped: GRAY_DARK,
		tdColor: "rgba(255,255,255,0.02)",
		// padding
		thPaddingMedium: "5px 10px",
		tdPaddingMedium: "5px 10px",
		tdColorSorting: "rgba(255,255,255,0)",
		tdColorHover: "rgba(255,255,255,0)",
	},
	Table: {
		thTextColor: "rgba(255,255,255,0.9)",
		tdTextColor: "rgba(255,255,255,0.8)",
		fontSizeMedium: "14px",
		thFontWeight: "bold",
		// color
		thColor: GRAY_DARK,
		thColorModal: GRAY_DARK,
		thColorPopover: GRAY_DARK,
		tdColorStriped: GRAY_DARK,
		tdColorStripedModal: GRAY_DARK,
		tdColorStripedPopover: GRAY_DARK,
		tdColor: "rgba(255,255,255,0.02)",
		tdColorModal: "rgba(255,255,255,0.02)",
		tdColorPopover: "rgba(255,255,255,0.02)",
		// padding
		thPaddingMedium: "5px 10px",
		tdPaddingMedium: "5px 10px",
	},
	Select: {
		menuBoxShadow: "",
		fontSizeSmall: "10px",
		peers: {
			InternalSelection: {
				color: GRAY_DARK,
				fontSizeSmall: "14px",
				fontSizeMedium: "14px",
				textColor: "rgba(255,255,255,0.8)",
				border: "0",
				borderFocus: GRAY_DARK,
				borderHover: GRAY_DARK,
				borderActive: GRAY_DARK,
				colorActive: GRAY_DARK,
			},
			InternalSelectMenu: {
				optionFontSizeSmall: "14px",
				color: GRAY_DARK,
				borderRadius: "0",
				optionFontSizeMedium: "14px",
				optionTextColor: "rgba(255,255,255,0.8)",
			},
		},
	},
	Modal: {
		color: BACKGROUND,
	},
	Divider: {},
	Tooltip: {
		color: BACKGROUND,
	},
	Tabs: {
		colorSegment: BACKGROUND,
	},
	LoadingBar: {
		colorError: ERROR,
		colorLoading: "#c0e219",
	},
};
