<template>
  <div>
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
    <f7-list
      :class="'ripple-color-primary no-margin-top no-padding-top sort-' + table"
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
      sort: false,
      sortTime: false,
      sortReverse: false,
    };
  },
  props: ["title", "table", "icon", "id", "after", "projectid", "sortable"],
  components: {
    swipeoutActions,
  },
  mixins: [misc],
  inject: ["eventBus"],
  computed: {
    isSortable() {
      if(this.sortable == "true") {
        return true;
      };
    },
    items() {
      var item = {
        table: this.table,
        key: this.key,
        id: this.id,
        type: "multiple",
        sort: this.sort,
        sortTime: this.sortTime,
        sortReverse: this.sortReverse,
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

        if (directoryHidenames == 1 && directoryHidetype == 0) {
          return " ";
        } else if (
          directoryHidenames == 1 &&
          directoryHidetype == 1 &&
          item.schedulehide == 1
        ) {
          return " ";
        } else {
          return "";
        }
      } else if (this.table == "pollitem") {
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
    if (find[0].sort) {
      this.sort = find[0].sort;
    }
    if (find[0].sortTime) {
      this.sortTime = find[0].sortTime;
    }
    if (find[0].sortReverse) {
      this.sortReverse = find[0].sortReverse;
    }    
  },
  mounted() {
    var vue = this;
    f7ready((f7) => {
      $$(".item-link").addClass("ripple-color-primary");

      $$(".badge").css("padding-bottom", "2px");
      $$(".badge").css("padding-left", "4px");

      vue.eventBus.on("close-sortable", (x) => {
        vue.closeSortable();
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

.md .badge {
  padding-left: 6px !important;
  padding-bottom: 4px !important;
}
</style>
