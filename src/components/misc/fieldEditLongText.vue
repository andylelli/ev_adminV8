<template>
	<f7-list list :class="setClass()" :style="setStyle()">
		<f7-list-item
			:title="this.placeholder()"
			:link="
				'/edit-long-text/' +
				this.table +
				'/' +
				this.fieldname +
				'/' +
				this.id +
				'/'
			"
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
import params from "../../js/config/params.js";

export default {
	name: "field-edit-long-text",
	data() {
		return {};
	},
	props: ["id", "type", "table", "fieldname"],
	computed: {},
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
		header() {
			return this.placeholder().toUpperCase();
		},
		placeholder() {
			var vue = this;
			var findTable = params.filter(function (result) {
				return result.table === vue.table;
			});
			var findField = findTable[0].fields.filter(function (result) {
				return result.name === vue.fieldname;
			});
			var placeholder = findField[0].placeholder;
			return placeholder;
		},
	},
	mounted() {},
};
</script>

<style>
.list-item-first ul:after {
	margin-left: 55px;
}
.list-item-middle ul:before {
	height: 0px;
}
.list-item-middle ul:after {
	margin-left: 55px;
}
.list-item-last ul:before {
	height: 0px;
}
</style>