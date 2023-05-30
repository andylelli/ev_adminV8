<template>
	<div>
		<f7-block-header>DATE / TIME</f7-block-header>
		<f7-list>
			<f7-list-item title="Dates">
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'calendar']"
						/>
					</f7-icon>
				</template>
				<div align="right">
					<input
						style="text-align: right; height: 18px; cursor: pointer"
						type="text"
						placeholder="Select..."
						readonly="readonly"
						id="date-range"
					/>
				</div>
			</f7-list-item>
			<f7-list-item title="End time">
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'clock']"
						/>
					</f7-icon>
				</template>
				<div align="right">
					<input
						style="text-align: right; height: 18px; cursor: pointer"
						type="text"
						placeholder="Select..."
						readonly="readonly"
						id="end-time"
					/>
				</div>
			</f7-list-item>
		</f7-list>
	</div>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

export default {
	name: "event-settings-date-time",
	data() {
		return {};
	},
	inject: ["eventBus"],
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
	},
	methods: {
		changeEventName() {
			var json = {
				table: "event",
				id: this.getEvent.event_id,
				data: {
					name: this.getEvent.event_name,
				},
			};
			this.eventBus.emit("edit-event", json);
		},
	},
	mounted() {
		f7ready((f7) => {
			var vue = this;

			////////////////////////////
			// UI - Calendar
			// Event start / end date
			//////////////////////////

			var calendarRange = f7.calendar.create({
				inputEl: "#date-range",
				rangePicker: true,
				on: {
					change: function (calendar, values, displayValues) {
						var from = calendar.value[0];
						var to = calendar.value[1];

						var from_conv = new Date(from);
						var to_conv = new Date(to);

						var from_year = from_conv.getFullYear().toString();
						var from_month = (from_conv.getMonth() + 1).toString();
						var from_day = from_conv.getDate().toString();
						if (from_month.length < 2)
							from_month = "0" + from_month;
						if (from_day.length < 2) from_day = "0" + from_day;

						var to_year = to_conv.getFullYear().toString();
						var to_month = (to_conv.getMonth() + 1).toString();
						var to_day = to_conv.getDate().toString();
						if (to_month.length < 2) to_month = "0" + to_month;
						if (to_day.length < 2) to_day = "0" + to_day;

						from = from_year + from_month + from_day;
						if (!isNaN(to_day)) {
							to = to_year + to_month + to_day;
						} else {
							to = from;
						}

						new Date();
						var unixtime = Date.now() / 1000;
						var item = {};
						item.table = "event";
						item.json = vue.getEvent;
						item.json.event_startdate = from;
						item.json.event_enddate = to;
						item.json.event_unixtime = unixtime;
						store.dispatch("updateItemApp", item);
					},
				},
			});

			var startDate = this.getEvent.event_startdate;
			var endDate = this.getEvent.event_enddate;

			if (startDate != "" && endDate != "") {
				var start_year = startDate.substring(0, 4);
				var start_month = startDate.substring(4, 6);
				var start_day = startDate.substring(6, 8);

				var end_year = endDate.substring(0, 4);
				var end_month = endDate.substring(4, 6);
				var end_day = endDate.substring(6, 8);

				startDate = start_year + "-" + start_month + "-" + start_day;
				endDate = end_year + "-" + end_month + "-" + end_day;

				var start_date = new Date(startDate);
				var end_date = new Date(endDate);

				calendarRange.setValue([start_date, end_date]);
			}

			////////////////////////////
			// UI - Time picker
			// Daily end time
			//////////////////////////

			var endTime = f7.picker.create({
				inputEl: "#end-time",
				rotateEffect: true,

				formatValue: function (values, displayValues) {
					return values[0] + ":" + values[1];
				},

				cols: [
					{
						values: "00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23".split(
							" "
						),
					},
					{
						divider: true,
						content: "&nbsp;:&nbsp;",
					},
					{
						values: "00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59".split(
							" "
						),
					},
				],
				on: {
					change: function (picker, values, displayValues) {
						new Date();
						var unixtime = Date.now() / 1000;
						var item = {};
						item.table = "event";
						item.json = vue.getEvent;
						item.json.event_dailyendtime =
							picker.value[0] + picker.value[1];
						item.json.event_unixtime = unixtime;
						store.dispatch("updateItemApp", item);
					},
				},
			});

			var endHour = vue.getEvent.event_dailyendtime.substring(0, 2);
			var endMinute = vue.getEvent.event_dailyendtime.substring(2, 4);

			if (endHour !== "" && endMinute !== "") {
				endTime.setValue([endHour, endMinute]);
			}
		});
	},
};
</script>

<!-- <style scoped>

</style>-->