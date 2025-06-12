import { Component } from "vue";

interface IMenuItem {
	label: string;
	routerLink?: string;
	functionCall?: Function;
	children?: IMenuItem[];
	icon?: Component;
	display: boolean;
}

interface IMenuSection {
	label: string;
	display: boolean;
	children: IMenuItem[];
}
