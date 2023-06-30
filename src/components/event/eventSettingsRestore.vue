<template>
  <div>
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
        <f7-button fill class="color-green" @click="restore()"
          >RESTORE</f7-button
        >
      </f7-list-item>
    </f7-list>
    <f7-block-header>AVAILABLE BACK UPS</f7-block-header>
    <f7-list>
      <f7-list-item
        v-for="(filename, i) in this.getBackupFiles"
        :key="i"
        :title="filename"
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
  </div>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import misc from "../../mixins/misc";
import fetch from "../../mixins/fetch";

export default {
  name: "event-settings-restore",
  data() {
    return {
      userid: store.state.userid,
      eventid: store.state.eventid,
      lookup: store.state.lookup,
    };
  },
  mixins: [misc, fetch],
  components: {},
  computed: {
    getBackupFiles() {
      //Get directory id
      var find = this.lookup.filter(function (result) {
        return result.lookup_id == "backup-files";
      });
      var arr = [];
      if(find.length > 0) {
      arr = find[0].lookup_value.split("|");
      }
        return arr;
    },
  },
  methods: {
    backup() {
      // Parameters
      let url = store.state.url + "api/get/event/insert/backup/" + this.eventid;
      var method = "GET";
      var data = null;

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

      console.log(json.message);
    },
    failure(json) {
      console.log(json.message);
    },
  },
  mounted() {
    var vue = this;
    f7ready((f7) => {
      vue.delimitedString = store.getters.getLookup("schedule-qr-codes");
    });
  },
};
</script>

<!--<style scoped>

</style>-->