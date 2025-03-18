<template>
  <f7-page stacked name="directory-settings">
    <!-- Nav bar-->
    <f7-navbar>
      <nav-back-link force @click="onClose()"></nav-back-link>
      <f7-nav-title v-if="getProject">
        <div v-html="this.getProject.project_name + ' - Settings'"></div>
      </f7-nav-title>
      <nav-bars></nav-bars>
    </f7-navbar>
    <!-- Main section-->
    <div v-if="getProject">
      <segment header="Name">
        <field-edit-text type="single" :id="this.getProject.project_id" table="project" fieldname="name" title="Name"
          fieldtype="text"></field-edit-text>
      </segment>
      <!---- Icon ---->
      <segment header="Icon">
        <project-icon :id="this.getProject.project_id"></project-icon>
      </segment>
      <!---- Image ---->
      <segment :header="this.getProject.project_name + ' Image'">
        <image-load :id="this.getProject.project_id" table="project"></image-load>
      </segment>
      <!---- Item Images ---->
      <segment :header="this.setShowImageHeader()">
        <show-image :id="this.projectid" table="directory"></show-image>
      </segment>
      <!---- Sort Alphabetically ---->
      <segment header="Sort Alphabetically">
        <directory-settings-sort-alpha :projectid="projectid"></directory-settings-sort-alpha>
      </segment>
      <!---- Map ---->
      <segment header="Location">
        <directory-settings-location :projectid="projectid"></directory-settings-location>
      </segment>
      <!---- Location ---->
      <segment v-if="isMap" header="Map">
        <directory-settings-map :projectid="projectid"></directory-settings-map>
      </segment>
      <!---- Parent / Child ---->
      <segment v-if="isDirectory" header="Parent">
        <directory-settings-parent :projectid="projectid"></directory-settings-parent>
      </segment>
      <!---- Schedule ---->
      <segment v-if="isSchedule" header="Schedule">
        <directory-settings-schedule :projectid="projectid"></directory-settings-schedule>
      </segment>
      <!---- Location ---->
      <segment header="Bulk Upload">
        <directory-settings-bulk-upload :projectid="getProject.project_id"></directory-settings-bulk-upload>
      </segment>
      <!-- Delete -->
      <segment v-if="this.desktop == true">
        <general-button class="margin-bottom" @generalButtonAction="deleteItem()" label="DELETE" width="200"
          colour="red" type="fill"></general-button>
      </segment>
    </div>
  </f7-page>
</template>

<script>
import store from "../../../vuex/store.js";

import { getDevice } from "framework7";
const device = getDevice();

import deleteItem from "../../../mixins/deleteItem";
import misc from "../../../mixins/misc";
import fetch from "../../../mixins/fetch";

import navBackLink from "../../misc/nav/navBackLink.vue";
import navBars from "../../misc/nav/navBars.vue";

import segment from "../../misc/segment.vue";
import fieldEditText from "../../misc/fieldEditText.vue";
import projectIcon from "../../misc/projectIcon.vue";
import imageLoad from "../../misc/imageLoad.vue";
import showImage from "../../misc/showImage.vue";
import generalButton from "../../misc/generalButton.vue";

import directorySettingsSortAlpha from "./directorySettingsSortAlpha.vue";
import directorySettingsLocation from "./directorySettingsLocation.vue";
import directorySettingsMap from "./directorySettingsMap.vue";
import directorySettingsParent from "./directorySettingsParent.vue";
import directorySettingsSchedule from "./directorySettingsSchedule.vue";
import directorySettingsShop from "./directorySettingsShop.vue";
import directorySettingsBulkUpload from "./directorySettingsBulkUpload.vue";

export default {
  data() {
    return {
      eventid: store.state.event[0].event_id,
      projectid: parseInt(this.f7route.params.projectId),
      desktop: device.desktop,
      previousPage: "main",
    };
  },
  props: {
    f7route: Object,
  },
  inject: ["eventBus"],
  components: {
    navBackLink,
    navBars,
    segment,
    fieldEditText,
    projectIcon,
    imageLoad,
    showImage,
    generalButton,
    directorySettingsSortAlpha,
    directorySettingsLocation,
    directorySettingsMap,
    directorySettingsParent,
    directorySettingsSchedule,
    directorySettingsBulkUpload,
    directorySettingsShop,
  },
  mixins: [deleteItem, misc, fetch],
  computed: {
    getProjects() {
      var item = {
        table: "project",
        key: "eventid",
        id: this.eventid,
        type: "multiple",
      };
      var data = store.getters.getData(item);
      if (data) {
        return data;
      }
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
    isMap() {
      var map = 4;
      var find = this.getProjects.filter(function (result) {
        return result.project_typeid === map;
      });
      if (find.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    isDirectory() {
      var directory = 5;
      var find = this.getProjects.filter(function (result) {
        return result.project_typeid === directory;
      });
      if (find.length > 1) {
        return true;
      } else {
        return false;
      }
    },
    isSchedule() {
      var schedule = 9;
      var find = this.getProjects.filter(function (result) {
        return result.project_typeid === schedule;
      });
      if (find.length > 0) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    onClose() {
      this.eventBus.emit("list-on-close");
    },
    setShowImageHeader() {
      var header =
        "Show " + this.getProject.project_name.toUpperCase() + " Item Images?";
      return header;
    },
    deleteItem() {
      this.deleteItemButton(
        this.getProject.project_id,
        "project",
        this.getProject.project_name
      );
    },
  },
  mounted() { },
};
</script>

<style scoped></style>
