<template>
  <f7-page stacked name="poll" @page:beforein="closeSortable()">
    <!-- Nav bar-->
    <f7-navbar>
      <nav-back-link></nav-back-link>
      <f7-nav-title v-if="getProject">
        <div v-html="getProject.project_name"></div>
      </f7-nav-title>
      <nav-bars></nav-bars>
    </f7-navbar>
    <!-- General section-->
    <segment header="General">
      <general-settings page="poll" :projectid="projectid"></general-settings>
    </segment>
    <!-- Main section-->
    <list
      v-if="getProject && getPoll"
      :title="getProject.project_name"
      table="pollitem"
      :icon="['fal', 'poll']"
      :id="getPoll.poll_id"
      sortable="true"
    ></list>
    <new-item table="pollitem" :project-id="getProject.project_id" :project-name="getProject.project_name"></new-item>
    <poll-actions
      :projectid="projectid"
      :project-name="getProject.project_name"
    ></poll-actions>

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
import generalButton from "../../misc/generalButton.vue";
import list from "../../misc/list.vue";
import newItem from "../../misc/newItem.vue";

import sheetNew from "../../sheet/sheetNew.vue";

import pollActions from "./pollActions.vue";

export default {
  data() {
    return {
      eventid: store.state.eventid,
      projectid: parseInt(this.f7route.params.projectId),
    };
  },
  props: {
    f7route: Object,
    projectName: String,
  },
  components: {
    navBackLink,
    navBars,
    segment,
    generalSettings,
    list,
    pollActions,
    newItem,
    generalButton,
    sheetNew,
  },
  mixins: [misc],
  inject: ["eventBus"],
  computed: {
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
      } else return false;
    },
    getPoll() {
      var item = {
        table: "poll",
        key: "projectid",
        id: this.projectid,
        type: "single",
      };
      var data = store.getters.getData(item);
      if (data) {
        return data;
      } else return false;
    },
  },
  methods: {
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
        "getPoll",
        function (newValue, oldValue) {
          if (this.getPoll) {
            new Date();
            var unixtime = Date.now() / 1000;

            var item = {};
            item.table = "poll";
            item.json = this.getPoll;

            store.dispatch("updateItemDB", item);

            localStorage.admin_update_poll_time = unixtime;
          }
        },
        { deep: true }
      );
    });
  },
};
</script>