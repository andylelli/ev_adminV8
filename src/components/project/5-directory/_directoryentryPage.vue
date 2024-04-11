<template>
  <f7-page stacked name="directoryentry">
    <!-- Nav bar-->
    <f7-navbar>
      <nav-back-link force @click="onClose()"></nav-back-link>
      <f7-nav-title>
        <div v-html="getDirectoryentry.directoryentry_name"></div>
      </f7-nav-title>
      <nav-bars></nav-bars>
    </f7-navbar>
    <!-- Main section-->
    <!---- Name ---->
    <segment header="Name">
      <field-edit-text
        type="single"
        :id="this.getDirectoryentry.directoryentry_id"
        table="directoryentry"
        fieldname="name"
      ></field-edit-text>
    </segment>
    <!---- Image ---->
    <segment v-if="this.getDirectory.directory_imageid === 1" header="Image">
      <image-load
        :id="this.getDirectoryentry.directoryentry_id"
        table="directoryentry"
      ></image-load>
    </segment>
    <!---- Description ---->
    <segment header="Description">
      <field-edit-long-text
        type="first"
        :id="this.getDirectoryentry.directoryentry_id"
        table="directoryentry"
        fieldname="shorttext"
      ></field-edit-long-text>
      <field-edit-long-text
        type="last"
        :id="this.getDirectoryentry.directoryentry_id"
        table="directoryentry"
        fieldname="longtext"
      ></field-edit-long-text>
    </segment>
    <!---- Parent item ---->
    <segment v-if="this.getParentProject" header="Parent">
      <directoryentry-parententry
        :directoryentryid="id"
      ></directoryentry-parententry>
    </segment>
    <!---- Schedule ---->
    <segment v-if="this.isCheckedSchedule() === true" header="Schedule">
      <directoryentry-schedule :directoryentryid="id"></directoryentry-schedule>
    </segment>
    <!---- Location ---->
    <segment v-if="mapCheck() > 0" header="Location">
      <directoryentry-location
        :projectid="getProject.project_id"
        :directoryentryid="id"
      ></directoryentry-location>
    </segment>
    <!-- Delete -->
    <segment v-if="this.desktop == true">
      <general-button
        class="margin-bottom"
        @generalButtonAction="deleteItem()"
        label="DELETE"
        width="200"
        colour="red"
        type="fill"
      ></general-button>
    </segment>
  </f7-page>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";
import { getDevice } from "framework7";

const device = getDevice();

import deleteItem from "../../../mixins/deleteItem";
import misc from "../../../mixins/misc";

import navBackLink from "../../misc/nav/navBackLink.vue";
import navBars from "../../misc/nav/navBars.vue";

import segment from "../../misc/segment.vue";
import imageLoad from "../../misc/imageLoad.vue";
import fieldEditText from "../../misc/fieldEditText.vue";
import fieldEditLongText from "../../misc/fieldEditLongText.vue";
import generalButton from "../../misc/generalButton.vue";
import sheetEdit from "../../sheet/sheetEdit.vue";

import directoryentryParententry from "./directoryentryParententry.vue";
import directoryentrySchedule from "./directoryentrySchedule.vue";
import directoryentryLocation from "./directoryentryLocation.vue";

export default {
  data() {
    return {
      id: parseInt(this.f7route.params.directoryentryId),
      desktop: device.desktop,
      previousPage: "directory",
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
    imageLoad,
    fieldEditText,
    fieldEditLongText,
    generalButton,
    sheetEdit,
    directoryentryParententry,
    directoryentrySchedule,
    directoryentryLocation,
  },
  mixins: [deleteItem, misc],
  computed: {
    getProject() {
      var item = {
        table: "project",
        key: "id",
        id: this.getDirectory.directory_projectid,
        type: "single",
      };
      var data = store.getters.getData(item);
      if (data) {
        return data;
      } else return false;
    },
    getDirectory() {
      var item = {
        table: "directory",
        key: "id",
        id: this.getDirectoryentry.directoryentry_directoryid,
        type: "single",
      };
      var data = store.getters.getData(item);
      if (data) {
        return data;
      } else {
        return false;
      }
    },
    getDirectoryentry() {
      var item = {
        table: "directoryentry",
        key: "id",
        id: this.id,
        type: "single",
      };
      var data = store.getters.getData(item);
      if (data) {
        return data;
      } else {
        return false;
      }
    },
    getParentProject() {
      if (this.getDirectoryentry) {
        var id = this.getDirectoryentry.directoryentry_directoryid;
        var item = {
          table: "directory",
          key: "id",
          id: id,
          type: "single",
        };
        var directory = store.getters.getData(item);

        if (directory) {
          var item = {
            table: "directory",
            key: "id",
            id: directory.directory_parentid,
            type: "single",
          };
          var parentdirectory = store.getters.getData(item);

          if (parentdirectory) {
            var project = store.state.project.filter(function (result) {
              return result.project_id === parentdirectory.directory_projectid;
            });
            if (project.length > 0) {
              return project[0];
            } else {
              return false;
            }
          }
        } else {
          return false;
        }
      }
    },
  },
  methods: {
    onClose() {
      this.eventBus.emit("list-on-close");
    },
    mapCheck() {
      if (this.getDirectory) {
        if (this.getDirectory.directory_mapid > 0) {
          return true;
        } else return false;
      } else {
        return false;
      }
    },
    isCheckedSchedule() {
      if (this.getDirectory) {
        if (this.getDirectory.directory_scheduleid === 1) {
          return true;
        }
      }
    },
    deleteItem() {
      this.deleteItemButton(
        this.getDirectoryentry.directoryentry_id,
        "directoryentry",
        this.getDirectoryentry.directoryentry_name
      );
    },
  },
  mounted() {
    f7ready((f7) => {
      this.$watch(
        "getDirectoryentry",
        function (newValue, oldValue) {
          if (this.getDirectoryentry) {
            new Date();
            var unixtime = Date.now() / 1000;

            var item = {};
            item.table = "directoryentry";
            item.json = this.getDirectoryentry;
            store.dispatch("updateItemDB", item);
            console.log("update directoryentry");
            localStorage.admin_update_directoryentry_time = unixtime;
          }
        },
        { deep: true }
      );
    });
  },
};
</script>

<style scoped></style>
