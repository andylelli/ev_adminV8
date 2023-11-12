<template>
  <div>
    <f7-block-header>START / END DATE</f7-block-header>
    <f7-list>
      <f7-list-item title="Dates">
        <template #media>
          <f7-icon>
            <font-awesome-icon
              class="fa-fw custom-colour"
              style="font-size: 20px"
              :icon="['fal', 'calendar']"
            />
          </f7-icon>
        </template>
        <div align="right">
          <input
            style="text-align: right; height: 18px; cursor: pointer"
            type="text"
            placeholder="Select..."
            readonly="readonly"
            id="range-date"
          />
        </div>
      </f7-list-item>
    </f7-list>
    <f7-block-header>APP EXPIRY DATE</f7-block-header>
    <f7-list>
      <f7-list-item title="Expiry date">
        <template #media>
          <f7-icon>
            <font-awesome-icon
              class="fa-fw custom-colour"
              style="font-size: 20px"
              :icon="['fal', 'calendar']"
            />
          </f7-icon>
        </template>
        <div align="right">
          <input
            style="text-align: right; height: 18px; cursor: pointer"
            type="text"
            placeholder="Select..."
            readonly="readonly"
            id="expiry-date"
          />
        </div>
      </f7-list-item>
    </f7-list>
  </div>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

export default {
  name: "event-settings-date-time",
  data() {
    return {
      calendarRange: null,
      calendarExpiry: null,
    };
  },
  inject: ["eventBus"],
  computed: {
    getEvent() {
      var item = {
        table: "event",
        key: "id",
        id: store.state.eventid,
        type: "single",
      };
      return store.getters.getData(item);
    },
  },
  methods: {
    setCalendarRange() {
      // Get existing start date
      const start = this.getEvent.event_startdate;
      const startYear = start.substring(0, 4);
      const startMonth = start.substring(4, 6);
      const startDay = start.substring(6, 8);

      // Get existing end date
      var end = this.getEvent.event_enddate;
      const endYear = end.substring(0, 4);
      const endMonth = end.substring(4, 6);
      const endDay = end.substring(6, 8);

      if (startYear < 1900 && endYear < 1900) {
        //Do nothing
      } else {
        var startDate = new Date(startYear, startMonth - 1, startDay);
        var endDate = new Date(endYear, endMonth - 1, endDay);
        //Set calendar
        this.calendarRange.setValue([startDate, endDate]);
      }
    },
    setExpiryDate() {
      // Get existing expiry date
      const expiry = this.getEvent.event_expirydate;
      var expiryYear = parseInt(expiry.substring(0, 4));
      const expiryMonth = expiry.substring(4, 6);
      const expiryDay = expiry.substring(6, 8);

      if (expiryYear == 2099) {
        const y = new Date();
        expiryYear = y.getFullYear() + 1;
      }

      const expiryDate = new Date(
        expiryYear.toString(),
        expiryMonth - 1,
        expiryDay
      );

      // Set calendar
      this.calendarExpiry.setValue([expiryDate]);
    },
    changeEventName() {
      var json = {
        table: "event",
        id: this.getEvent.event_id,
        data: {
          name: this.getEvent.event_name,
        },
      };
      this.eventBus.emit("edit-event", json);
    },
  },
  mounted() {
    f7ready((f7) => {
      var vue = this;

      ////////////////////////////
      // UI - Calendar
      // Event start / end date
      //////////////////////////

      this.calendarRange = f7.calendar.create({
        inputEl: "#range-date",
        rangePicker: true,
        on: {
          change: function (calendar, values, displayValues) {

            var new_to= new Date(values[0]);
            var new_from = new Date(values[1]);

            var from_year = new_from.getFullYear().toString();
            var to_year = new_to.getFullYear().toString();

            if (from_year > 1900 && to_year > 1900) {
              var from_conv = new Date(new_to);
              var to_conv = new Date(new_from);

              from_year = from_conv.getFullYear().toString();
              var from_month = (from_conv.getMonth() + 1).toString();
              var from_day = from_conv.getDate().toString();
              if (from_month.length < 2) from_month = "0" + from_month;
              if (from_day.length < 2) from_day = "0" + from_day;

              to_year = to_conv.getFullYear().toString();
              var to_month = (to_conv.getMonth() + 1).toString();
              var to_day = to_conv.getDate().toString();
              if (to_month.length < 2) to_month = "0" + to_month;
              if (to_day.length < 2) to_day = "0" + to_day;

              var from = from_year + from_month + from_day;
              var to = to_year + to_month + to_day;

              new Date();
              var unixtime = Date.now() / 1000;
              var item = {};
              item.table = "event";
              item.json = vue.getEvent;
              item.json.event_startdate = from;
              item.json.event_enddate = to;
              item.json.event_unixtime = unixtime;
              store.dispatch("updateItemApp", item);
            }
          },
        },
      });
      this.setCalendarRange();

      this.calendarExpiry = f7.calendar.create({
        inputEl: "#expiry-date",
        rangePicker: false,
        on: {
          change: function (calendar, values, displayValues) {
            var expiry = calendar.value[0];

            var expiry_conv = new Date(expiry);

            var expiry_year = expiry_conv.getFullYear().toString();
            var expiry_month = (expiry_conv.getMonth() + 1).toString();
            var expiry_day = expiry_conv.getDate().toString();
            if (expiry_month.length < 2) expiry_month = "0" + expiry_month;
            if (expiry_day.length < 2) expiry_day = "0" + expiry_day;

            expiry = expiry_year + expiry_month + expiry_day;

            new Date();
            var unixtime = Date.now() / 1000;
            var item = {};
            item.table = "event";
            item.json = vue.getEvent;
            item.json.event_expirydate = expiry;
            item.json.event_unixtime = unixtime;
            store.dispatch("updateItemApp", item);
          },
        },
      });
      this.setExpiryDate();
    });
  },
};
</script>

<!-- <style scoped>

</style>-->