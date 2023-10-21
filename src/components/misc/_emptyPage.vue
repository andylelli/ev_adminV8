<template>
  <f7-page stacked id="empty" name="empty">
    <!-- Nav bar-->
    <f7-navbar>
      <f7-nav-title>
        <div></div
      ></f7-nav-title>
      <nav-bars></nav-bars>
    </f7-navbar>
    <div style="margin-top: 250px;">
      <p align="center">Please open another event or create a new one</p>
    </div>
  </f7-page>
</template>

<script>
import { f7, f7ready } from "framework7-vue";

import navBars from "./nav/navBars.vue";

export default {
  data() {
    return {};
  },
  components: {
    navBars,
  },
  computed: {},
  methods: {},
  mounted() {},
};
</script>

<style scoped>
</style>
