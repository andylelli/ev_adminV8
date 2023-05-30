<template>
	<div>
		<f7-block-header><div v-html="this.title()"></div></f7-block-header>
		<f7-block class="no-margin-top no-padding">
			<slot></slot>
		</f7-block>
	</div>
</template>

<script>
export default {
	name: "segment",
	data() {
		return {};
	},
	props: ["header"],
	mixins: [],
	computed: {},
	methods: {
		title() {
			if (this.header) {
				var header = this.header.toUpperCase();
				return header.toUpperCase();
			}
		},
	},
	mounted() {},
};
</script>

<style scoped>
</style>