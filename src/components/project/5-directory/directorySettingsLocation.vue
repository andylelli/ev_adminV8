<template>
	<div>
		<f7-list list class="no-margin-bottom no-margin-top no-hairline">
			<f7-list-item :title="title()" class="no-hairline">
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'map-marked']"
						/>
					</f7-icon>
				</template>
				<f7-toggle
					:checked="this.isChecked()"
					color="custom-color"
					@toggle:change="toggle($event)"
				></f7-toggle>
			</f7-list-item>
		</f7-list>
		<f7-list
			inline-labels
			:id="'location-' + this.projectid"
			class="no-margin-top"
			:style="mapMaxHeight(getProject.project_id)"
		>
			<f7-list-input
				inline-labels
				label="Map"
				type="select"
				placeholder="Choose..."
				class="location-map"
				:value="setValue()"
				@change="setMap($event.target.value)"
			>
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'map']"
						/> </f7-icon
				></template>
				<option
					v-for="item in this.getMaps"
					:key="item.mapId"
					:value="item.mapId"
					v-html="item.mapName"
				></option>
			</f7-list-input>
			<f7-list-item
				title="Marker colour"
				@click="openDirectoryColourSheet()"
			>
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'map-marker-alt']"
						/> </f7-icon
				></template>
				<div>
					<img
						v-if="this.getDirectory.directory_colourid.length > 0"
						v-bind:style="setMapIconStyle()"
						:src="
							'static/images/pindrop-' +
							this.getDirectory.directory_colourid +
							'.svg'
						"
					/>
					<div v-else>Choose</div>
				</div>
			</f7-list-item>
		</f7-list>
	</div>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { Dom7 } from "framework7";
var $$ = Dom7;

import misc from "../../../mixins/misc";

export default {
	name: "directoryentry-settings-location",
	data() {
		return {
			pindrops: store.state.pindrop,
		};
	},
	props: {
		projectid: Number,
	},
	mixins: [misc],
	inject: ["eventBus"],
	computed: {
		getProjects() {
			var item = {
				table: "project",
				key: "eventid",
				id: store.state.eventid,
				type: "multiple",
			};
			return store.getters.getData(item);
		},
		getProject() {
			var item = {
				table: "project",
				key: "id",
				id: this.projectid,
				type: "single",
			};
			return store.getters.getData(item);
		},
		getDirectory() {
			var item = {
				table: "directory",
				key: "projectid",
				id: this.projectid,
				type: "single",
			};
			return store.getters.getData(item);
		},
		getMaps() {
			var array = [];
			var vue = this;
			for (var i = 0; i < this.getProjects.length; i++) {
				var pindrop = this.pindrops.filter(function (result) {
					return (
						result.pindrop_projectid ==
						vue.getProjects[i].project_id
					);
				});
				if (pindrop.length > 0) {
					var json = {
						mapId: pindrop[0].pindrop_id,
						mapName: this.getProjects[i].project_name,
					};
					array.push(json);
				}
			}
			return array;
		},
	},
	methods: {
		mapMaxHeight() {
			var mapid = this.getDirectory.directory_mapid;
			var height;
			if (mapid == 0) {
				height = 0;
			} else {
				height = "115px";
			}
			var z =
				"max-height:" +
				height +
				"; overflow: hidden; transition: max-height 0.4s ease-out";
			return z;
		},
		title() {
			var projectName = this.getProject.project_name;
			var name = projectName.toLowerCase();
			var title = "Show " + name + " on map?";
			return title;
		},
		isChecked() {
			if (this.getDirectory.directory_mapid === 0) {
				return false;
			} else {
				return true;
			}
		},
		toggle(event) {
			var id = "location-" + this.projectid;
			this.accordianSlide(id, 0);
			new Date();
			var unixtime = Date.now() / 1000;

			var vue = this;
			setTimeout(function () {
				if (event === false) {
					var item = {};
					item.table = "directory";
					item.json = vue.getDirectory;
					item.json.directory_mapid = 0;
					item.json.directory_colourid = "";
					item.json.directory_unixtime = unixtime;
					store.dispatch("updateItemApp", item);
				}
			}, 500);
		},
		setMap(value) {
			var map = this.getMaps.filter(function (result) {
				return result.mapId == value;
			});
			new Date();
			var unixtime = Date.now() / 1000;
			var item = {};
			item.json = this.getDirectory;
			console.log
			item.table = "directory";
			item.json.directory_mapid = map[0].mapId;
			item.json.directory_unixtime = unixtime;
			store.dispatch("updateItemApp", item);
		},
		setValue() {
			var mapid = this.getDirectory.directory_mapid;
			return mapid;
		},
		setMapIconStyle(colour) {
			if (f7.theme == "aurora") {
				return "height:24px; padding-top:5px; padding-bottom:2px;";
			} else {
				return "height:24px;";
			}
		},
		openDirectoryColourSheet() {
			this.eventBus.emit("directoryColour");
		},
	},
	mounted() {},
};
</script>

<style>
</style>