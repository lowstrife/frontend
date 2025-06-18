/*
Creates a Vue directive that can be bound to DOM elements and will only be
triggered if the user makes a click outside of the element.

Is used in Dropdown elements on BaseView to handle the recipe selection:

<div
    @click="showMenu[bui.name + '#' + index] = true"
    v-click-outside="
    () => {
        showMenu[bui.name + '#' + index] = false;
    }
    "
>
*/
import type { DirectiveBinding } from "vue";

export default {
	name: "ClickOutSide",

	beforeMount(
		el: HTMLElement & { _clickListener?: (event: Event) => void },
		binding: DirectiveBinding
	) {
		const handler = (event: Event) => {
			if (!(el === event.target || el.contains(event.target as Node))) {
				if (typeof binding.value === "function") {
					binding.value(event);
				}
			}
		};

		document.body.addEventListener("click", handler);
		el._clickListener = handler;
	},

	unmounted(el: HTMLElement & { _clickListener?: (event: Event) => void }) {
		if (el._clickListener) {
			document.body.removeEventListener("click", el._clickListener);
		}
	},
};
