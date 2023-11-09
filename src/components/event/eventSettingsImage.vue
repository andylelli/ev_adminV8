<template>
  <div>
    <f7-block-header>IMAGE</f7-block-header>
    <div class="text-align-center">
      <div align="center"></div>
      <div align="center">
        <input
          type="file"
          name="file"
          id="file"
          class="c3-input-file c3-hide"
        />
        <label
          id="imageAjax"
          for="file"
          class="c3-show"
          style="margin-top: 5px"
        >
          <img
            id="image"
            v-bind:class="imageEventClass"
            width="300"
            :src="imageEvent"
            @load="setPalette()"
          />
        </label>
        <span
          id="progress"
          class="progressbar c3-hide"
          data-progress="0"
          style="width: 70vw; margin-top: 10px"
        ></span>
        <div
          v-if="this.getEvent.event_image"
          align="center"
          style="margin-top: 20px"
        >
          <font-awesome-icon
            @click="removeImage()"
            class="fa-fw"
            style="font-size: 30px; color: #2b2b2b"
            :icon="['fal', 'times']"
          />
        </div>
      </div>
    </div>
    <div v-show="this.getEvent.event_image">
      <f7-block-header>THEME COLOUR</f7-block-header>
      <div class="list list-strong-ios list-outline-ios">
        <ul>
          <li>
            <div class="item-content item-input">
              <div class="item-media">
                <div
                  id="color-picker-palette-value"
                  style="width: 30px; height: 30px"
                ></div>
              </div>
              <div class="item-inner">
                <div class="item-input-wrap">
                  <input
                    type="text"
                    placeholder="Color"
                    readonly="readonly"
                    id="color-picker-palette"
                  />
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ColorThief from "../../../node_modules/colorthief/dist/color-thief.mjs";

import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";
import { utils } from "framework7";

import { Dom7 } from "framework7";
var $$ = Dom7;

import images from "../../mixins/images";
import newItem from "../../mixins/newItem";
import misc from "../../mixins/misc";
import fetch from "../../mixins/fetch";

export default {
  name: "event-settings-image",
  data() {
    return {
      userid: store.state.userid,
      eventid: store.state.eventid,
      c: 11,
      newImage: false,
      name: "",
      colorPicker: null,
    };
  },
  mixins: [images, newItem, misc, fetch],
  computed: {
    getColour() {
      return f7.colors.primary;
    },
    getEvent() {
      var item = {
        table: "event",
        key: "id",
        id: store.state.eventid,
        type: "single",
      };
      return store.getters.getData(item);
    },
    getAppcolour() {
      var item = {
        table: "lookup",
        key: "id",
        id: "appcolour",
        type: "single",
      };

      var colour = store.getters.getData(item);

      var value;
      if (colour) {
        var value = "#" + colour.lookup_value;
      } else {
        value = f7.colors.primary;
      }
      return value;
    },
    getPalette() {
      var item = {
        table: "lookup",
        key: "id",
        id: "palette",
        type: "single",
      };
      var rgb = store.getters.getData(item);

      var hex;
      if (rgb) {
        hex = this.rgbToHex(rgb.lookup_value);
      } else {
        hex = f7.colors.primary;
      }
      return hex;
    },
    img() {
      return document.getElementById("image");
    },
    imageEvent() {
      if (this.getEvent.event_image) {
        return this.getEvent.event_image;
      } else {
        return "/admin/static/images/image_upload.svg";
      }
    },
    imageEventClass() {
      if (this.getEvent.event_image) {
        return "elevation-4 c3-show c3-pointer";
      } else {
        return "c3-show c3-pointer";
      }
    },
  },
  methods: {
    removeImage() {
      var eventid = this.getEvent.event_id;
      var e = null;
      var remove = true;
      var table = "event";
      this.imageLoad(e, eventid, table, remove);
    },
    colorChange(value) {
      if (value) {
        var colour = value.hex;
        colour = colour.replace("#", "");
        var lookup = {
          id: "appcolour",
          value: colour,
          eventid: this.getEvent.event_id,
        };

        var preloader = true;

        this.newItem(lookup, "lookup", preloader);
		
      }
    },
    setPalette() {
      if (this.newImage === true) {
        const colorThief = new ColorThief();

        var colour = [];
        var palette = [];

        this.colourThief = colorThief.getPalette(this.img, this.c);
        this.colourThief.forEach(function (item) {
          colour = "rgb(" + item[0] + "," + item[1] + "," + item[2] + ")";
          palette.push(colour);
        });

        var lookup = {
          id: "palette",
          value: JSON.stringify(palette),
          eventid: this.getEvent.event_id,
        };

        this.newItem(lookup, "lookup", false);

        this.newImage = false;
      }
    },
    rgbToHex(palette) {
      var colours_hex = [];
      var clr_arr = [];
      var vue = this;
      palette.forEach(function (clr) {
        clr = clr.replace("rgb(", "");
        clr = clr.replace(")", "");
        clr_arr = clr.split(",");

        var colour_hex = utils.colorRgbToHex(
          parseInt(clr_arr[0]),
          parseInt(clr_arr[1]),
          parseInt(clr_arr[2])
        );
        colours_hex.push(colour_hex);
      });

      return colours_hex;
    },
  },
  mounted() {
    var vue = this;
    this.colorPicker = f7.colorPicker.create({
      inputEl: "#color-picker-palette",
      targetEl: "#color-picker-palette-value",
      targetElSetBackgroundColor: true,
      modules: ["palette"],
      openIn: "sheet",
      openInPhone: "sheet",
      palette: this.getPalette,
      value: {
        hex: this.getColour,
      },
      formatValue: function (value) {
        return value.hex;
      },
      on: {
        change(cp, value) {
          vue.colorChange(value);
        },
      },
    });

    f7ready((f7) => {
      var eventid = this.getEvent.event_id;
      var vue = this;
      $$(".c3-input-file").on("change", function (e) {
        var table = "event";
        vue.imageLoad(e, eventid, table);
      });
    });
  },
};
</script>

<!--<style scoped>

</style>-->