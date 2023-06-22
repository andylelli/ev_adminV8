<template>
	<div class="list simple-list no-margin-top">
		<ul>
			<!-- SCHEDULE PICKER -->
			<li>
				<div class="item-media">
					<i class="icon">
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'clock']"
						/>
					</i>
				</div>
				<div class="c3-flex-space-full-width">
					<div style="padding-left: 20px">Schedule</div>
					<div align="right">
						<input
							class="text-align-right"
							style="cursor: pointer"
							type="text"
							placeholder="Choose..."
							readonly="readonly"
							id="schedule-picker"
						/>
					</div>
				</div>
			</li>
			<li
				v-if="this.getDirectory.directory_hidetype == 1 && this.getDirectory.directory_hidenames == 1"
				class="item-content"
			>
				<div class="item-media">
					<i class="icon">
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'eye-slash']"
						/>
					</i>
				</div>
				<div style="padding-left: 20px">Hide name?</div>
				<div class="item-after">
					<f7-toggle
						:checked="this.isCheckedScheduleHide()"
						color="custom-color"
						@toggle:change="toggleScheduleHide($event)"
					></f7-toggle>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import misc from "../../../mixins/misc";

export default {
	name: "directoryentry-schedule",
	data() {
		return {
			eventid: store.state.eventid,
			event: store.state.event[0],
			pickerSchedule: null,
			eventLength: 0,
			dayList: "", // eg Tue 30th|Wed 31st|Thu 01st etc
			yyyymmddArr: [], // eg ["20210330", "20210331", "20210401"]
			dayArr: [], // eg ["Tue 30th", "Wed 31st", "Thu 01st"]
		};
	},
	props: {
		directoryentryid: Number,
	},
	mixins: [misc],
	computed: {
		getDirectoryentry() {
			var item = {
				table: "directoryentry",
				key: "id",
				id: this.directoryentryid,
				type: "single",
			};
			return store.getters.getData(item);
		},
		getDirectory() {
			if (this.getDirectoryentry) {
				var directoryid =
					this.getDirectoryentry.directoryentry_directoryid;
				if (directoryid) {
					var find = store.state.directory.filter(function (result) {
						return result.directory_id === directoryid;
					});
					if (find.length > 0) {
						return find[0];
					}
				}
			}
		},
	},
	methods: {
		isCheckedScheduleHide() {
			if (this.getDirectoryentry.directoryentry_schedulehide === 1) {
				return true;
			} else {
				return false;
			}
		},
		isCheckedSchedule() {
			if (this.getDirectory) {
				if (this.getDirectory.directory_scheduleid === 1) {
					return true;
				}
			}
		},
		toggleScheduleHide(event) {
			new Date();
			var unixtime = Date.now() / 1000;

			var value;
			if (event === true) {
				value = 1;
			} else {
				value = 0;
			}
			var item = {};
			item.table = "directoryentry";
			item.json = this.getDirectoryentry;
			item.json.directoryentry_schedulehide = value;
			item.json.directoryentry_unixtime = unixtime;
			store.dispatch("updateItemApp", item);
		},
		getOrdinalNum(n) {
			return (
				n +
				(n > 0
					? ["th", "st", "nd", "rd"][
							(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10
					  ]
					: "")
			);
		},
		setValue() {
			var parentid = this.getDirectoryentry.directoryentry_parententryid;
			return parentid;
		},
		initialiseVariables() {
			//Get start date YYYY, MM, DD
			var startdate_Y = this.event.event_startdate.substring(0, 4);
			var startdate_M = this.event.event_startdate.substring(4, 6) - 1;
			var startdate_D = this.event.event_startdate.substring(6, 8);

			//Get end date YYYY, MM, DD
			var enddate_Y = this.event.event_enddate.substring(0, 4);
			var enddate_M = this.event.event_enddate.substring(4, 6) - 1;
			var enddate_D = this.event.event_enddate.substring(6, 8);

			//Create start date and end date objects
			var start = new Date(startdate_Y, startdate_M, startdate_D);
			var end = new Date(enddate_Y, enddate_M, enddate_D);

			//Calculate length of event
			var res = Math.abs(end - start) / 1000;
			var days = Math.floor(res / 86400);
			var eventLength = days + 1;

			const dofw = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

			//Create arrays for picker values and labels
			for (var i = 0; i < eventLength; i++) {
				var j = i + 1;

				var date = start.getDate();
				if (date.toString().length == 1) {
					date = "0" + date.toString();
				}
				var month = parseInt(start.getMonth()) + 1;
				if (month.toString().length == 1) {
					month = "0" + month.toString();
				}
				var year = start.getFullYear();
				var dateTH = this.getOrdinalNum(date);
				var d = dofw[start.getDay()];
				this.dayList = this.dayList + d + " " + dateTH + "|";
				this.dayArr[i] = d + " " + dateTH;
				this.yyyymmddArr[i] =
					year.toString() + month.toString() + date.toString();
				start.setDate(start.getDate() + 1);
			}
			// Remove last pipe |
			this.dayList = this.dayList.substring(0, this.dayList.length - 1);
		},
		initialisePicker() {
			var vue = this;
			this.pickerSchedule = f7.picker.create({
				inputEl: "#schedule-picker",
				rotateEffect: true,

				formatValue: function (values, displayValues) {
					return values[0] + ", " + values[1] + ":" + values[2];
				},

				cols: [
					{
						textAlign: "left",
						values: vue.dayList.split("|"),
					},
					{
						divider: true,
						content: "&nbsp;&nbsp",
					},
					{
						values: (function () {
							var arr = [];
							for (var i = 0; i <= 23; i++) {
								var j = i;
								if (j < 10) {
									j = "0" + j;
								}
								arr.push(j);
							}
							return arr;
						})(),
					},
					{
						divider: true,
						content: "&nbsp;:&nbsp;",
					},
					{
						values: (function () {
							var arr = [];
							for (var i = 0; i <= 59; i++) {
								var j = i;
								if (j < 10) {
									j = "0" + j;
								}
								arr.push(j);
							}
							return arr;
						})(),
					},
				],
				on: {
					change: function (picker, values, displayValues) {
						vue.pickerChange(picker);
					},
				},
			});
		},
		setPicker() {
			var schedulePickerDay = this.getDirectoryentry.directoryentry_day;
			var schedulePickerHour = this.getDirectoryentry.directoryentry_hour;
			var schedulePickerMinute =
				this.getDirectoryentry.directoryentry_minute;
			if (schedulePickerDay) {
				if (schedulePickerHour < 10 && schedulePickerHour.length < 2) {
					schedulePickerHour = "0" + schedulePickerHour;
				}
				if (
					schedulePickerMinute < 10 &&
					schedulePickerMinute.length < 2
				) {
					schedulePickerMinute = "0" + schedulePickerMinute;
				}

				var YYYY = schedulePickerDay.substring(0, 4);
				var MM = schedulePickerDay.substring(4, 6) - 1;
				var DD = schedulePickerDay.substring(6, 8);

				var day = new Date(YYYY, MM, DD);
				var dateTH = this.getOrdinalNum(DD);
				const dofw = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
				var d = dofw[day.getDay()];
				var day = d + " " + dateTH;
				var values = [day, schedulePickerHour, schedulePickerMinute];
				this.pickerSchedule.setValue(values);
			}
		},
		pickerChange(picker) {
			var pickerDay = picker.value[0];
			var index = this.dayArr.indexOf(pickerDay);
			var day = this.yyyymmddArr[index];
			new Date();
			var unixtime = Date.now() / 1000;
			var item = {};
			item.table = "directoryentry";
			item.json = this.getDirectoryentry;
			item.json.directoryentry_day = day;
			item.json.directoryentry_hour = picker.value[1];
			item.json.directoryentry_minute = picker.value[2];
			item.json.directoryentry_unixtime = unixtime;
			store.dispatch("updateItemApp", item);
		},
	},
	mounted() {
		f7ready((f7) => {
			if (this.isCheckedSchedule() === true) {
				this.initialiseVariables();
				this.initialisePicker();
				this.setPicker();
			}
		});
	},
};
</script>

<style>
.ios {
	--f7-picker-sheet-bg-color: #ffffff;
}
.md {
	--f7-picker-sheet-bg-color: #ffffff;
}
.c3-item-input-wrap {
	width: auto important;
}
.c3-flex-space-full-width {
	display: flex;
	flex: 1 1 0;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
}
</style>