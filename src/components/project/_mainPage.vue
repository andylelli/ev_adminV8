<template>
  <f7-page
    stacked
    name="main"
    @page:beforein="beforeIn();"
  >
    <f7-navbar >
      <f7-nav-left></f7-nav-left>
      <f7-nav-title v-show="isEventExists" :title="getEvent.event_name"></f7-nav-title>
      <nav-bars></nav-bars>
    </f7-navbar>
    <div v-show="!isEventExists" style="margin-top: 250px;">
      <p align="center">Please open another event or create a new one</p>
    </div>
    <general v-show="isEventExists"> </general>
    <project-list v-show="isEventExists" title="CONTENT" table="project"></project-list>
    <new-project v-show="isEventExists" ></new-project>
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

export default {
  data() {
    return {
      eventid: parseInt(localStorage.admin_eventid),
      role: store.state.role,
      ptrDistance: 100,
      eventExists: false,
    };
  },
  components: {
    navBars,
    general,
    projectList,
    newProject
  },
  mixins: [login, misc],
  inject: ["eventBus"],
  props: {
    f7route: Object,
  },
  computed: {
    isEventExists() {
      return this.eventExists;
    },
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
      if(data) {
        this.eventExists = true;
        this.initialLoad = true;
        return data;
      }
      else {
        this.eventExists = false;
        return "Loading...";
      }
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
            f7.sheet.open(".sheet-update-available");
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
