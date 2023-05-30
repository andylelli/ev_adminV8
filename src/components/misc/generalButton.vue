<template>
	<div class="display-flex justify-content-center">
		<div :style="setWidth()">
			<f7-button
				large
				round
				button
				:class="setClass()"
				:color="this.colour"
				:fill="this.type"
				type="submit"
				@click="$emit('generalButtonAction')"
			>
				{{ this.label }}
			</f7-button>
		</div>
	</div>
</template>

<script>
export default {
	name: "general-button",
	data() {
		return {};
	},
	props: ["width", "colour", "action", "type", "label"],
	mixins: [],
	computed: {},
	methods: {
		setColour() {
			if(this.colour) {
				return this.colour;
			}
		},		
		setClass() {
			if(!this.colour) {
				var style = "custom-background-colour";
				return style;
			}
		},
		setWidth() {
			var style = "width: " + this.width + "px";
			return style;
		},
		setFill() {
			if (this.type == "fill") {
				return true;
			}
		},
	},
	mounted() {},
};
</script>

<style scoped>
:root {
	--f7-list-button-text-align: center;
}

</style>