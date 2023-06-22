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
				<div v-if="this.getEvent.event_image" align="center" style="margin-top: 20px">
					<font-awesome-icon
						@click="removeImage()"
						class="fa-fw"
						style="font-size: 30px; color: #2b2b2b;"
						:icon="['fal', 'times']"
					/>
				</div>
			</div>
		</div>
		<f7-block-header>THEME COLOUR</f7-block-header>
		<f7-list style="cursor: pointer">
			<f7-list-input
				type="colorpicker"
				placeholder="Color"
				readonly
				:value="this.getAppColour()"
				:color-picker-params="this.pickerParams"
				@colorpicker:change="colorChange($event.hex)"
			></f7-list-input>
		</f7-list>
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
			c: 12,
			newImage: false,
			name: "",
		};
	},
	mixins: [images, newItem, misc, fetch],
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
		pickerParams() {
			var params = {
				modules: ["palette"],
				openIn: "auto",
				openInPhone: "popover",
				palette: this.getPalette,
				formatValue(value) {
					return value.hex;
				},
			};
			return params;
		},
		getPalette() {
			var vue = this;
			var find = store.state.lookup.filter(function (result) {
				return (
					result.lookup_id === "palette" &&
					result.lookup_eventid === vue.getEvent.event_id
				);
			});
			var palette = [];
			if (find[0]) {
				palette = find[0].lookup_value;
				var hex = this.rgbToHex(palette);
			} else {
				palette.push("#2b2b2b");
				var hex = this.rgbToHex(palette);
			}

			return hex;
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
		getAppColour() {
			var vue = this;
			var find = store.state.lookup.filter(function (result) {
				return (
					result.lookup_id === "appcolour" &&
					result.lookup_eventid === vue.getEvent.event_id
				);
			});

			if (find[0]) {
				var hex = "#" + find[0].lookup_value;

				var value = {
					hex: hex,
				};
				return value;
			}
		},
		colorChange(value) {
			value = value.replace("#", "");
			var lookup = {
				id: "appcolour",
				value: value,
				eventid: this.getEvent.event_id,
			};

			var preloader = true;

			this.newItem(lookup, "lookup", preloader);
			f7.colorPicker.close(".color-picker");
		},
		setPalette() {
			if (this.newImage === true) {
				const colorThief = new ColorThief();

				var colour = [];
				var palette = [];

				this.colourThief = colorThief.getPalette(this.img, this.c);
				this.colourThief.forEach(function (item) {
					colour =
						"rgb(" + item[0] + "," + item[1] + "," + item[2] + ")";
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

<!-- <style scoped>

</style>-->