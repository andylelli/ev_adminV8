<template>
	<f7-sheet
		class="c3-import-scanner"
		style="height: 94%"
		swipe-to-close
		backdrop
		@sheet:open="redraw()"
		@sheet:closed="scannerActive = false"
	>
		<f7-page-content>
			<f7-navbar class="text-align-center" title="Import Schedule"></f7-navbar>
			<f7-block>
				<div id="camera" align="center" class="imageWrap">
					<qrcode-stream
						v-if="isScannerActive"
						@decode="onDecode"
					></qrcode-stream>
				</div>
			</f7-block>
		</f7-page-content>
	</f7-sheet>
</template>

<script>

import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { Dom7 } from "framework7";
var $$ = Dom7;

import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from "vue3-qrcode-reader";

import misc from "../../mixins/misc";

export default {
	name: "sheet-import-schedule",
	data() {
		return {
			appurl: store.state.url,
			eventid: store.state.event[0].event_id,
			event: store.state.event[0],
			project: store.state.project,
			directory: store.state.directory,
			directoryentry: store.state.directoryentry,
			delimitedString: "",
			scannerActive: false,
			delimitedString: "",
			size: 375,
		};
	},
	mixins: [misc],
	components: {
		QrcodeStream,
		QrcodeDropZone,
		QrcodeCapture,
	},
	computed: {
		isScannerActive() {
			return this.scannerActive;
		},
	},
	methods: {
		eventName() {
			return store.state.event[0].event_name;
		},		
		click() {
			$$(".imageWrap").addClass("shutterClick");
			setTimeout(function () {
				$$(".imageWrap").removeClass("shutterClick");
			}, 900);
		},
		async importData(data) {
			var daysData = [];
			var getDateSplit = [];

			data = data.replaceAll("<br/>", "");
			data = data.replaceAll("<div>", "");
			data = data.replaceAll("</div>", "");
			data = data.replaceAll("\r", "");

			daysData = data.split("START");
			daysData.shift();
			getDateSplit = daysData[0].split("|");
			var day = this.formatDateLower(getDateSplit[1]);

			await daysData.forEach((dayData) => {
				store.dispatch("importDirectoryentryNamesApp", dayData);
				store.dispatch("importDirectoryentryNamesDB", dayData);
			});

			var setEventDates = false;
			var eventDates = store.getters.getLookup("hidden-qr-dates");

			eventDates.forEach((eventDate) => {
				if (eventDate.date == getDateSplit[1]) {
					eventDate.hasSchedule = 1;
				} else if (getDateSplit[1] == "ALL") {
					setEventDates = true;
				}
			});

			if (setEventDates == true) {
				eventDates = [
					{
						date: "ALL",
						hasSchedule: 1,
					},
				];
			}

			new Date();
			var unixtime = Date.now() / 1000;

			var item = {
				json: {
					lookup_id: "hidden-qr-dates",
					lookup_value: eventDates,
					lookup_eventid: this.eventid,
					lookup_unixtime: unixtime,
				},
			};
			//await store.dispatch("deleteLookupDB", "hidden-qr-dates");

			item = JSON.parse(JSON.stringify(item));

			store.dispatch("insertLookupApp", item);
			store.dispatch("insertLookupDB", item);

			f7.sheet.close(".c3-import-scanner");

			setTimeout(() => {
				f7.sheet.open(".c3-import");
				var title = f7.params.name;
				if (this.event.event_hideqrtype == 2) {
					
					f7.dialog.alert("Schedule names imported for " + day, title);
				} else {
					var eventName = store.state.event[0].event_name;
					f7.dialog.alert(
						"Schedule names imported for " + eventName, title
					);
				}
			}, 400);
		},
		createImportString() {
			var directoryentries = store.state.directoryentry;
			const len = directoryentries.length;

			for (var i = 0; i < len; i++) {
				string = string + directoryentries[i].directoryentry_id + "#";
				string = string + directoryentries[i].directoryentry_name;
				if (i < len - 1) {
					string = string + "|";
				}
			}
			this.delimitedString = string;
		},
		getHiddenDirectories() {
			var hiddenDirectoryIds = this.directory.filter(function (result) {
				return (
					result.directory_scheduleid == 1 &&
					result.directory_hidenames == 1
				);
			});
			return hiddenDirectoryIds;
		},
		redraw() {
			this.scannerActive = true;
			setTimeout(function () {
				var camera = document.getElementById("camera");
				camera.style.display = "none";
				camera.offsetHeight; // no need to store this anywhere, the reference is enough
				camera.style.display = "block";
			}, 2000);
		},
		async onDecode(decodedString) {
			this.click();
			setTimeout(() => {
				var isValid = decodedString.substring(0, 5);
				if (isValid == "START") {
					f7.sheet.close(".c3-import-scanner");
					this.importData(decodedString);
				} else {
					f7.dialog.close();
					f7.dialog.alert("QR Code not recognised!", this.eventName());
				}
			}, 750);
		},
	},
	mounted() {
		console.log("Import Scanner loaded.");
	},
};
</script>

<style scoped>
/* ShutterClick animation
 * adds a camera flash effect using an animated inset box shadow
 */
.shutterClick {
	animation: cameraFlash 0.3s 0.3s alternate-reverse 1;
}
@keyframes cameraFlash {
	from {
		box-shadow: 0;
	}
	to {
		box-shadow: inset 0 0 0 200px #fff;
	}
}

.bgImage,
.imageWrap {
	display: inline-block;
	cursor: pointer;
	vertical-align: middle;
	height: 90vw;
	width: 90vw;
	background-color: #999;
	z-index: 99999;
}
.imageWrap {
	position: relative;
}
.imageWrap:before {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 99999;
}
.imageWrap.shutterClick:before {
	content: "";
	animation: cameraFlash 0.3s 0.3s alternate-reverse 1;
	z-index: 99999;
}
</style>
