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
    <div :style="iosSearchDiv()" id="search-div">
      <form
        data-search-container=".search-list"
        data-search-in=".item-title"
        class="searchbar searchbar-init background-white"
        :style="iosSearchForm()"
      >
        <div class="searchbar-inner" :style="iosSearchInner()">
          <div class="searchbar-input-wrap" :style="iosSearchWrap()">
            <input
              type="search"
              placeholder="Search"
              class="light-tint"
              :style="iosSearchInput()"
            />
            <i class="searchbar-icon" :style="iosSearchIcon()"></i>
            <span class="input-clear-button"></span>
          </div>
          <span class="searchbar-disable-button">Cancel</span>
        </div>
      </form>
    </div>

    <!-- SEARCH BAR NOT FOUND-->
    <div class="md searchbar-not-found">
      <div class="text-align-center">
        <f7-block
          strong
          style="margin-top: 25px; margin-bottom: 25px; font-size: 18px"
        >
          Nothing found
        </f7-block>
      </div>
    </div>

    <!-- LIST-->
    <div
      :class="
        'search-list list sortable searchbar-found ripple-color-primary no-margin-top no-padding-top sort-' +
        this.table +
        '-' +
        this.id
      "
      style="top: 0px; margin-top: 0px; padding-top: 0px"
      @click="onClose()"
    >
      <ul>
        <li
          v-for="item in this.watchDirectoryentries"
          :key="item.directoryentry_id"
          class="swipeout"
          :id="'directoryentry-' + item.directoryentry_id"
          :position="item.directoryentry_position"
        >
          <div class="swipeout-content">
            <a
              :href="link(table, item.directoryentry_id)"
              class="item-link item-content"
            >
              <div class="item-media">
                <font-awesome-icon
                  class="fa-fw custom-colour"
                  style="font-size: 20px"
                  :icon="icon"
                />
              </div>
              <div class="item-inner">
                <div class="item-title" v-html="item.directoryentry_name"></div>
                <div
                  v-if="
                    getDirectory.directory_hidenames == 1 &&
                    (getDirectory.directory_hidetype == 0 ||
                      (getDirectory.directory_hidetype == 1 &&
                        item.directoryentry_schedulehide == 1))
                  "
                  class="item-after"
                >
                  <font-awesome-icon
                    class="fa-fw custom-colour"
                    style="font-size: 20px"
                    :icon="['fal', 'eye-slash']"
                  />
                </div>
              </div>
            </a>
          </div>
          <swipeout-actions
            :id="item.directoryentry_id"
            :name="item.directoryentry_name"
            :table="table"
          ></swipeout-actions>
          <div class="sortable-handler"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { getDevice, Dom7 } from "framework7";
var $$ = Dom7;
const device = getDevice();

import misc from "../../../mixins/misc";

import params from "../../../js/config/params.js";

import swipeoutActions from "../../misc/swipeoutActions.vue";

export default {
  name: "list",
  data() {
    return {
      event: store.state.event[0],
      key: null,
      sortLength: 20,
      total: null,
      infiniteStart: 0,
      directoryentries: this.watchDirectory,
      isDelete: false,
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
  watch: {
    getDirectoryentries(oldValue, newValue) {
      console.log("watch");
      if (this.directoryentries) {
        this.total = this.directoryentries.length;
      }

      var items = {
        table: this.table,
        key: this.key,
        id: this.id,
        type: "multiple",
        sortAlpha: this.isSortAlpha,
        sortTime: this.isSortTime,
        infiniteStart: 0,
        infiniteEnd: 20,
      };
      var data = store.getters.getData(items);
      this.directoryentries = data;

      var n = this.getDirectoryentries.splice(20);
      var directoryentries = this.directoryentries.concat(n);

      var ms = 250;
      if (directoryentries.length - this.total == 1) {
        ms = 0;
      }

      var vue = this;
      if (data.length >= 20) {
        setTimeout(() => {
          vue.directoryentries = vue.directoryentries.concat(n);
        }, ms);
      } else {
        vue.directoryentries = data;
      }
    },
  },
  computed: {
    watchDirectoryentries() {
      return this.directoryentries;
    },
    getDirectoryentries() {
      var items = {
        table: this.table,
        key: this.key,
        id: this.id,
        type: "multiple",
        sortAlpha: this.isSortAlpha,
        sortTime: this.isSortTime,
        infiniteStart: this.infiniteStart,
        infiniteEnd: 99999,
      };
      var data = store.getters.getData(items);
      return data;
    },
    getDirectory() {
      var item = {
        table: "directory",
        key: "projectid",
        id: this.projectid,
        type: "single",
      };
      var data = store.getters.getData(item);
      if (data) {
        return data;
      }
    },

    isSortAlpha() {
      if (this.sortAlpha == "true") {
        return true;
      } else {
        return false;
      }
    },
    isSortable() {
      if (this.isSortAlpha == true) {
        return false;
      } else return true;
    },
  },
  methods: {
    onClose() {
      this.eventBus.emit("list-on-close");
    },
    toggleSort(el) {
      f7.sortable.toggle(el);
    },
    iosSearchDiv() {
      var style;
      if (device.ios) {
        style =
          "margin-bottom: 0px; margin-top: 0px; max-height: 0; overflow: hidden; transition: max-height 1.2s ease-out;";
        return style;
      } else {
        style =
          "max-height: 0; overflow: hidden; transition: max-height 1.2s ease-out;";
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
      var accordian = true;
      setTimeout(() => {
        if (accordian == true) {
          vue.accordianSlide("search-div", 80);
        }
      }, 150);

      // Event - Close sortable
      this.eventBus.eventsListeners["close-sortable"] = [];
      this.eventBus.on("close-sortable", (x) => {
        vue.closeSortable();
      });
    });

    // On close
    //this.eventBus.eventsListeners["list-on-close"] = [];
    //this.eventBus.on("list-on-close", (x) => {
    //  var len = this.directoryentries.length;
    //  if (len > 20) {
    //    this.directoryentries.splice(20, len - 20);
    //  }
    //});

    // Event - Close sortable
    this.eventBus.eventsListeners["is-delete"] = [];
    this.eventBus.on("is-delete", (bool) => {
      vue.isDelete = bool;
      console.log(vue.isDelete);
    });

    var vue = this;
    f7.on("sortableSort", function (el) {
      this.onSort();
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

.md .searchbar-disable-button {
  top: 23px;
}
</style>
