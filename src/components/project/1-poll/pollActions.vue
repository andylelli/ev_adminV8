<template>
	<div style="margin-bottom: 50px">
		<div style="height: 140px">
			<div :id="'reset-' + this.projectid" :style="resetMaxHeight">
				<segment header="Reset">
					<general-button class="margin-bottom" label="RESET COUNTS" width="200" colour="red" type="fill"
						@generalButtonAction="resetPoll()"></general-button>
				</segment>
			</div>
			<div :id="'update-' + this.projectid" :style="updateMaxHeight">
				<segment header="Update">
					<general-button class="margin-bottom" label="UPDATE COUNTS" width="200" type="fill"
						@generalButtonAction="getPollscores('updated')"></general-button>
				</segment>
			</div>
		</div>
		<f7-block-header>POLL ACTIONS</f7-block-header>
		<f7-list list class="no-margin-bottom no-hairline">
			<f7-list-item :title="'Set poll as live?'" class="no-hairline">
				<template #media>
					<f7-icon>
						<font-awesome-icon class="fa-fw custom-colour" style="font-size: 20px"
							:icon="['fal', 'stop-circle']" /> </f7-icon></template>
				<f7-toggle :checked="this.isChecked()" @toggle:change="toggle($event)"></f7-toggle>
			</f7-list-item>
		</f7-list>
	</div>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import misc from "../../../mixins/misc";
import login from "../../../mixins/login";
import fetch from "../../../mixins/fetch";

import segment from "../../misc/segment.vue";
import generalButton from "../../misc/generalButton.vue";

export default {
	name: "poll-actions",
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
		getPoll() {
			var item = {
				table: "poll",
				key: "projectid",
				id: this.projectid,
				type: "single",
			};
			return store.getters.getData(item);
		},
		toggleState() {
			var poll = this.getPoll;
			if (poll) {
				var value = poll.poll_live;
				if (value == true) {
					return true;
				} else {
					return false;
				}
			} else return false;
		},
		resetMaxHeight() {
			if (this.getPoll) {
				var pollLive = this.getPoll.poll_live;
				var height;
				if (pollLive == 1) {
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
			if (this.getPoll) {
				var pollLive = this.getPoll.poll_live;
				var height;
				if (pollLive == 0) {
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
		async getPollscores(action) {
			var tables = ["pollscore"];
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

			var text = "Counts " + action;

			var toast = f7.toast.create({
				text: text,
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
			} else {
				value = 0;
			}

			var id = "reset-" + this.projectid;
			this.accordianSlide(id, 0);

			new Date();
			var unixtime = Date.now() / 1000;
			var item = {};
			item.table = "poll";
			item.json = this.getPoll;
			item.json.poll_live = value;
			item.json.poll_unixtime = unixtime;
			store.dispatch("updateItemApp", item);
		},
		resetPoll() {
			var vue = this;
			var pollid = this.getPoll.poll_id;
			var message = "Are you sure you want to reset the poll counts?";
			f7.dialog.confirm(message, async function () {
				f7.preloader.show();

				// Parameters
				var url = store.state.url + "api/delete-all/pollscore/poll/" + pollid;
				var method = "DELETE";
				var response = await vue.fetch(url, method);

				//Check if the network is too slow
				if (vue.networkError(response) == true) {
					return false;
				}

				// Success
				if (response[0].status == "success") {
					if (response[0].count == 0) {
						f7.preloader.hide();
						var message = "Poll counts already reset.";
						f7.dialog.alert(message);
					} else {
						var item = {
							table: "pollscore",
							key: "pollid",
							id: pollid,
						};

						store.dispatch("deleteItemApp", item);
						store.dispatch("deleteItemDB", item);

						vue.getPollscores("reset");
					}
				}
				// Failure
				else {
					var message = "Poll counts couldn't be reset.";
					f7.preloader.hide();
					f7.dialog.alert(message);
				}
			});
		},
	},
	mounted() {
		f7ready((f7) => { });
	},
};
</script>

<style></style>