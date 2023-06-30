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
        var files = str.split("|");
        var backups = [];

        for (let i = 0; i < files.length; i++) {
          var json = {
            id: files[i],
          };

          const file = files[i].split("_");
          const year = file[0].substring(0, 4);
          const MM = file[0].substring(4, 6);
          const DD = file[0].substring(6, 8);

          const dateObj = new Date(year + "-" + MM + "-" + DD);

          const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];

          const nth = function (d) {
            if (d > 3 && d < 21) return "th";
            switch (d % 10) {
              case 1:
                return "st";
              case 2:
                return "nd";
              case 3:
                return "rd";
              default:
                return "th";
            }
          };

          const monthIndex = dateObj.getMonth();
          const month = months[monthIndex];

          const day = dateObj.getDate();

          const strDate = day + nth(day) + " " + month + " " + year;

          const hh = file[1].substring(0, 2);
          const mm = file[1].substring(2, 4);
          const ss = file[1].substring(4, 6);

          const strTime = hh + ":" + mm + ":" + ss;

          const name = strDate + " " + strTime;

          json.name = name;

          backups.push(json);
        }
        return backups;
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
    openSheetBackup() {
      var existingFiles = {
        files: this.getBackupFiles,
      };
      this.eventBus.emit("open-sheet-backup", existingFiles);
    },
  },
  mounted() {
    var vue = this;
    this.eventBus.on("submit-backup", (file) => {
      vue.submit(file);
    });
  },
};
</script>

<!--<style scoped>

</style>-->