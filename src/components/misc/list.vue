<template>
  <div>
    <!-- TITLE -->
    <div class="display-flex justify-content-space-between">
      <f7-block-header style="text-transform: uppercase"
        ><div v-html="title"></div
      ></f7-block-header>
      <f7-block-header>
        <f7-link v-if="isSortable === true" :sortable-toggle="'.sort-' + table">
          <font-awesome-icon
            class="fa-fw custom-colour"
            style="font-size: 20px"
            :icon="['fal', 'sort']"
          />
        </f7-link>
      </f7-block-header>
    </div>

    <!-- LIST -->
    <f7-list
      :class="
        'search-list searchbar-found ripple-color-primary no-margin-top no-padding-top sort-' +
        table + '-' + id
      "
      id="list"
      :sortable="isSortable"
      @sortable:sort="onSort()"
    >
      <f7-list-item
        v-for="item in items"
        :key="item.id"
        swipeout
        :id="'sort-' + table + '-' + item.id"
        :link="link(table, item.id)"
        :position="item.position"
        :after="setAfter(item.text)"
        :badge="setBadge(item)"
        badge-color="red"
        :title="item.title"
        :header="item.header"
        :footer="item.footer"
        @swipeout="closeSortable()"
      >
        <template #media>
          <f7-icon>
            <font-awesome-icon
              class="fa-fw custom-colour"
              style="font-size: 20px"
              :icon="icon"
            />
          </f7-icon>
        </template>
        <swipeout-actions :id="item.id" :name="item.name" :table="table"></swipeout-actions>
      </f7-list-item>
    </f7-list>
  </div>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { getDevice, Dom7 } from "framework7";
var $$ = Dom7;
const device = getDevice();

import misc from "../../mixins/misc";

import params from "../../js/config/params.js";

import swipeoutActions from "./swipeoutActions.vue";

export default {
  name: "list",
  data() {
    return {
      event: store.state.event[0],
      key: null,
    };
  },
  props: [
    "title",
    "table",
    "icon",
    "id",
    "after",
    "projectid",
    "sortable",
    "sortAlpha",
    "sortTime",
  ],
  components: {
    swipeoutActions,
  },
  mixins: [misc],
  inject: ["eventBus"],
  computed: {
    getItems() {
      var item = {
        table: this.table,
        key: this.key,
        id: this.id,
        sortAlpha: this.isSortAlpha,
        sortTime: this.isSortTime,        
        type: "multiple",
      };
      return store.getters.getData(item);
    },
    isSortAlpha() {
      if (this.sortAlpha == "true") {
        return true;
      } else {
        return false;
      }
    },
    isSortTime() {
      if (this.sortTime == "true") {
        return true;
      } else {
        return false;
      }
    },    
    isSortable() {
      if (this.isSortAlpha == true || this.isSortTime == true) {
        return false;
      } else return true;
    },
    items() {
      var entries = this.getItems;

      if (entries) {
        var items = [];
        for (var i = 0; i < entries.length; i++) {
          var item = {
            id: entries[i][this.table + "_id"],
          };
          if (entries[i][this.table + "_name"]) {
            item.name = entries[i][this.table + "_name"];
            item.title = entries[i][this.table + "_name"];
          }
          if (entries[i][this.table + "_position"]) {
            item.position = entries[i][this.table + "_position"];
          }
          if (entries[i][this.table + "_typeid"]) {
            item.typeid = entries[i][this.table + "_typeid"];
          }
          if (entries[i][this.table + "_text"]) {
            item.after = entries[i][this.table + "_text"];
          }
          if (entries[i][this.table + "_title"]) {
            item.name = entries[i][this.table + "_title"];
            item.title = entries[i][this.table + "_title"];
          }
          if (entries[i][this.table + "_message"]) {
            item.message = entries[i][this.table + "_message"];
          }
          if (entries[i][this.table + "_schedulehide"]) {
            item.schedulehide = entries[i][this.table + "_schedulehide"];
          }
          if (entries[i][this.table + "_directoryentryid"]) {
            var directoryentryid = entries[i][this.table + "_directoryentryid"];
            item.header = this.setDirectoryentryName(directoryentryid);
          }
          if (entries[i][this.table + "_time"]) {
            var unixtime = entries[i][this.table + "_time"];
            var formattedTime = this.unixtimeConversion(unixtime);
            item.footer = formattedTime;
          }
          items.push(item);
        }

        return items;
      }
    },
  },
  methods: {
    iosSearchDiv() {
      var style;
      if (device.ios) {
        style =
          "margin-bottom: 0px; margin-top: 0px; max-height: 0; overflow: hidden; transition: max-height 1s ease-out;";
        return style;
      } else {
        style =
          "max-height: 0; overflow: hidden; transition: max-height 1s ease-out;";
        return style;
      }
    },
    iosSearchInner() {
      var style;
      if (device.ios) {
        style = "height: 60px; padding-top: 25px; padding-bottom: 50px;";
        return style;
      } else {
        style = "height: 60px; padding-top: 5px; padding-bottom: 20px;";
        return style;
      }
    },
    iosSearchForm() {
      if (device.ios) {
        return "height: 52px; margin-bottom: 10px";
      }
    },
    iosSearchWrap() {
      if (device.ios) {
        return "height: 40px; padding-top: 7px; padding-bottom: 3px; margin-bottom:5px;";
      }
    },
    iosSearchIcon() {
      if (device.ios) {
        return "padding-left: 13px; padding-top: 2px;";
      }
    },
    iosSearchInput() {
      if (device.ios) {
        return "border-radius: 18px; padding-left: 43px; margin-top: 1px;";
      }
    },
    setBadge(item) {
      if (this.table == "pollitem") {
        var data = {
          table: "pollscore",
          key: "pollid",
          id: this.id,
          type: "multiple",
        };

        var pollscore = store.getters.getData(data);

        if (pollscore) {
          var score = pollscore.filter(function (result) {
            return result.pollscore_pollitemid == item.id;
          });

          var count = score.length;

          if (count > 0) {
            return count;
          } else {
            return "0";
          }
        } else {
          return "0";
        }
      }
    },
    link(table, id) {
      var link;
      var projectid = this.projectid;
      if (table == "newsitem") {
        link = "/" + table + "/update/" + projectid + "/" + id + "/";
      } else {
        link = "/" + table + "/" + id + "/";
      }
      return link;
    },
    setDirectoryentryName(id) {
      var item = {
        table: "directoryentry",
        key: "id",
        id: id,
        type: "single",
      };

      var directoryentry = store.getters.getData(item);
      if (directoryentry) {
        return directoryentry.directoryentry_name;
      }
    },
    setAfter(text) {
      if (this.after === "true") {
        return text;
      }
    },
    closeSortable() {
      f7.sortable.disable(".sort-" + this.table);
    },
    onSort() {
      var els = $$(".sort-" + this.table + " ul").children();
      this.sortList(els, this.table);
    },
  },
  beforeMount() {
    var vue = this;
    var find = params.filter(function (result) {
      return result.table === vue.table;
    });
    this.key = find[0].key;
  },
  mounted() {
    var vue = this;
    f7ready((f7) => {
      $$(".item-link").addClass("ripple-color-primary");

      $$(".badge").css("padding-bottom", "2px");
      $$(".badge").css("padding-left", "4px");

      // Event - Close sortable
      vue.eventBus.on("close-sortable", (x) => {
        vue.closeSortable();
        if (vue.eventBus.eventsListeners["close-sortable"].length > 1) {
          vue.eventBus.eventsListeners["close-sortable"].splice(1);
        }
      });

    });
  },
};
</script>

<style>
.ripple-color-primary {
  --f7-theme-color-ripple-color: rgba(var(--f7-theme-color-rgb), 0.15);
}
.ios .badge {
  padding-left: 4px !important;
  padding-bottom: 2px !important;
}

.ios .light-tint {
  background-color: var(--f7-md-secondary-container) !important;
}

.ios .background-white {
  background-color: white !important;
}

.md .badge {
  padding-left: 6px !important;
  padding-bottom: 4px !important;
}
</style>
