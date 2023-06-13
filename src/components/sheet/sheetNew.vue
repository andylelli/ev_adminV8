<template>
	<f7-sheet
		class="justify-content-center"
		:id="this.sheetId"
		style="height: auto; --f7-sheet-bg-color: #fff"
		swipe-to-close
		backdrop
		@sheet:closed="clearForm()"
	>
		<f7-page-content>
			<f7-block class="padding-top">
				<f7-block-title class="padding-bottom">
					{{ this.title }}</f7-block-title
				>
				<f7-list form>
					<f7-list-input
						class="new-field"
						v-for="field in this.fields"
						:key="field.name"
						:id="fieldId(field.name)"
						:type="field.type"
						step="0.01"
						:placeholder="field.placeholder"
						@input="update(field.name, $event)"
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
import { utils, Dom7 } from "framework7";
var $$ = Dom7;

import misc from "../../mixins/misc";
import newItem from "../../mixins/newItem";
import login from "../../mixins/login";
import fetch from "../../mixins/fetch";

import generalButton from "../misc/generalButton.vue";

import params from "../../js/config/params.js";

export default {
	name: "sheet-new",
	data() {
		return {
			event: store.state.event,
			displayName: null,
			subtable: null,
			data: {},
			fields: [],
			allowChange: false,
		};
	},
	props: ["page", "table", "projectid"],
	mixins: [misc, newItem, login, fetch],
	components: {
		generalButton,
	},	
	inject: ["eventBus"],
	computed: {
		title() {
			var title = "NEW " + this.displayName;
			return title.toUpperCase();
		},
		sheetId() {
			var str = "new-" + this.table;
			return str;
		},
	},
	methods: {
		update(name, event) {
			this.data[name] = event.target.value;
			this.allowChange = this.isValid();
		},
		fieldId(field) {
			var sheetId = this.sheetId;
			return sheetId + "-" + field;
		},
		clearForm() {
			this.data = {};
			this.fields = [];
			$$(".new-field input").val("");
			$$(".item-input-error-message").html("");
		},
		isValid() {
			var isValid = true;
			var str;
			for (var i = 0; i < this.fields.length; i++) {
				str = this.data[this.fields[i].name];
				if (str.length > 0) {
					var validate = f7.input.validateInputs(
						"#" + this.fieldId(this.fields[i].name)
					);
					if (validate == false) {
						isValid = false;
					}
					if (this.fields[i].type === "number") {
						this.data[this.fields[i].name] = parseInt(
							this.data[this.fields[i].name]
						);
					}
				} else {
					isValid = false;
				}
			}
			return isValid;
		},
		submit() {
			if (this.isValid() === true) {
				var userid = store.state.userid;
				var eventid = store.state.eventid;

				var targetTable = this.table;
				if (this.subtable) {
					targetTable = this.subtable;
				}

				var json = {
					userid: userid,
					eventid: eventid,
					projectid: this.projectid,
					table: targetTable,
				};
				for (var i = 0; i < this.fields.length; i++) {
					json[this.fields[i].name] = this.data[this.fields[i].name];
				}

				this.newItem(json, this.table, true, this.displayName);
				f7.sheet.close("#" + this.sheetId, true);
			}
		},
	},
	beforeMounted() {},
	mounted() {
		f7ready((f7) => {
			f7.sheet.create({
				el: this.sheetId,
				closeByBackdropClick: true,
				swipeToClose: true,
				backdrop: true,
			});

			this.eventBus.on("new-" + this.table, (json) => {
				var vue = this;

				this.data = {};
				this.fields = [];

				// GET FIELD PARAMETERS
				var findTable = params.filter(function (result) {
					return result.table === vue.table;
				});
				this.fields = [];
				var sheetFields = findTable[0].fields;
				for (var i = 0; i < sheetFields.length; i++) {
					if (!sheetFields[i].optional) {
						this.fields.push(sheetFields[i]);
						this.data[this.fields[i].name] = "";
					}
				}

				//GET DISPLAY NAME
				if (json.subtable) {
					this.subtable = json.subtable;
					var findSubtable = params.filter(function (result) {
						return result.table === json.subtable;
					});
					this.displayName = findSubtable[0].displayName;
				} else if (this.projectid) {
					var item = {
						table: "project",
						key: "id",
						id: this.projectid,
						type: "single",
					};
					//console.log(store.getters.getData(item));
					this.displayName =
						store.getters.getData(item).project_name + " item";
				} else {
					this.displayName = findTable[0].displayName;
				}

				$$(".new-field input").val("");
				$$(".item-input-error-message").html("");
				f7.sheet.open("#" + this.sheetId, true);
			});
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
