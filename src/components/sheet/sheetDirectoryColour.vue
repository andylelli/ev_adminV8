<template>
  <!-- Swipe to close demo sheet -->
  <f7-sheet
    class="sheet-directory-colour"
    style="height: auto; --f7-sheet-bg-color: #fff"
    swipe-to-close
    backdrop
  >
    <f7-page-content>
      <div class="sheet-modal-inner">
        <div class="page-content">
          <div class="block">
            <div class="list simple-list">
              <ul>
                <li class="item-link sheet-close">
                  <div
                    v-on:click="setMapIcon('black')"
                    style="width: 100%"
                    class="text-align-center"
                  >
                    <img
                      v-bind:style="setMapIconStyle('black')"
                      :src="iconFilename('black')"
                    />
                  </div>
                </li>
                <li class="item-link sheet-close">
                  <div
                    v-on:click="setMapIcon('red')"
                    style="width: 100%"
                    class="text-align-center"
                  >
                    <img
                      v-bind:style="setMapIconStyle('red')"
                      :src="iconFilename('red')"
                    />
                  </div>
                </li>
                <li class="item-link sheet-close">
                  <div
                    v-on:click="setMapIcon('orange')"
                    style="width: 100%"
                    class="text-align-center"
                  >
                    <img
                      v-bind:style="setMapIconStyle('orange')"
                      :src="iconFilename('orange')"
                    />
                  </div>
                </li>
                <li class="item-link sheet-close">
                  <div
                    v-on:click="setMapIcon('yellow')"
                    style="width: 100%"
                    class="text-align-center"
                  >
                    <img
                      v-bind:style="setMapIconStyle('yellow')"
                      :src="iconFilename('yellow')"
                    />
                  </div>
                </li>
                <li class="item-link sheet-close">
                  <div
                    v-on:click="setMapIcon('green')"
                    style="width: 100%"
                    class="text-align-center"
                  >
                    <img
                      v-bind:style="setMapIconStyle('green')"
                      :src="iconFilename('green')"
                    />
                  </div>
                </li>
                <li class="item-link sheet-close">
                  <div
                    v-on:click="setMapIcon('blue')"
                    style="width: 100%"
                    class="text-align-center"
                  >
                    <img
                      v-bind:style="setMapIconStyle('blue')"
                      :src="iconFilename('blue')"
                    />
                  </div>
                </li>
                <li class="item-link sheet-close">
                  <div
                    v-on:click="setMapIcon('indigo')"
                    style="width: 100%"
                    class="text-align-center"
                  >
                    <img
                      v-bind:style="setMapIconStyle('indigo')"
                      :src="iconFilename('indigo')"
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </f7-page-content>
  </f7-sheet>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

export default {
  name: "sheet-directory-colour",
  data() {
    return {};
  },
  mixins: [],
  inject: ["eventBus"],
  computed: {
    getDirectory() {
      var item = {
        table: "directory",
        key: "projectid",
        id: this.projectid,
        type: "single",
      };
      return store.getters.getData(item);
    },
  },
  methods: {
    iconFilename(colour) {
      return "/admin/static/images/pindrop-" + colour + ".svg";
    },
    customIconFilename() {
      var URL = window.location.host;
      if (
        URL == "localhost:8080" ||
        URL == "localhost:8081" ||
        URL == "localhost:3000"
      ) {
        return "/user/static/images/pindrop-black.svg";
      } else {
        return "static/images/pindrop-black.svg";
      }
    },
    setMapIcon(colour) {
      new Date();
      var unixtime = Date.now() / 1000;
      var item = {};
      item.table = "directory";
      item.json = this.getDirectory;
      item.json.directory_colourid = colour;
      item.json.directory_unixtime = unixtime;
      store.dispatch("updateItemApp", item);
    },
    setMapIconStyle(colour) {
      if (f7.theme == "aurora") {
        return "height:24px; padding-top:5px; padding-bottom:2px;";
      } else {
        return "height:36px; padding-top:5px; padding-bottom:2px;";
      }
    },
  },
  mounted() {
	var vue = this;
    this.eventBus.on("directory-colour", (projectid) => {
      vue.projectid = projectid;
      f7.sheet.open(".sheet-directory-colour", true);
    });
  },
};
</script>

<style scoped>
@media (min-width: 1024px) {
  .sheet-modal {
    margin-left: 25%;
    width: 50% !important;
  }
}
</style>
