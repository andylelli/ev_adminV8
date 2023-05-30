<template>
	<f7-sheet class="c3-compass" style="
			height: 94%;
			background-color: rgba(255, 255, 1);
			backdrop-filter: blur(3px);
		" swipe-to-close backdrop @sheet:open="sheetOpen()" @sheet:close="sheetClose()">
		<f7-page-content>
			<div class="navbar">
				<div class="navbar-bg"></div>
				<div class="navbar-inner">
					<div class="left"></div>
					<div class="title"> {{ compass.title }} </div>
					<div class="right"></div>
				</div>
			</div>
			<f7-block>
				<div>
					<div v-if="this.permissionGranted === false" align="center" style="color: red;">
						{{ this.showPermissionsMessage }}
					</div>
					<div align="center" style="padding-top: 7vh">
						<img id="disc" src="/admin/static/images/compass.png" :style="this.getDiscStyle" />
					</div>
					<div style="font-size: 30px; color: black" align="center">
						<p v-html="this.getDistance"></p>
					</div>
				</div>
			</f7-block>
		</f7-page-content>
	</f7-sheet>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { getDevice } from "framework7";
const device = getDevice();

import compass from "../../mixins/compass";

// import { useDeviceMotion } from "vue-use-web";

export default {
	//setup() {
	//	const { acceleration, rotationRate } = useDeviceMotion();
	//	return { acceleration, rotationRate };
	//},
	name: "sheet-compass",
	data() {
		return {
			compass: {
				title: "",
			},
			position: null,
			direction: null,
			distance: null,
			orientation: 0,
			width: "90vw",
			webkitCompassHeading: null,
			permissionGranted: null,
			gettingLocation: false,
			errorStr: null,
			location: "",
			beta: null,
			gamma: null,
		};
	},
	mixins: [compass],
	computed: {
		getDevice() {
			return device.ios;
		},
		getWebkitCompassHeading() {
			return this.webkitCompassHeading;
		},
		showDistance() {
			if (this.distance === null) {
				return false;
			}
		},
		showPermissionsMessage() {
			if (this.permissionGranted === false) {
				return "PERMISSION DENIED - REOPEN APP TO RESET COMPASS ACCESS";
			}
		},
		getStyle() {
			return this.this.style;
		},
		getDirection() {
			return this.calcDirection();
		},
		getDistance() {
			if (this.calcDistance() != null) {
				return this.calcDistance() + "m";
			}
		},
		getDiscStyle() {
			var maxWidth;
			if (device.desktop) {
				maxWidth = "max-width: 380px;";
			}
			var style = "width: " + this.width + "; ";
			style += "-webkitTransform: rotate(" + this.direction + "deg); ";
			style += "-MozTransform: rotate(" + this.direction + "deg); ";
			style += "transform: rotate(" + this.direction + "deg); ";
			if (this.direction < 170 && this.direction > -170) {
				style += "transition: transform 0.5s ease-out; ";
			}
			if (device.desktop) {
				style += maxWidth;
			}

			if (this.beta > 45) {
				this.beta = 45;
			}
			if (this.beta < -45) {
				this.beta = -45;
			}
			//style += "-webkitTransform: rotateX(" + this.beta + "deg) ; ";
			//style += "-MozTransform: rotateX(" + this.beta + "deg) ; ";
			//style += "transform: rotateX(" + this.beta + "deg) ; ";

			if (this.gamma > 45) {
				this.gamma = 45;
			}
			if (this.gamma < -45) {
				this.gamma = -45;
			}
			//style += "-webkitTransform: rotateY(" + this.gamma + "deg) ; ";
			//style += "-MozTransform: rotateY(" + this.gamma + "deg) ; ";
			//style += "transform: rotateY(" + this.gamma + "deg) ; ";

			return style;
		},
		getSetDirection() {
			var str =
				" DIRECTION " +
				parseInt(this.direction) +
				"<br/> GETDIRECTION " +
				parseInt(this.getDirection) +
				"<br/>  WEBKIT " +
				parseInt(this.webkitCompassHeading) +
				"<br/>  ORIENTATION " +
				parseInt(this.orientation);
			return str;
		},
	},
	methods: {
		setDirection() {
			var dir = 0;
			var bearing = this.getDirection;
			if (this.webkitCompassHeading) {
				if (this.orientation == -90) {
					dir = 360 - this.webkitCompassHeading + 90 + bearing;
				} else if (this.orientation == 90) {
					dir = 360 - this.webkitCompassHeading - 90 + bearing;
				} else {
					dir = 360 - this.webkitCompassHeading + bearing;
				}
			}
			if (dir > 360) {
				dir = dir - 360;
			}
			if (dir > 180) {
				dir = dir - 360;
			}
			this.direction = dir;
			return;
		},
		getLocation() {
			var vue = this;
			if (this.permissionGranted != false) {

				if (!("geolocation" in navigator)) {
					this.errorStr = "Geolocation is not available.";
					vue.permissionGranted = false;
					return;
				}

				navigator.geolocation.getCurrentPosition(
					(pos) => {
						vue.permissionGranted = true;
						this.position = {
							latitude: pos.coords.latitude,
							longitude: pos.coords.longitude,
						};
					},
					(err) => {
						vue.permissionGranted = false;
						this.errorStr = err.message;
						console.log(this.errorStr);
					}
				);
			}
		},
		calcDirection() {
			if (this.position != null && this.compass.lat && this.compass.lng) {
				var b = this.bearing(
					this.position.latitude,
					this.position.longitude,
					this.compass.lat,
					this.compass.lng
				);
				return b;
			}
		},
		calcDistance() {
			if (this.position != null && this.compass.lat && this.compass.lng) {
				var n = this.calcCrow(
					this.position.latitude,
					this.position.longitude,
					this.compass.lat,
					this.compass.lng
				);
				var distance = Math.round(n * 1000);
				return distance;
			}
		},
		sheetClose() {
			clearInterval(this.location);
		},
		sheetOpen() {

			var vue = this;
			this.location = setInterval(function () {
				vue.getLocation();
				vue.setDirection();
			}, 40);

			this.compass = store.getters.getCompass();

			var vue = this;
			var orientation;
			if (device.ios) {
				if (typeof DeviceMotionEvent.requestPermission === "function") {
					DeviceMotionEvent.requestPermission()
						.then((response) => {
							if (response == "granted") {
								vue.permissionGranted = true;
								window.addEventListener(
									"deviceorientation",
									function (event) {
										vue.webkitCompassHeading =
											event.webkitCompassHeading;
										vue.beta = event.beta;
										vue.gamma = event.gamma;
									},
									false
								);
								console.log("orientation permission = true");
							} else {
								vue.permissionGranted = false;
								console.log("orientation permission = false");
							}
						})
						.catch(console.error);
				} else {
					window.addEventListener(
						"deviceorientation",
						function (event) {
							vue.webkitCompassHeading =
								event.webkitCompassHeading;
						},
						false
					);
				}
			} else {
				window.addEventListener(
					"deviceorientationabsolute",
					function (event) {
						if (event.webkitCompass) {
							vue.webkitCompassHeading =
								event.webkitCompassHeading;
						} else {
							vue.webkitCompassHeading = Math.abs(
								event.alpha - 360
							);
						}
					},
					false
				);
			}
			//DETECT DEVICE SCREEN ORIENTATION CHANGES
			window.addEventListener(
				"orientationchange",
				function () {
					vue.orientation = window.orientation;
					if (vue.orientation === 0) {
						vue.width = "90vw";
					} else {
						vue.width = "55vh";
					}
				},
				false
			);
		},
	},
	mounted() {
		console.log("Compass sheet loaded.");
	},
};
</script>
