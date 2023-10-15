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

    <!-- SEARCH BAR MAIN-->
    <div
      v-if="items.length > sortLength"
      id="search-div"
    >
      <form
        data-search-container=".search-list"
        data-search-in=".item-title"
        class="searchbar searchbar-init"
      >
        <div class="searchbar-inner">
          <div class="searchbar-input-wrap">
            <input type="search" placeholder="Search" />
            <i class="searchbar-icon"></i>
            <span class="input-clear-button"></span>
          </div>
          <span class="searchbar-disable-button">Cancel</span>
        </div>
      </form>
    </div>

    <!-- SEARCH BAR NOT FOUND-->
    <div
      v-if="items.length > sortLength"
      strong-ios
      outline-ios
      dividers-ios
      class="searchbar-not-found"
    >
      <div class="text-align-center">
        <f7-block
          strong
          style="margin-top: 25px; margin-bottom: 25px; font-size: 18px"
        >
          Nothing found
        </f7-block>
      </div>
    </div>

    <!-- LIST -->
    <f7-list
      :class="
        'search-list searchbar-found ripple-color-primary no-margin-top no-padding-top sort-' +
        table
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
        <swipeout-actions :item="item" :table="table"></swipeout-actions>
      </f7-list-item>
    </f7-list>
  </div>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";
import { Dom7 } from "framework7";
var $$ = Dom7;

import misc from "../../mixins/misc";

import params from "../../js/config/params.js";

import swipeoutActions from "./swipeoutActions.vue";

export default {
  name: "list",
  data() {
    return {
      event: store.state.event[0],
      key: null,
      sortLength: 30,
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
  ],
  components: {
    swipeoutActions,
  },
  mixins: [misc],
  inject: ["eventBus"],
  computed: {
    isSortable() {
      if (this.sortAlpha == "true") {
        return false;
      } else return true;
    },
    isSortAlpha() {
      if (this.sortAlpha == "true") {
        return true;
      } else {
        return false;
      }
    },
    items() {
      var item = {
        table: this.table,
        key: this.key,
        id: this.id,
        type: "multiple",
        sort: this.isSortable,
        sortTime: this.isSortTime,
        sortAlpha: this.isSortAlpha,
      };

      var entries = store.getters.getData(item);

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
    setEyeSlash() {
      if (this.table == "directoryentry") {
        var data = {
          table: "directory",
          key: "id",
          id: this.id,
          type: "single",
        };
        var directory = store.getters.getData(data);
        var directoryHidenames = directory.directory_hidenames;
        var directoryHidetype = directory.directory_hidetype;

        if (directoryHidenames == 1 && directoryHidetype == 1) {
          this.items.forEach((item) => {
            if (item.schedulehide == 1) {
              var replaceID = "sort-" + this.table + "-" + item.id;
              var el = $$("#" + replaceID);
              var itemAfter = el.find(".item-inner");
              itemAfter.html(
                '<div class="item-title">' +
                  item.name +
                  '</div><div class="item-after"><span><svg class="svg-inline--fa fa-eye-slash fa-fw custom-colour" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="eye-slash" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" style="font-size: 20px;"><path class="" fill="currentColor" d="M25.9 3.4C19-2 8.9-.8 3.4 6.1S-.8 23.1 6.1 28.6l608 480c6.9 5.5 17 4.3 22.5-2.6s4.3-17-2.6-22.5L25.9 3.4zM605.5 268.3c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-51.2 0-96 14.8-133.9 36.8l27.3 21.5C244.6 74.2 280.2 64 320 64c70.4 0 127.7 32 170.8 72c43.1 40 71.9 88 85.2 120c-9.2 22.1-25.9 52-49.5 81.5l25.1 19.8c25.6-32 43.7-64.4 53.9-89zM88.4 154.7c-25.6 32-43.7 64.4-53.9 89c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c51.2 0 96-14.8 133.9-36.8l-27.3-21.5C395.4 437.8 359.8 448 320 448c-70.4 0-127.7-32-170.8-72C106.1 336 77.3 288 64 256c9.2-22.1 25.9-52 49.5-81.5L88.4 154.7zM320 384c16.7 0 32.7-3.2 47.4-9.1l-30.9-24.4c-5.4 .9-10.9 1.4-16.5 1.4c-51 0-92.8-39.8-95.8-90.1l-30.9-24.4c-.9 6-1.3 12.2-1.3 18.5c0 70.7 57.3 128 128 128zM448 256c0-70.7-57.3-128-128-128c-16.7 0-32.7 3.2-47.4 9.1l30.9 24.4c5.4-.9 10.9-1.4 16.5-1.4c51 0 92.8 39.8 95.8 90.1l30.9 24.4c.9-6 1.3-12.2 1.3-18.5z"></path></svg></span></div>'
              );
            } else {
              var replaceID = "sort-" + this.table + "-" + item.id;
              var el = $$("#" + replaceID + " .item-inner div.item-after");
              el.remove();
            }
          });
        }
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

      var data = {
        table: "directory",
        key: "id",
        id: this.id,
        type: "single",
      };
      var directory = store.getters.getData(data);
      if (directory) {
        if (directory.directory_hidenames == 1) {
          this.setEyeSlash();
        }
      }

      // Event - Close sortable
      vue.eventBus.on("close-sortable", (x) => {
        vue.closeSortable();
      });
      this.eventBus.eventsListeners["close-sortable"].splice(1);

      // Event - Set eye slash
      vue.eventBus.on("set-eye-slash", (x) => {
        vue.setEyeSlash();
      });
      this.eventBus.eventsListeners["set-eye-slash"].splice(1);
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

.md .badge {
  padding-left: 6px !important;
  padding-bottom: 4px !important;
}
</style>
