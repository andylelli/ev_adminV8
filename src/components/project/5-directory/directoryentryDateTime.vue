<template>
  <div v-if="this.getDirectoryentryDateTime()">
    <!-- <f7-block-title>Date / Time</f7-block-title>-->
    <f7-block strong inset class="custom-background-tint text-color-white">
      <p v-html="this.getDirectoryentryDateTime()"></p>
    </f7-block>
  </div>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

export default {
  name: "directoryentry-date-time",
  data() {
    return {
      directory: store.state.directory,
      directoryentry: store.state.directoryentry,

    };
  },
  props: {
    id: Number
  },
  computed: {
  },
  methods: {
    getDirectoryentryDateTime() {
      var directoryentryid = this.id;

      var directoryentry = this.directoryentry.filter(function (result) {
        return result.directoryentry_id === directoryentryid;
      });

      if (directoryentry.length > 0) {

        var directoryid = directoryentry[0].directoryentry_directoryid;

        //Get directory id
        var find = this.directory.filter(function (result) {
          return result.directory_id === directoryid;
        });

        if (find[0].directory_scheduleid == "1") {
          var day = directoryentry[0].directoryentry_day;
          var hour = directoryentry[0].directoryentry_hour;
          var minute = directoryentry[0].directoryentry_minute;

          if (hour.length == 1) {
            hour = "0" + hour;
          }
          if (minute.length == 1) {
            minute = "0" + minute;
          }

          const dofw = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
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

          var hyphen = "-";
          var position = 4;
          var day = [day.slice(0, position), hyphen, day.slice(position)].join(
            ""
          );
          var position = 7;
          var day = [day.slice(0, position), hyphen, day.slice(position)].join(
            ""
          );

          var date_obj = new Date(day);
          var date = date_obj.getDate();
          var month = date_obj.getMonth();
          var dateTH = this.getOrdinalNum(date);
          var d = dofw[date_obj.getDay()];
          var m = months[month];

          var schedule = d + " " + dateTH + " " + m + " @ " + hour + ":" + minute;
          if (d) {
            return 'When:&nbsp;&nbsp;' + schedule;
          }
        } else {
          return false;
        }
      }
    },
    getOrdinalNum(n) {
      return (
        n +
        (n > 0
          ? ["th", "st", "nd", "rd"][
          (n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10
          ]
          : "")
      );
    },
  },
  mounted() {
    f7ready((f7) => {

    });
  },
};
</script>

<style scoped></style>