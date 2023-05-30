<template>
	<f7-nav-left>
		<f7-link class="color-primary" icon="chevron_left" v-on:click="_navBackLink()"
			><font-awesome-icon
				style="font-size: 20px; padding-top: 3px; padding-right: 3px"
				:icon="['far', 'chevron-left']"
			/>Back</f7-link
		>
	</f7-nav-left>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import navBackLink from "../../../mixins/ui";

export default {
	name: "nav-back-link",
	data() {
		return {
			eventid: parseInt(localStorage.admin_eventid),
		};
	},
	props: {
		f7router: Object,
		page: String,
		id: Number,
	},
	components: {},
	mixins: [navBackLink],
	computed: {},
	methods: {
		_navBackLink() {
			if (this.page && this.id) {
				var url = "/";
				var force = false;
				this.navBackLink(url, force, this.f7router);
			} else {
				var view = f7.views.current;
				var len = view.history.length;
				var url = view.history[len];
				var force = true;
				this.navBackLink(url, force, this.f7router);
			}
		},
	},
	mounted() {},
};
</script>
