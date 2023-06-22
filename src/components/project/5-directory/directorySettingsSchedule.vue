<template>
  <div>
    <f7-list list class="no-margin-bottom no-margin-top no-hairline">
      <f7-list-item title="Set schedule?" class="no-hairline">
        <template #media>
          <f7-icon>
            <font-awesome-icon
              class="fa-fw custom-colour"
              style="font-size: 20px"
              :icon="['fal', 'clock']"
            />
          </f7-icon>
        </template>
        <f7-toggle
          :checked="this.isCheckedSchedule()"
          color="custom-color"
          @toggle:change="toggleSchedule($event)"
        ></f7-toggle>
      </f7-list-item>
    </f7-list>
    <div
      :style="
        'margin-bottom: 60px;' +
        'position: relative; top: -1px;' +
        scheduleMaxHeight(getProject.project_id)
      "
    >
      <f7-list
        inline-labels
        :id="'schedule-' + this.projectid"
        class="no-margin-top no-margin-bottom"
      >
        <f7-list-item title="Hide names?" class="no-hairline">
          <template #media>
            <f7-icon>
              <font-awesome-icon
                class="fa-fw custom-colour"
                style="font-size: 20px"
                :icon="['fal', 'eye-slash']"
              /> </f7-icon
          ></template>
          <f7-toggle
            :checked="this.isCheckedHidenames()"
            color="custom-color"
            @toggle:change="toggleHidenames($event)"
          ></f7-toggle>
        </f7-list-item>
      </f7-list>
      <f7-list class="no-margin-top">
        <f7-list-item
          radio
          radio-icon="end"
          title="Hide all names"
          name="hide"
          value="0"
          :checked="this.isCheckedHideType(0)"
          @change="radioHideType($event.target.value)"
        >
          <template #media>
            <f7-icon>
              <font-awesome-icon
                class="fa-fw custom-colour"
                style="font-size: 20px"
                :icon="['fal', 'users']" /></f7-icon></template
        ></f7-list-item>
        <f7-list-item
          radio
          radio-icon="end"
          title="Hide selection only"
          name="hide"
          value="1"
          :checked="this.isCheckedHideType(1)"
          @change="radioHideType($event.target.value)"
        >
          <template #media>
            <f7-icon>
              <font-awesome-icon
                class="fa-fw custom-colour"
                style="font-size: 20px"
                :icon="['fal', 'user-friends']" /></f7-icon></template
        ></f7-list-item>
      </f7-list>
    </div>
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";

import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";
import { Dom7 } from "framework7";
var $$ = Dom7;

import misc from "../../../mixins/misc";

export default {
  name: "directoryentry-settings-schedule",
  data() {
    return {
      event: store.state.event[0],
    };
  },
  props: {
    projectid: Number,
  },
  mixins: [misc],
  inject: ["eventBus"],
  components: {
    QrcodeVue,
  },
  computed: {
    getProject() {
      var item = {
        table: "project",
        key: "id",
        id: this.projectid,
        type: "single",
      };
      return store.getters.getData(item);
    },
    getDirectory() {
      var item = {
        table: "directory",
        key: "projectid",
        id: this.projectid,
        type: "single",
      };
      return store.getters.getData(item);
    },
  },
  methods: {
    isCheckedSchedule() {
      if (this.getDirectory.directory_scheduleid === 1) {
        return true;
      } else {
        return false;
      }
    },
    isCheckedHidenames() {
      if (this.getDirectory.directory_hidenames === 1) {
        return true;
      } else {
        return false;
      }
    },
    isCheckedHideType(value) {
      if (this.getDirectory.directory_hidetype == value) {
        return true;
      } else {
        return false;
      }
    },
    toggleSchedule(event) {
      new Date();
      var unixtime = Date.now() / 1000;

      var value;
      if (event === true) {
        value = 1;
      } else {
        value = 0;
      }
      var item = {};
      item.table = "directory";
      item.json = this.getDirectory;
      item.json.directory_scheduleid = value;
      item.json.directory_unixtime = unixtime;
      store.dispatch("updateItemApp", item);
    },
    toggleHidenames(event) {
      new Date();
      var unixtime = Date.now() / 1000;

      var value;
      if (event === true) {
        value = 1;
      } else {
        var id = this.getDirectory.directory_id;
        store.dispatch("unhideNamesApp", id);
        store.dispatch("unhideNamesDB", id);
        this.eventBus.emit("set-eye-slash");

        value = 0;
      }
      var item = {};
      item.table = "directory";
      item.json = this.getDirectory;
      item.json.directory_hidenames = value;
      item.json.directory_unixtime = unixtime;
      store.dispatch("updateItemApp", item);
    },
    radioHideType(value) {
      new Date();
      var unixtime = Date.now() / 1000;

      var item = {};
      item.table = "directory";
      item.json = this.getDirectory;
      item.json.directory_hidetype = parseInt(value);
      item.json.directory_unixtime = unixtime;
      store.dispatch("updateItemApp", item);
    },
    scheduleMaxHeight() {
      var scheduleid = this.getDirectory.directory_scheduleid;
      var hidenames = this.getDirectory.directory_hidenames;
      var height;
      if (scheduleid == 0 && hidenames == 0) {
        height = 0;
      } else if (scheduleid == 1 && hidenames == 0) {
        height = "48px";
      } else if (scheduleid == 1 && hidenames == 1) {
        height = "200px";
      } else {
        height = 0;
      }
      var z =
        "max-height:" +
        height +
        "; overflow: hidden; transition: max-height 0.4s ease-out";
      return z;
    },
  },
  mounted() {},
};
</script>

<style scoped>
</style>