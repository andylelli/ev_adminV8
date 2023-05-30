<template>
	<f7-nav-right>
		<f7-link v-if="showLeftView == false" panel-open="left"
			><font-awesome-icon
				class="fa-fw custom-colour"
				style="font-size: 20px"
				:icon="['far', 'bars']"
		/></f7-link>
	</f7-nav-right>
</template>

<script>
import { f7, f7ready } from "framework7-vue";

export default {
	name: "nav-bars",
	data() {
		return {
			viewportWidth: 0,
		};
	},
	components: {},
	mixins: [],
	computed: {
		showLeftView() {
			if (this.viewportWidth > 768) {
				return true;
			} else {
				return false;
			}
		},
	},
	methods: {},
	mounted() {
		f7ready((f7) => {
			var vue = this;
			this.viewportWidth = window.innerWidth;

			window.addEventListener(
				"resize",
				function (event) {
					vue.viewportWidth = window.innerWidth;
				},
				true
			);
		});
	},
};
</script>
