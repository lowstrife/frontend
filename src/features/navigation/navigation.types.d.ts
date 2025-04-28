import { Component } from "vue";

interface IMenuItem {
	label: string;
	routerLink?: string;
	functionCall?: Function;
	children?: IMenuItem[];
	icon?: Component;
}

interface IMenuSection {
	label: string;
	children: IMenuItem[];
}
