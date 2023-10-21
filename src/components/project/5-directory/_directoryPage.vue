<template>
  <f7-page stacked name="directory" @page:beforein="closeSortable()">
    <!-- Nav bar-->
    <f7-navbar>
      <nav-back-link page="directory"></nav-back-link>
      <f7-nav-title v-if="getProject">
        <div v-html="getProject.project_name"></div
      ></f7-nav-title>
      <nav-bars></nav-bars>
    </f7-navbar>
    <!-- General section-->
    <segment header="General">
      <general-settings
        page="directory"
        :projectid="projectid"
      ></general-settings>
    </segment>
    <!-- Main section-->
    <!---- List ---->
    <directoryentry-list
      v-if="getProject && getDirectory"
      :title="getProject.project_name"
      table="directoryentry"
      :icon="['fal', 'file-alt']"
      :id="getDirectory.directory_id"
      :projectid="getProject.project_id"
      sortable="true"
      :sort-alpha="this.isSortAlpha()"
    ></directoryentry-list>
    <!---- New item ---->
    <new-item
      table="directoryentry"
      :name="getProject.project_name"
      sort-alpha="true"
    ></new-item>
    <!-- Sheet Modals-->
    <sheet-new
      table="directoryentry"
      :projectid="projectid"
      refresh="true"
    ></sheet-new>
  </f7-page>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { Dom7 } from "framework7";
var $$ = Dom7;

import misc from "../../../mixins/misc";

import navBackLink from "../../misc/nav/navBackLink.vue";
import navBars from "../../misc/nav/navBars.vue";

import segment from "../../misc/segment.vue";
import generalSettings from "../../misc/generalSettings.vue";
import directoryentryList from "./directoryentryList.vue";
import newItem from "../../misc/newItem.vue";

import sheetNew from "../../sheet/sheetNew.vue";

export default {
  data() {
    return {
      eventid: store.state.eventid,
      projectid: parseInt(this.f7route.params.projectId),
      lookup: store.state.lookup,
      reloadPage: false,
    };
  },
  props: {
    f7route: Object,
    f7router: Object,
  },
  components: {
    navBackLink,
    navBars,
    segment,
    generalSettings,
    directoryentryList,
    newItem,
    sheetNew,
  },
  mixins: [misc],
  inject: ["eventBus"],
  computed: {
    isReloadPage() {
      return this.reloadPage;
    },
    getProject() {
      var item = {
        table: "project",
        key: "id",
        id: this.projectid,
        type: "single",
      };
      var data = store.getters.getData(item);
      if (data) {
        return data;
      }
    },
    getDirectory() {
      var item = {
        table: "directory",
        key: "projectid",
        id: this.projectid,
        type: "single",
      };
      var data = store.getters.getData(item);
      if (data) {
        return data;
      }
    },
  },
  methods: {
    isSortAlpha() {
      if (this.getDirectory.directory_sortalpha == 1) {
        return "true";
      } else {
        return "false";
      }
    },
    reloadPage() {
      f7.views.current.router.refreshPage();
    },
    closeSortable() {
      this.eventBus.emit("close-sortable");
    },
  },
  mounted() {
    f7ready((f7) => {
      this.$watch(
        "getProject",
        function (newValue, oldValue) {
          if (this.getProject) {
            new Date();
            var unixtime = Date.now() / 1000;

            var item = {};
            item.table = "project";
            item.json = this.getProject;

            store.dispatch("updateItemDB", item);

            localStorage.admin_update_project_time = unixtime;
          }
        },
        { deep: true }
      );
      this.$watch(
        "getDirectory",
        function (newValue, oldValue) {
          if (this.getDirectory) {
            new Date();
            var unixtime = Date.now() / 1000;

            var item = {};
            item.table = "directory";
            item.json = this.getDirectory;

            store.dispatch("updateItemDB", item);

            localStorage.admin_update_directory_time = Date.now() / 1000;
          }
        },
        { deep: true }
      );
    });
  },
};
</script>
