<template>
  <div style="height: 450px">
    <div id="map" style="height: 100%; width: 100%"></div>
    <!-- <f7-button @click="setGPS()">Button</f7-button> -->
  </div>
</template>

<script>
import store from "../../../vuex/store.js";

import map from "../../../mixins/map";

import { f7, f7ready } from "framework7-vue";

import { utils, Dom7 } from "framework7";
var $$ = Dom7;

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import "leaflet-pulse-icon/src/L.Icon.Pulse.js";
import "leaflet-pulse-icon/src/L.Icon.Pulse.css";

export default {
  components: {},
  name: "map-display",
  data() {
    return {
      //url: "https://api.maptiler.com/maps/streets/{z}/{x}/{y}@2x.png?key=y8c6QjX1I0EMkOzS7w4n",
      url: "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=y8c6QjX1I0EMkOzS7w4n",
      //url: "/admin/static/home/{z}/{x}/{y}.png",
      map: null,
      page: "map",
      project: store.state.project,
      pindrop: store.state.pindrop,
      directory: store.state.directory,
      directoryentry: store.state.directoryentry,
      compass: {},
      myposition: [0, 0],
      bounds: [],
      markers: [],

      zoom: 15,
      minZoom: 10,
      maxZoom: 16,
      center: [],
      bounceAtZoomLimits: false,
      touchZoom: true,
      fadeAnimation: false,
      zoomControl: true,
      touchZoom: true,
      maxBoundsViscosity: 0.7,
      inertia: true,
      inertiaDeceleration: 1,
      inertiaMaxSpeed: 1000,
      useCache: true,
      crossOrigin: false,
      edgeBufferTiles: 2,
      updateWhenIdle: true,
      updateInterval: 10,
      keepBuffer: 10,
      markersActive: null,
    };
  },
  props: {
    options: Object,
    mapProjectid: Number,
    projectId: Number,
    directoryentryId: Number,
    projectid: Number,
    directoryentryid: Number,
    f7route: Object,
  },
  inject: ["eventBus"],
  mixins: [map],
  computed: {},
  methods: {
    setCompass(lat, lng, title) {
      var compass = {
        lat: lat,
        lng: lng,
        title: title,
      };

      store.dispatch("setCompass", compass);
      f7.sheet.open(".c3-compass");
    },
    openSinglePopup(directoryentryid, marker) {
      if (marker.options.id == "marker-" + directoryentryid) {
        marker.openPopup();
        var latLng = marker.getLatLng();
        this.map.setView(latLng, 16);

        var find = this.directoryentry.filter(function (result) {
          return result.directoryentry_id === directoryentryid;
        });
        var directoryid = find[0].directoryentry_directoryid;

        var find = this.directory.filter(function (result) {
          return result.directory_id === directoryid;
        });
        var projectid = find[0].directory_projectid;

        this.markersActive = projectid;
      } else {
        marker.closePopup();
      }
    },
    openMultiplePopups(projectid, marker) {
      var markerid = marker.options.id;
      markerid = markerid.replace("marker-", "");
      var find = this.directoryentry.filter(function (result) {
        return result.directoryentry_id === parseInt(markerid);
      });

      var markerprojectid = null;
      if (find.length > 0) {
        var markerdirectoryid = find[0].directoryentry_directoryid;

        var find = this.directory.filter(function (result) {
          return result.directory_id === markerdirectoryid;
        });

        var markerprojectid = find[0].directory_projectid;
      }

      if (markerprojectid == projectid) {
        marker.openPopup();
      }

      //this.map.setView(this.myposition, this.map.getZoom());
    },
    closePopup(marker) {
      marker.closePopup();
    },
  },
  beforeMount() {
    //Get markers
    var obj = {
      type: "map",
      id: this.mapProjectid,
    };
    this.getMarkers = store.getters.getMarkers(obj);

    //Initialise
    this.initialiseMapBeforeMount();
  },
  mounted() {
    var vue = this;
    f7ready((f7) => {
      // Initialise
      this.initialiseMapMounted();

      // Set pulse icon
      window.setInterval(function () {
        vue.myPosition();
      }, 100);

      // Fix
      setTimeout(function () {
        vue.map.invalidateSize();
        window.dispatchEvent(new Event("resize"));
      }, 250);

      // Open markers
      utils.nextTick(() => {
        var i;
        if (vue.markers) {
          var length = vue.markers.length;
          if (vue.directoryentryid > 0) {
            for (i = 0; i < length; i++) {
              vue.openSinglePopup(vue.directoryentryid, vue.markers[i]);
            }
          } else if (this.projectid > 0) {
            for (i = 0; i < length; i++) {
              vue.openMultiplePopups(vue.projectid, vue.markers[i]);
            }
          }
        }
      });

      // Event - Open popups
      vue.eventBus.on("open-popups", function (id) {
        for (var i = 0; i < vue.markers.length; i++) {
          vue.openMultiplePopups(id, vue.markers[i]);
        }
        if (vue.eventBus.eventsListeners["open-popups"].length > 1) {
          vue.eventBus.eventsListeners["open-popups"].splice(1);
        }
      });

      // Event - Close popups
      vue.eventBus.on("close-popups", function () {
        for (var i = 0; i < vue.markers.length; i++) {
          vue.closePopup(vue.markers[i]);
        }
        if (vue.eventBus.eventsListeners["close-popups"].length > 1) {
          vue.eventBus.eventsListeners["close-popups"].splice(1);
        }
      });

      // Event - Open custom popups
      vue.eventBus.on("open-custom-popups", function () {
        for (var i = 0; i < vue.markers.length; i++) {
          vue.openCustomMarkers(vue.markers[i]);
        }
        if (vue.eventBus.eventsListeners["open-custom-popups"].length > 1) {
          vue.eventBus.eventsListeners["open-custom-popups"].splice(1);
        }
      });
    });
  },
};
</script>		

<style scoped>
</style>
