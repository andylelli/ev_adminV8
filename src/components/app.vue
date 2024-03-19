<template>
  <f7-app v-bind="f7params">
    <!-- Left panel with cover effect-->
    <f7-panel left class="safe-areas" cover>
      <f7-view init url="/left-panel/"></f7-view>
    </f7-panel>
    <!-- Your main view, should have "view-main" class -->
    <f7-views class="display-flex">
      <f7-view
        v-if="this.showLeftView == true"
        style="width: 27%"
        url="/left-view/"
      ></f7-view>
      <f7-view
        main
        style="width: 100%"
        class="safe-areas unselectable"
        url="/"
      ></f7-view>
    </f7-views>
  </f7-app>
</template>

<script>
// Event Bus
// Init Framework7-Vue Plugin
// Import Framework7
import Framework7 from "framework7/lite-bundle";

// Import Framework7-Vue Plugin
var eventBus = new Framework7.Events();

import store from "../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { getDevice, Dom7 } from "framework7";
const device = getDevice();
var $$ = Dom7;

import routes from "../js/routes.js";
import autoSync from "../mixins/autoSync";
import misc from "../mixins/misc";
import fetch from "../mixins/fetch";

export default {
  data() {
    return {
      f7params: {
        name: "Evaria", // App name
        theme: "auto", // Automatic theme detection

        // App store
        store: store,
        // App routes
        routes: routes,
        //serviceWorker: {
        //	path: "./service-worker.js",
        //	scope: "/",
        //},
      },
      url: null,
      viewportWidth: 0,
    };
  },
  provide: {
    eventBus: eventBus,
  },
  mixins: [autoSync, misc, fetch],
  computed: {
    showLeftView() {
      if (store.state.initiated === true && this.viewportWidth > 768) {
        return true;
      } else {
        return false;
      }
    },
  },
  components: {},
  methods: {
    checkNetwork() {
      var network = localStorage.network;
      if (network) {
        if (network == "online") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    setTheme() {
      if (device.desktop == true) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        var theme = urlParams.get("theme");
        if (theme) {
          return theme;
        } else {
          return "auto";
        }
      } else {
        return "auto";
      }
    },
  },
  beforeMounted() {},
  mounted() {
    var vue = this;
    f7ready((f7) => {
      if (window.navigator.standalone) {
        document
          .querySelector("meta[name=viewport]")
          .setAttribute(
            "content",
            "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
          );
      }

      f7.views.main.params.stackPages = true;

      vue.autoSync();

      this.viewportWidth = window.innerWidth;

      window.addEventListener(
        "resize",
        function (event) {
          vue.viewportWidth = window.innerWidth;
        },
        true
      );

      // Call F7 APIs here
      window.addEventListener("load", (event) => {
        localStorage.network = navigator.onLine ? "online" : "offline";
      });

      window.addEventListener("offline", (event) => {
        localStorage.network = "offline";
      });

      window.addEventListener("online", (event) => {
        localStorage.network = "online";
      });
    });
  },
};
</script>

<style>
</style>