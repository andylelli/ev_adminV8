<template>
	<f7-sheet
		:id="this.sheetId"
		style="height: auto; --f7-sheet-bg-color: #fff"
		swipe-to-close
		backdrop
		@sheet:closed="clearForm()"
	>
		<f7-page-content>
			<f7-block class="padding-top">
				<f7-block-title class="padding-bottom">
					{{ this.titleString }}</f7-block-title
				>
				<f7-list form id="aaa">
					<f7-list-input
						:key="this.fieldname"
						:id="fieldId(this.fieldname)"
						:type="this.fieldtype"
						step="0.01"
						:placeholder="this.title"
						:value="decode(this.value)"
						@input="update($event)"
						validate
						required
					></f7-list-input>
				</f7-list>
				<div
					style="
						padding-left: 25px;
						padding-right: 25px;
						height: 50px;
					"
				>
					<div v-show="this.allowChange === true">
						<general-button
							class="margin-top margin-bottom"
							@generalButtonAction="submit()"
							label="UPDATE"
							width="200"
							type="fill"
						></general-button>
					</div>
				</div>
			</f7-block>
		</f7-page-content>
	</f7-sheet>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { Dom7 } from "framework7";
var $$ = Dom7;

import misc from "../../mixins/misc";
import login from "../../mixins/login";

import generalButton from "../misc/generalButton.vue";

import escape from "../../js/config/escape.js";

export default {
	name: "sheet-edit",
	data() {
		return {
			id: null,
			fieldname: null,
			value: null,
			title: null,
			fieldtype: null,
			allowChange: false,
		};
	},
	props: ["page", "table", "alias"],
	mixins: [misc, login],
	components: {
		generalButton,
	},
	inject: ["eventBus"],
	computed: {
		titleString() {
			var title = "EDIT " + this.title;
			return title.toUpperCase();
		},
		sheetId() {
			var str = "edit-" + this.table;
			return str;
		},
	},
	methods: {
		decode(str) {
			return escape.decodeXML(str);
		},
		update(event) {
			this.value = event.target.value;
			this.allowChange = this.isValid();
		},
		fieldId(field) {
			var sheetId = this.sheetId;
			return sheetId + "-" + field;
		},
		clearForm() {
			this.value = "";
			this.allowChange = false;
		},
		isValid() {
			var isValid = true;
			if (this.value.length > 0) {
				var validate = f7.input.validateInputs(
					"#" + this.fieldId(this.fieldname)
				);
				if (validate == false) {
					isValid = false;
				}
				if (this.fieldtype === "number") {
					this.value = parseInt(this.value);
				}
			} else {
				isValid = false;
			}
			return isValid;
		},
		submit() {
			if (this.isValid() === true) {
				var item = {
					table: this.table,
					key: "id",
					id: this.id,
					type: "single",
				};
				var obj = store.getters.getData(item);

				new Date();
				var unixtime = Date.now() / 1000;

				obj[this.table + "_" + this.fieldname] = this.value;

				var item = {
					table: this.table,
					json: obj,
				};

				item.json[this.table + "_unixtime"] = unixtime;
				store.dispatch("updateItemApp", item);
				this.changed = false;
				f7.sheet.close("#" + this.sheetId, true);
			}
		},
	},
	beforeMounted() {},
	unmounted() {
		this.eventBus.eventsListeners['edit-' + this.table].splice(1);
	},
	mounted() {
		f7.sheet.create({
			el: this.sheetId,
			closeByBackdropClick: true,
			swipeToClose: true,
			backdrop: true,
		});

		// Event - Edit
		var vue = this;
		this.eventBus.on("edit-" + this.table, (json) => {
			vue.id = json.id;
			vue.fieldname = json.fieldname;
			vue.value = json.value;
			vue.title = json.title;
			vue.fieldtype = json.fieldtype;

			$$(".item-input-error-message").html("");
			f7.sheet.open("#" + vue.sheetId, true);
		});
		
	},
};
</script>

<style scoped>
@media (min-width: 1024px) {
	.sheet-modal {
		margin-left: 25%;
		width: 50% !important;
	}
}
</style>
