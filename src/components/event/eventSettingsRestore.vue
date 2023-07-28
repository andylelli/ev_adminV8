<template>
  <div>
    <div v-if="getBackupFiles.length > 0">
      <f7-block-header>RESTORE</f7-block-header>
      <f7-list>
        <f7-list-item title="Restore event data">
          <template #media>
            <f7-icon>
              <font-awesome-icon
                class="fa-fw custom-colour"
                style="font-size: 20px"
                :icon="['fal', 'cloud-arrow-down']"
              />
            </f7-icon>
          </template>
          <f7-button
            :class="buttonIsActive()"
            @click="restore()"
            >RESTORE</f7-button
          >
        </f7-list-item>
      </f7-list>
    </div>
    <div>
      <f7-block-header>AVAILABLE BACK UPS</f7-block-header>
      <f7-list v-if="getBackupFiles.length > 0">
        <f7-list-item
          v-for="(file, i) in getBackupFiles"
          :key="i"
          :title="file.name"
        >
          <template #media>
            <f7-icon>
              <font-awesome-icon
                class="fa-fw custom-colour"
                style="font-size: 20px"
                :icon="['fal', 'database']"
              />
            </f7-icon>
          </template>
        </f7-list-item>
      </f7-list>
      <f7-block v-else>
        <p>You have not backed up this event yet</p>
      </f7-block>
    </div>
  </div>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import misc from "../../mixins/misc";
import fetch from "../../mixins/fetch";
import login from "../../mixins/login";

export default {
  name: "event-settings-restore",
  data() {
    return {
      userid: store.state.userid,
      eventid: store.state.eventid,
      lookup: store.state.lookup,
      backupFiles: "",
    };
  },
  mixins: [misc, fetch, login],
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
    restore() {
      if (this.getBackupFiles.length > 0) {
        var existingFiles = {
          files: this.getBackupFiles,
        };
        this.eventBus.emit("open-sheet-restore");
      }
    },
    async submit(file) {
      this.backupFiles = store.getters.getLookup("backup-files");

      //Set URL
      var url = store.state.url + "api/post/event/restore/backup";
      //Set other parameters;
      let method = "POST";
      let data = { file: file };

      // Post data
      await this.fetch(url, method, data, this.success, this.failure);
    },
    buttonIsActive() {
      if (this.getBackupFiles.length > 0) {
        return "button-fill color-green";
      } else {
        return "color-black";
      }
    },
    async success(json) {
      //f7.preloader.show();

      localStorage.admin_counter = 0;

      var tables = false;
      var fullSync = true;
      var getDeletes = true;

      this.progress(this.eventid);

      await this.syncGetFromWebServer(
        this.eventid,
        tables,
        fullSync,
        getDeletes
      );

      f7.dialog.alert("Restoration of backup has completed successfully");
    },
    failure(json) {
      console.log(json.message);
    },
  },
  beforeDestroy() {
    this.eventBus.$off("restore-file");
  },
  mounted() {
    var vue = this;

    // Event - Restore file
    vue.eventBus.on("restore-file", (file) => {
      vue.submit(file);
    });
    this.eventBus.eventsListeners["restore-file"].splice(1);

    f7ready((f7) => {
      vue.delimitedString = store.getters.getLookup("schedule-qr-codes");
    });
    this.getBackupFiles;
  },
};
</script>

<!--<style scoped>

</style>-->