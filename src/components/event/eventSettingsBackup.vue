<template>
  <div>
    <f7-block-header>BACKUP</f7-block-header>
    <f7-list>
      <f7-list-item title="Backup event data">
        <template #media>
          <f7-icon>
            <font-awesome-icon
              class="fa-fw custom-colour"
              style="font-size: 20px"
              :icon="['fal', 'cloud-arrow-up']"
            />
          </f7-icon>
        </template>
        <!-- <f7-button fill class="color-green" @click="backup()">BACKUP</f7-button> -->
        <f7-button fill class="color-green" @click="backup()">BACKUP</f7-button>
      </f7-list-item>
    </f7-list>
  </div>
</template>

<script>
import store from "../../vuex/store.js";

import { f7 } from "framework7-vue";

import misc from "../../mixins/misc";
import fetch from "../../mixins/fetch";

export default {
  name: "event-settings-backup",
  data() {
    return {
      userid: store.state.userid,
      eventid: store.state.eventid,
    };
  },
  mixins: [misc, fetch],
  inject: ["eventBus"],
  components: {},
  computed: {
    getBackupFiles() {
      var str = store.getters.getLookup("backup-files");
      if (str.length > 0) {
        const arr = this.backupDateFormat(str);
        return arr;
      } else {
        return [];
      }
    },
  },
  methods: {
    backup() {
      if (this.getBackupFiles.length < 5) {
        this.submit();
      } else {
        this.openSheetBackup();
      }
    },
    submit(file) {
      //Set URL
      var url;
      if (file) {
        url =
          store.state.url +
          "api/get/event/insert/backup/" +
          this.eventid +
          "/" +
          file;
      } else {
        url =
          store.state.url +
          "api/get/event/insert/backup/" +
          this.eventid +
          "/0";
      }

      //Set other parameters;
      let method = "GET";
      let data = null;

      f7.preloader.show();

      // Post data
      this.fetch(url, method, data, this.success, this.failure);
    },
    success(json) {
      new Date();
      var unixtime = Date.now() / 1000;

      var item = {
        json: {
          lookup_id: "backup-files",
          lookup_value: json.backupFiles,
          lookup_eventid: this.eventid,
          lookup_unixtime: unixtime,
        },
      };

      store.dispatch("insertLookupApp", item);
      store.dispatch("insertLookupDB", item);

      f7.preloader.hide();

      f7.dialog.alert("Backup successful", "Backup");

      console.log(json.message);
    },
    failure(json) {
      console.log(json.message);
    },
    openSheetBackup() {
      var existingFiles = {
        files: this.getBackupFiles,
      };
      this.eventBus.emit("open-sheet-backup", existingFiles);
    },
  },
  mounted() {
    // Event - Delete file
    var vue = this;
    this.eventBus.on("delete-file", (file) => {
      vue.submit(file);
      if (vue.eventBus.eventsListeners["delete-file"].length > 1) {
        vue.eventBus.eventsListeners["delete-file"].splice(1);
      }
    });
  },
};
</script>

<!--<style scoped>

</style>-->