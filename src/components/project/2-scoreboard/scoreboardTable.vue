<template>
	<div>
		<f7-block-header>SCOREBOARD</f7-block-header>
		<div class="data-table" style="background-color: white">
			<table>
				<thead>
					<tr>
						<th class="label-cell">Pos</th>
						<th class="label-cell">Guest</th>
						<th class="numeric-cell">Points</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(score, index) in this.getScoreboardscores"
						:key="index"
					>
						<td
							class="label-cell"
							v-html="score.scoreboardscore_position"
						></td>
						<td
							class="label-cell"
							v-html="
								getGuestName(
									score.scoreboardscore_firstname,
									score.scoreboardscore_guestid
								)
							"
						></td>
						<td
							class="numeric-cell"
							v-html="score.scoreboardscore_count"
						></td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import store from "../../../vuex/store.js";

import { Dom7 } from "framework7";
var $$ = Dom7;

import misc from "../../../mixins/misc";
import login from "../../../mixins/login";

import segment from "../../misc/segment.vue";
import generalButton from "../../misc/generalButton.vue";

export default {
	name: "scoreboard-table",
	data() {
		return {
			eventid: store.state.eventid,
			guest: store.state.guest,
		};
	},
	props: {
		projectid: Number,
	},	
	components: {
		generalButton,
		segment,
	},
	mixins: [misc, login],
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
		getScoreboardscore() {
			if (this.getScoreboard) {
				var item = {
					table: "scoreboardscore",
					key: "scoreboardid",
					id: this.getScoreboard.scoreboard_id,
					type: "multiple",
				};
				return store.getters.getData(item);
			}
		},
		getScoreboardscores() {
			if (this.getScoreboardscore) {
				var scores = this.getScoreboardscore;

				//Sort by scoreboardscore_count
				scores.sort(function (a, b) {
					return b.scoreboardscore_count - a.scoreboardscore_count;
				});

				var len = scores.length;

				//Replace equal positions with '='' sign
				for (var i = 0; i < len; i++) {
					if (i > 0) {
						var j = i - 1;
						if (
							scores[i].scoreboardscore_count ==
							scores[j].scoreboardscore_count
						) {
							scores[i].scoreboardscore_position = "=";
						} else {
							scores[i].scoreboardscore_position = i + 1;
						}
					} else {
						scores[i].scoreboardscore_position = i + 1;
					}
				}

				//Add Guest Name
				for (var i = 0; i < len; i++) {
					var guestid = scores[i].scoreboardscore_guestid;

					var guest = this.guest.filter(function (result) {
						return result.guest_id === guestid;
					});
					if (guest.length == 1) {
						scores[i].scoreboardscore_firstname =
							guest[0].guest_firstname;
						scores[i].scoreboardscore_lastname =
							guest[0].guest_lastname;
					} else {
						scores[i].scoreboardscore_firstname = "Guest";
						scores[i].scoreboardscore_lastname = "Deleted";
					}
				}
				return scores;
			}
		},
	},
	methods: {
		getGuestName(firstname, lastname) {
			return firstname + " - " + lastname;
		},
	},
	mounted() {},
};
</script>

<!-- <style scoped>

</style>-->