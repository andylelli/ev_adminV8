<template>
	<div style="margin-bottom: 50px">
		<div style="height: 140px">
			<div :id="'reset-' + this.projectid" :style="resetMaxHeight">
				<segment header="Reset">
					<general-button
						class="margin-bottom"
						label="RESET COUNTS"
						width="200"
						colour="red"
						type="fill"
						@generalButtonAction="resetScoreboard()"
					></general-button>
				</segment>
			</div>
			<div :id="'update-' + this.projectid" :style="updateMaxHeight">
				<segment header="Update">
					<general-button
						class="margin-bottom"
						label="UPDATE POINTS"
						width="200"						
						type="fill"
						@generalButtonAction="getScoreboardscores()"
					></general-button>
				</segment>
			</div>
		</div>
		<f7-block-header>SCOREBOARD ACTIONS</f7-block-header>
		<f7-list list class="no-margin-bottom no-hairline">
			<f7-list-item
				:title="'Set scoreboard as live?'"
				class="no-hairline"
			>
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'stop-circle']"
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
	</div>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { Dom7 } from "framework7";
var $$ = Dom7;

import misc from "../../../mixins/misc";
import login from "../../../mixins/login";
import fetch from "../../../mixins/fetch";

import segment from "../../misc/segment.vue";
import generalButton from "../../misc/generalButton.vue";

export default {
	name: "scoreboard-actions",
	data() {
		return {
			eventid: store.state.eventid,
		};
	},
	props: {
		projectid: Number,
	},
	components: {
		generalButton,
		segment,
	},
	mixins: [misc, login, fetch],
	computed: {
		getScoreboard() {
			var item = {
				table: "scoreboard",
				key: "projectid",
				id: this.projectid,
				type: "single",
			};
			return store.getters.getData(item);
		},
		toggleState() {
			var scoreboard = this.getScoreboard;
			if (scoreboard) {
				var value = scoreboard.scoreboard_live;
				if (value == true) {
					return true;
				} else {
					return false;
				}
			} else return false;
		},
		resetMaxHeight() {
			if (this.getScoreboard) {
				var scoreboardLive = this.getScoreboard.scoreboard_live;
				var height;
				if (scoreboardLive == 1) {
					height = 0;
				} else {
					height = "150px";
				}
				var z =
					"max-height:" +
					height +
					"; overflow: hidden; transition: max-height 0.4s ease-out";
				return z;
			}
		},
		updateMaxHeight() {
			if (this.getScoreboard) {
				var scoreboardLive = this.getScoreboard.scoreboard_live;
				var height;
				if (scoreboardLive == 0) {
					height = 0;
				} else {
					height = "150px";
				}
				var z =
					"max-height:" +
					height +
					"; overflow: hidden; transition: max-height 0.4s ease-out";
				return z;
			}
		},
	},
	methods: {
		async getScoreboardscores() {
			var tables = ["scoreboardscore"];
			var fullSync = true;
			var getDeletes = true;

			f7.preloader.show();

			await this.syncGetFromWebServer(
				this.eventid,
				tables,
				fullSync,
				getDeletes
			);

			f7.preloader.hide();

			var toast = f7.toast.create({
				text: "Points updated",
				position: "center",
				closeTimeout: 1500,
			});
			toast.open();
		},
		isChecked() {
			if (this.toggleState === false) {
				return false;
			} else {
				return true;
			}
		},
		toggle(event) {
			var value;
			if (event === true) {
				value = 1;
				//
			} else {
				value = 0;
				//$("#scoreboard-fab-vue").hide();
			}

			var id = "reset-" + this.projectid;
			this.accordianSlide(id, 0);

			new Date();
			var unixtime = Date.now() / 1000;
			var item = {};
			item.table = "scoreboard";
			item.json = this.getScoreboard;
			item.json.scoreboard_live = value;
			item.json.scoreboard_unixtime = unixtime;
			store.dispatch("updateItemApp", item);
		},
		resetScoreboard() {
			var vue = this;
			var scoreboardid = this.getScoreboard.scoreboard_id;
			var message =
				"Are you sure you want to reset the scoreboard points?";
			f7.dialog.confirm(message, async function () {
				f7.preloader.show();

				var url =
					store.state.url +
					"api/delete-all/scoreboardscore/scoreboard/" +
					scoreboardid;

				var method = "DELETE";
				var response = await vue.fetch(url, method);

				//Check if the network is too slow
				if (vue.networkError(response) == true) {
					return false;
				}

				if (response[0].status == "success") {
					if (response[0].count == 0) {
						f7.preloader.hide();
						var message = "Scoreboard counts already reset.";
						f7.dialog.alert(message);
					} else {
						var item = {
							table: "scoreboardscore",
							key: "scoreboardid",
							id: scoreboardid,
						};

						store.dispatch("deleteAllApp", item);
						store.dispatch("deleteAllDB", item);

						f7.preloader.hide();
						var message = "Scoreboard counts reset.";
						f7.dialog.alert(message);
					}
				} else {
					var message = "Scoreboard counts couldn't be reset.";
					f7.preloader.hide();
					f7.dialog.alert(message);
				}
			});
		},
	},
	mounted() {},
};
</script>

<style>
</style>