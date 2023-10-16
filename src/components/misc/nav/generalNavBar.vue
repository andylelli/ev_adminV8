<template>
  <f7-navbar style="position: sticky; top: -0.5px">
    <f7-nav-left>
      <nav-back-link
        v-if="noBackLink != true"
        :page="page"
        :id="id"
        @click="backActions()"
      ></nav-back-link>
    </f7-nav-left>
    <f7-nav-title :title="header"></f7-nav-title>
    <nav-bars></nav-bars>
  </f7-navbar>
</template>

<script>
import navBackLink from "./navBackLink.vue";
import navBars from "./navBars.vue";

export default {
	name: "general-nav-bar",
	data() {
		return {};
	},
	props: {
		header: String,
		page: String,
		id: Number,
		noBackLink: Boolean,
		force: Boolean,
	},
	components: {
		navBackLink,
		navBars,
	},
  	inject: ["eventBus"],
	mixins: [],
	computed: {},
	methods: {
	},
	mounted() {},
};
</script>
