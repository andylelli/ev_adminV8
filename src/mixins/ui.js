import { f7 } from "framework7-vue";

import { Dom7 } from "framework7";
var $$ = Dom7;

export default {
	methods: {		
		navBackLink(url, f7router) {
			var view = f7.views.current;
			view.router.back({
				url: url,
			});
		},
		uiDropdown(match) {
			var el;
			el = $$(match).find(".item-input-wrap");
			el.removeClass("input-dropdown");

			el = $$(match).find(".item-inner");
			el.addClass("display-flex flex-direction-row");

			el = $$(match).find(".item-title");
			el.attr("style", "font-size: 18px; height: 20px; margin-right:auto; padding-top:6px");			

			el = $$(match).find("select");
			el.attr("style", "height: 20px; margin-top: 5px;");

			el = $$(match).find(".input-with-value");
			el.attr("dir", "rtl");	
			console.log('dropdowns changed');
		}				
	}
}