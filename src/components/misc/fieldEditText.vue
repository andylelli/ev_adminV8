<template>
	<f7-list list :class="setClass()" :style="setStyle()">
		<f7-list-item
			:title="this.getTitle()"
			:after="this.getValue"
			@click="editValue()"
			style="cursor: pointer"
		>
			<template #media>
				<f7-icon>
					<font-awesome-icon
						class="fa-fw custom-colour"
						style="font-size: 20px"
						:icon="['fal', 'text']"
					/> </f7-icon
			></template>
		</f7-list-item>
	</f7-list>
</template>

<script>
import store from "../../vuex/store.js";

import params from "../../js/config/params.js";

export default {
	name: "field-edit-text",
	data() {
		return {};
	},
	props: ["id", "type", "table", "fieldname", "title"],
	inject: ["eventBus"],
	computed: {
		getItem() {
			var item = {
				table: this.table,
				key: "id",
				id: this.id,
				type: "single",
			};
			var data = store.getters.getData(item);
			if (data) {
				return data;
			}
		},
		getValue() {
			var field = this.table + "_" + this.fieldname;
			if (this.getItem) {
				return this.getItem[field];
			}
		},
	},
	methods: {
		setClass() {
			if (this.type == "first") {
				return "no-margin-top no-margin-bottom list-item-first";
			} else if (this.type == "last") {
				return "no-margin-top no-margin-bottom list-item-last";
			} else if (this.type == "single") {
				return "no-margin-top no-margin-bottom";
			} else return "no-margin-top no-margin-bottom list-item-middle";
		},
		setStyle() {
			if (this.type != "head") {
				return "position: relative; top: 0px; width: 100%; overflow: hidden;";
			}
		},
		getTitle() {
			if (!this.title) {
				var vue = this;
				var findTable = params.filter(function (result) {
					return result.table === vue.table;
				});
				var findField = findTable[0].fields.filter(function (result) {
					return result.name === vue.fieldname;
				});
				var placeholder = findField[0].placeholder;
				return placeholder;
			} else {
				return this.title;
			}
		},
		getFieldtype() {
			if (!this.fieldtype) {
				var vue = this;
				var findTable = params.filter(function (result) {
					return result.table === vue.table;
				});
				var findField = findTable[0].fields.filter(function (result) {
					return result.name === vue.fieldname;
				});
				var fieldtype = findField[0].type;
				return fieldtype;
			} else {
				return this.fieldtype;
			}
		},
		editValue() {
			var json = {
				table: this.table,
				id: this.id,
				fieldname: this.fieldname,
				value: this.getValue,
				title: this.getTitle(),
				fieldtype: this.getFieldtype(),
			};

			this.eventBus.emit("edit-" + this.table, json);
		},
	},
	mounted() {},
};
</script>

<style>
.ios {
	--f7-list-item-after-font-size: 16px;
	--f7-list-item-after-text-color: rgba(33, 33, 33, 1);
}
.md {
	--f7-list-item-after-font-size: 16px;
	--f7-list-item-after-text-color: rgba(33, 33, 33, 1);
}
.list-item-first ul:after {
	margin-left: 55px;
}
.list-item-middle ul:before {
	margin-left: 55px;
	height: 0px;
}
.list-item-middle ul:after {
	margin-left: 55px;
}
.list-item-last ul:before {
	height: 0px;
}
</style>