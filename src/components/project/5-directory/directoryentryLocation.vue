<template>
	<f7-list accordion-list class="no-margin-top">
		<f7-list-item accordion-item title="Set location">
			<template #media>
				<f7-icon>
					<font-awesome-icon
						class="fa-fw custom-colour"
						style="font-size: 20px"
						:icon="['fal', 'map-marked']"
					/>
				</f7-icon>
			</template>
			<f7-accordion-content>
				<f7-block>
					<div style="height: 450px">
						<div id="map" style="height: 100%; width: 100%"></div>
						<f7-fab
							color="custom-color"
							style="bottom: 200px"
							@click="recenterOnGPS()"
						>
							<font-awesome-icon
								style="font-size: 32px; color: white"
								:icon="['fal', 'crosshairs']"
							/>
						</f7-fab>
						<f7-fab
							color="custom-color"
							style="bottom: 140px"
							@click="recenterOnMarker()"
						>
							<font-awesome-icon
								style="font-size: 32px; color: white"
								:icon="['fal', 'map-marker-alt']"
							/>
						</f7-fab>
						<f7-fab
							color="custom-color"
							style="bottom: 80px"
							@click="addMarker()"
						>
							<font-awesome-icon
								style="font-size: 32px; color: white"
								:icon="['fal', 'map-marker-plus']"
							/>
						</f7-fab>
						<f7-fab
							color="custom-color"
							style="bottom: 20px"
							@click="removeMarker()"
						>
							<font-awesome-icon
								style="font-size: 32px; color: white"
								:icon="['fal', 'map-marker-times']"
							/>
						</f7-fab>
					</div>
				</f7-block>
			</f7-accordion-content>
		</f7-list-item>
	</f7-list>
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
	name: "directoryentry-location",
	data() {
		return {
			url: "https://api.maptiler.com/maps/streets/{z}/{x}/{y}@2x.png?key=y8c6QjX1I0EMkOzS7w4n",
			//url: "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=y8c6QjX1I0EMkOzS7w4n",
			//url: "/admin/static/home/{z}/{x}/{y}.png",
			map: null,
			page: "directoryentry",
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

			here: [],
			firstLoop: true
		};
	},
	props: {
		options: Object,
		projectid: Number,
		directoryentryid: Number,
		f7route: Object,
	},
	mixins: [map],
	inject: ["eventBus"],
	computed: {
		getDirectory() {
			if (this.getDirectoryentry) {
				var id = this.getDirectoryentry.directoryentry_directoryid;
				var item = {
					table: "directory",
					key: "id",
					id: id,
					type: "single",
				};
				return store.getters.getData(item);
			}
		},
		getDirectoryentry() {
			var id = this.directoryentryid;
			var item = {
				table: "directoryentry",
				key: "id",
				id: id,
				type: "single",
			};
			var data = store.getters.getData(item);
			if (data) {
				return data;
			}
		},
		markerPosition() {
			return [
				this.getDirectoryentry.directoryentry_lat,
				this.getDirectoryentry.directoryentry_lng,
			];
		},
	},
	methods: {
		//CLICK
		recenterOnGPS() {
			this.map.panTo(this.myposition);
		},
		//CLICK
		recenterOnMarker() {
			if (this.markerPosition[0] != 0 && this.markerPosition[1] != 0) {
				this.map.panTo(this.markerPosition);
			} else {
				f7.dialog.alert("Marker position is not currently set");
			}
		},
		//CLICK
		addMarker() {
			if (
				this.getDirectoryentry.directoryentry_lat == 0 &&
				this.getDirectoryentry.directoryentry_lng == 0
			) {
				new Date();
				var unixtime = Date.now() / 1000;
				var item = {};
				item.table = "directoryentry";
				item.json = this.getDirectoryentry;
				item.json.directoryentry_lat = this.myposition[0];
				item.json.directoryentry_lng = this.myposition[1];
				item.json.directoryentry_unixtime = unixtime;
				store.dispatch("updateItemApp", item);

				var marker = [];
				marker.push(item.json);
				this.initiateMarkers(marker);
			}
		},
		//CLICK
		removeMarker() {
			if (
				this.getDirectoryentry.directoryentry_lat != 0 &&
				this.getDirectoryentry.directoryentry_lng != 0
			) {
				new Date();
				var unixtime = Date.now() / 1000;
				var item = {};
				item.table = "directoryentry";
				item.json = this.getDirectoryentry;
				item.json.directoryentry_lat = 0;
				item.json.directoryentry_lng = 0;
				item.json.directoryentry_unixtime = unixtime;
				this.markers[0].remove();
			}
		},
		//DRAG
		updateMarkerPosition(pos) {
			new Date();
			var unixtime = Date.now() / 1000;
			var item = {};
			item.table = "directoryentry";
			item.json = this.getDirectoryentry;
			item.json.directoryentry_lat = pos.lat;
			item.json.directoryentry_lng = pos.lng;
			item.json.directoryentry_unixtime = unixtime;
			store.dispatch("updateItemApp", item);
		},
		//CLOSE
		closePopup(marker) {
			marker.closePopup();
		},
	},
	beforeMount() {
		//Get markers
		var obj = {
			type: "directoryentry",
			id: this.directoryentryid,
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
		});
	},
};
</script>		

<style scoped>
.fab > a {
	background-color: rgba(var(--f7-ios-primary), 1);
}
</style>
