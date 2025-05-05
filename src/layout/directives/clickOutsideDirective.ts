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

export default {
	name: "ClickOutSide",
	beforeMount: function (el: any, binding: any) {
		binding.event = function (event: any) {
			if (!(el === event.target || el.contains(event.target))) {
				if (binding.value instanceof Function) {
					binding.value(event);
				}
			}
		};

		document.body.addEventListener("click", binding.event);
		// saving this on the element as the same instance
		// needs to be removed in unmounted
		el._clickListener = binding.event;
	},
	unmounted: function (el: any) {
		document.body.removeEventListener("click", el._clickListener);
	},
};
