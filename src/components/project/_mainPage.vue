<template>
  <f7-page
    stacked
    name="main"
    @page:beforein="beforeIn();"
  >
    <f7-navbar v-if="getEvent">
      <f7-nav-left></f7-nav-left>
      <f7-nav-title :title="getEvent.event_name"></f7-nav-title>
      <nav-bars></nav-bars>
    </f7-navbar>
    <general></general>
    <project-list title="CONTENT" table="project"></project-list>
    <new-project></new-project>
    <sheet-new table="project"></sheet-new>
  </f7-page>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";
import { Dom7 } from "framework7";
var $$ = Dom7;

import login from "../../mixins/login";
import misc from "../../mixins/misc";

import projectList from "./projectList.vue";
import newProject from "./newProject.vue";

import navBars from "../misc/nav/navBars.vue";

import general from "../misc/general.vue";

import sheetNew from "../../components/sheet/sheetNew.vue";

export default {
  data() {
    return {
      eventid: parseInt(localStorage.admin_eventid),
      role: store.state.role,
      ptrDistance: 100,
    };
  },
  components: {
    navBars,
    general,
    projectList,
    newProject,
    sheetNew,
  },
  mixins: [login, misc],
  inject: ["eventBus"],
  props: {
    f7route: Object,
  },
  computed: {
    initiated() {
      return store.state.initiated;
    },
    getEvent() {
      var item = {
        table: "event",
        key: "id",
        id: store.state.eventid,
        type: "single",
      };
      var data = store.getters.getData(item);
      return data;
    },
    getEventName() {
      if (this.getEvent) {
        return this.getEvent.event_name;
      }
    },
  },
  methods: {
    eventName() {
      return this.event.event_name;
    },
    beforeIn() {
      this.eventBus.emit("close-sortable");
      store.dispatch("setDevice");
    },
  },
  created() {},
  mounted() {
    f7ready((f7) => {
      var vue = this;
      window["isUpdateAvailable"].then((isAvailable) => {
        if (isAvailable) {
          console.log("new app version is available");
          var autoUpdate = store.getters.getLookup("auto-update");
          if (autoUpdate === true) {
            vue.deleteCache(vue.eventid);
          } else {
            f7.sheet.open(".c3-update-available");
          }
        }
      });
      if (localStorage.app_update_in_progress === "true") {
        f7.dialog.alert("A new version of this app has just been installed!");
        localStorage.removeItem("app_update_in_progress");
      }
      console.log("Main page loaded successfully");
    });
  },
};
</script>

<style scoped>
</style>
