<template>
	<div>
		<f7-block-header>REVEAL NAMES BY QR</f7-block-header>
		<f7-list>
			<f7-list-item
				radio
				radio-icon="end"
				title="1 QR Code for event"
				name="qr"
				value="1"
				:checked="this.isCheckedHideQrType(1)"
				@change="radioHideQrType($event.target.value)"
			>
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'qrcode']" /></f7-icon></template
			></f7-list-item>
			<f7-list-item
				radio
				radio-icon="end"
				title="1 QR Code per day"
				name="qr"
				value="2"
				:checked="this.isCheckedHideQrType(2)"
				@change="radioHideQrType($event.target.value)"
			>
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'qrcode']"
						/>
					</f7-icon> </template
			></f7-list-item>
		</f7-list>
		<f7-list v-if="this.getHiddenDirectories().length > 0">
			<f7-list-item title="Create QR code(s)">
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'qrcode']"
						/> </f7-icon
				></template>
				<f7-button fill class="color-green" @click="createQrCodes()"
					>CREATE</f7-button
				>
			</f7-list-item>
			<f7-list-item title="Import Lineup from string">
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'text']"
						/>
					</f7-icon>
				</template>
				<f7-button
					fill
					class="color-green"
					@click="importData(importString)"
					>IMPORT</f7-button
				>
			</f7-list-item>
		</f7-list>
		<div v-if="this.getHiddenDirectories().length > 0">
			<div v-for="(item, i) in this.delimitedString" :key="i">
				<f7-block-header
					><div v-html="getQrCodeDate(item)"></div
				></f7-block-header>
				<p class="text-align-center" style="margin-bottom: 30px">
					<qrcode-vue
						:value="item"
						:size="size"
						:margin="margin"
						level="L"
					></qrcode-vue>
				</p>
			</div>
			<f7-text-editor
				:value="getDelimitedStrings(delimitedString)"
				@texteditor:change="(value) => (importString = value)"
				placeholder="Enter data..."
				:buttons="[[]]"
			>
			</f7-text-editor>
		</div>
	</div>
</template>

<script>
import QrcodeVue from "qrcode.vue";

import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import misc from "../../mixins/misc";
import fetch from "../../mixins/fetch";
import newItem from "../../mixins/newItem";

export default {
	name: "event-settings-hidenames",
	data() {
		return {
			userid: store.state.userid,
			eventid: store.state.eventid,
			event: store.state.event[0],
			project: store.state.project,
			directory: store.state.directory,
			directoryentry: store.state.directoryentry,
			delimitedString: [],
			qrString: "",
			importString: "",
			size: 375,
			margin: 4,
		};
	},
	mixins: [misc, fetch, newItem],
	components: {
		QrcodeVue,
	},
	computed: {
		getEvent() {
			if (store.state.event.length > 0) {
				return store.state.event[0];
			} else {
				return false;
			}
		},
	},
	methods: {
		isCheckedHideQrType(value) {
			var eventHideQrType = this.getEvent.event_hideqrtype;
			if (eventHideQrType == value) {
				return true;
			} else {
				return false;
			}
		},
		async radioHideQrType(value) {
			new Date();
			var unixtime = Date.now() / 1000;

			//Update Directory
			var item = {};
			item.table = "event";
			item.json = this.getEvent;
			item.json.event_hideqrtype = parseInt(value);
			item.json.event_unixtime = unixtime;
			store.dispatch("updateItemApp", item);

			this.createQrCodes();
		},
		getDelimitedStrings() {
			var len = this.delimitedString.length;
			var string = "";
			var qrString = "";
			for (var i = 0; i < len; i++) {
				qrString = qrString + this.delimitedString[i];
				string = string + this.delimitedString[i];
				string = string + "<br/>";
			}
			this.qrString = qrString;
			//lookup (remove this.qrString)
			return string;
		},
		getQrCodeDate(importString) {
			var importArray = importString.split("|");
			return importArray[1];
		},
		async importData(data) {
			var daysData = [];

			data = data.replaceAll("<br/>", "");
			data = data.replaceAll("<div>", "");
			data = data.replaceAll("</div>", "");
			data = data.replaceAll("\r", "");

			daysData = data.split("START");
			daysData.shift();

			await daysData.forEach((dayData) => {
				store.dispatch("importDirectoryentryNamesApp", dayData);
				store.dispatch("importDirectoryentryNamesDB", dayData);
			});

			var unixtime = Date.now() / 1000;
			localStorage.admin_update_directoryentry_time = unixtime;

			f7.dialog.close();
			f7.dialog.alert("Schedule names imported");
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
		getHiddenDirectoryentries(hiddenDirectoryIds, day) {
			var directoryentries = this.directoryentry;
			var items = [];
			var len;

			hiddenDirectoryIds.forEach((directory) => {
				if (day == "ALL" && directory.directory_hidetype == 0) {
					var hiddenDirectoryentries = directoryentries.filter(
						(result) =>
							result.directoryentry_directoryid ==
							directory.directory_id
					);
				} else if (day == "ALL" && directory.directory_hidetype == 1) {
					var hiddenDirectoryentries = directoryentries.filter(
						(result) =>
							result.directoryentry_directoryid ==
								directory.directory_id &&
							result.directoryentry_schedulehide == 1
					);
				} else if (directory.directory_hidetype == 0) {
					var hiddenDirectoryentries = directoryentries.filter(
						(result) =>
							result.directoryentry_directoryid ==
								directory.directory_id &&
							result.directoryentry_day == day
					);
				} else if (directory.directory_hidetype == 1) {
					var hiddenDirectoryentries = directoryentries.filter(
						(result) =>
							result.directoryentry_directoryid ==
								directory.directory_id &&
							result.directoryentry_day == day &&
							result.directoryentry_schedulehide == 1
					);
				}

				len = hiddenDirectoryentries.length;
				for (var i = 0; i < len; i++) {
					items.push(hiddenDirectoryentries[i]);
				}
			});

			return items;
		},
		createString(day, data) {
			var str = "START|" + day + "|";
			var len = data.length;

			function append(str, i, len) {
				str = str + data[i].directoryentry_id + "#";
				str = str + data[i].directoryentry_name;
				if (i < len - 1) {
					str = str + "|";
				}
				return str;
			}

			for (var i = 0; i < len; i++) {
				str = append(str, i, len);
			}

			this.delimitedString.push(str);

			return;
		},
		async createQrCodes() {
			this.delimitedString = [];

			var hiddenDirectoryIds = this.getHiddenDirectories();

			//ALL
			if (this.getEvent.event_hideqrtype == 1) {
				var day = "ALL";
				var hiddenDirectoryentries = this.getHiddenDirectoryentries(
					hiddenDirectoryIds,
					day
				);
				this.createString(day, hiddenDirectoryentries);
			}

			//BY DAY
			if (this.getEvent.event_hideqrtype == 2) {
				var eventDates = this.getEventDates();
				var eventLength = eventDates.length;
				var day;

				for (var i = 0; i < eventLength; i++) {
					day = eventDates[i];

					var hiddenEntriesDay = this.getHiddenDirectoryentries(
						hiddenDirectoryIds,
						day
					);
					this.createString(day, hiddenEntriesDay);
				}
			}

			var delimitedStringify = JSON.stringify(this.delimitedString);
			var lookup = {
				id: "schedule-qr-codes",
				value: delimitedStringify,
				eventid: this.eventid,
			};
			this.newItem(lookup, "lookup", false);
		},
		async deleteNames() {
			await this.createQrCodes();
			var hiddenDirectories = this.getHiddenDirectories();
			var projectName;

			await hiddenDirectories.forEach((directory) => {
				if (directory.directory_hidetype == 0) {
					store.dispatch(
						"deleteDirectoryentryNamesApp",
						directory
					);
					store.dispatch(
						"deleteDirectoryentryNamesDB",
						directory
					);
				} else if (directory.directory_hidetype == 1) {
					store.dispatch(
						"deleteDirectoryentryNamesItemApp",
						directory
					);
					store.dispatch(
						"deleteDirectoryentryNamesItemDB",
						directory
					);
				}

				var project = this.project.filter(
					(result) =>
						result.project_id == directory.directory_projectid
				);

				projectName = project[0].project_name;
				console.log(
					"Directoryentry schedule names for " +
						projectName +
						" removed"
				);
			});

			var unixtime = Date.now() / 1000;
			localStorage.admin_update_directoryentry_time = unixtime;

			f7.dialog.alert("Schedule names removed");
		},
		scheduleMaxHeight() {
			var scheduleid = this.getDirectory.directory_scheduleid;
			var hidenames = this.getDirectory.directory_hidenames;
			var height;
			if (scheduleid == 0 && hidenames == 0) {
				height = 0;
			} else if (scheduleid == 1 && hidenames == 0) {
				height = "80px";
			} else if (scheduleid == 1 && hidenames == 1) {
				height = "540px";
			} else {
				height = 0;
			}
			var z =
				"max-height:" +
				height +
				"; overflow: hidden; transition: max-height 0.4s ease-out";
			return z;
		},
	},
	mounted() {
		var vue = this;
		f7ready((f7) => {
			vue.delimitedString =
				store.getters.getLookup("schedule-qr-codes");
		});
	},
};
</script>

<!-- <style scoped>

</style>-->