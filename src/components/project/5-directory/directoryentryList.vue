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
      :class="'search-list list sortable searchbar-found ripple-color-primary no-margin-top no-padding-top sort-' + this.table"
      style="top: 0px; margin-top: 0px; padding-top: 0px"
    >
      <ul>
        <li
          v-for="item in this.getDirectoryentries"
          :key="item.directoryentry_id"
          class="swipeout"
          :id="'directoryentry' + item.directoryentry_id"
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
                  v-if="item.directoryentry_schedulehide == 1 || (getDirectory.directory_hidenames == 1 && getDirectory.directory_hidetype == 0)"
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
          <swipeout-actions :item="item" :table="table"></swipeout-actions>
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
      sortLength: 30,
      directoryentries: [],
      total: 0,
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
    getDirectoryentries() {
      return this.directoryentries;
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
    toggleSort(el) {
      f7.sortable.toggle(el);
    },
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
    infiniteLoad(accordian) {
      f7.preloader.show();

      var items = {
        table: this.table,
        key: this.key,
        id: this.id,
        type: "multiple",
        sortAlpha: this.isSortAlpha,
        sortTime: this.isSortTime,
        infiniteStart: this.infiniteStart,
        infiniteEnd: 30,
      };

      var data = store.getters.getData(items);
      this.directoryentries = data;

      var items = {
        table: this.table,
        key: this.key,
        id: this.id,
        type: "multiple",
      };

      var data = store.getters.getData(items);
      if (data) {
        this.total = data.length;

        if (this.total > 20) {
          var vue = this;
          setTimeout(() => {
            var items = {
              table: this.table,
              key: this.key,
              id: this.id,
              type: "multiple",
              sortAlpha: this.isSortAlpha,
              sortTime: this.isSortTime,
              infiniteStart: 30,
              infiniteEnd: vue.total,
            };

            var data = store.getters.getData(items);
            vue.directoryentries = vue.directoryentries.concat(data);

            f7.preloader.hide();

            if (accordian == true) {
              vue.accordianSlide("search-div", 80);
            }
          }, 200);
        } else {
          f7.preloader.hide();
        }
      } else {
        f7.preloader.hide();
        this.total = 0;
      }
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
      this.infiniteLoad(accordian);

      // Event - Close sortable
      vue.eventBus.on("close-sortable", (x) => {
        vue.closeSortable();
        if (vue.eventBus.eventsListeners["close-sortable"].length > 1) {
          vue.eventBus.eventsListeners["close-sortable"].splice(1);
        }
      });
    });

    // On close
    vue.eventBus.on("list-on-close", (x) => {
      this.directoryentries = [];
      this.getDirectoryentries = [];
      if (vue.eventBus.eventsListeners["list-on-close"].length > 1) {
        vue.eventBus.eventsListeners["list-on-close"].splice(1);
      }
    });

    // Infinite load
    vue.eventBus.on("infinite-load", (x) => {
      var accordian = false;
      vue.infiniteLoad(accordian);
      if (vue.eventBus.eventsListeners["infinite-load"].length > 1) {
        vue.eventBus.eventsListeners["infinite-load"].splice(1);
      }
    });


    var vue = this;
    f7.on('sortableSort', function (el) {
      vue.onSort();
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
