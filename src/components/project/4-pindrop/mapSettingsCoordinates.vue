<template>
	<div>
		<f7-list dividers-ios no-padding-top style="margin-top: 0px;">
			<f7-list-input label="North" type="text" placeholder="Latitude" clear-button v-model:value="northValue"
				ref="inputNorth">
				<template #media>
					<f7-icon>
						<font-awesome-icon class="fa-fw custom-colour" style="font-size: 20px" :icon="['fal', 'up']" />
					</f7-icon>
				</template>
			</f7-list-input>

			<f7-list-input label="West" type="text" placeholder="Longitude" clear-button v-model:value="westValue"
				ref="inputWest">
				<template #media>
					<f7-icon>
						<font-awesome-icon class="fa-fw custom-colour" style="font-size: 20px"
							:icon="['fal', 'left']" />
					</f7-icon>
				</template>
			</f7-list-input>

			<f7-list-input label="South" type="text" placeholder="Latitude" clear-button v-model:value="southValue"
				ref="inputSouth">
				<template #media>
					<f7-icon>
						<font-awesome-icon class="fa-fw custom-colour" style="font-size: 20px"
							:icon="['fal', 'down']" />
					</f7-icon>
				</template>
			</f7-list-input>

			<f7-list-input label="East" type="text" placeholder="Longitude" clear-button v-model:value="eastValue"
				ref="inputEast">
				<template #media>
					<f7-icon>
						<font-awesome-icon class="fa-fw custom-colour" style="font-size: 20px"
							:icon="['fal', 'right']" />
					</f7-icon>
				</template>
			</f7-list-input>
		</f7-list>

		<segment>
			<general-button class="margin-bottom" @generalButtonAction="submitCoordinates()" label="SUBMIT" width="200"
				colour="green" type="fill" />
		</segment>
	</div>
</template>

<script>

import { f7, f7ready } from "framework7-vue";

import store from "../../../vuex/store.js";
import misc from "../../../mixins/misc.js";
import fetch from "../../../mixins/fetch.js";

import generalButton from "../../misc/generalButton.vue";

export default {
	name: "map-coordinates",
	data() {
		return {
			northValue: 0,
			westValue: 0,
			southValue: 0,
			eastValue: 0,
			bufferLat: 0.002, // Buffer to prevent rounding issues
			bufferLon: 0.002, // Buffer to prevent rounding issues
		};
	},
	components: {
		generalButton
	},
	props: {
		pindropid: Number
	},
	mixins: [misc, fetch],
	computed: {
		getPindrop() {
			var item = {
				table: "pindrop",
				key: "id",
				id: this.pindropid,
				type: "single",
			};
			// var item = store.getters.getData(item);
			return store.getters.getData(item);
		},
	},
	methods: {
		async submitCoordinates() {
			let url = store.state.url + 'api/post/insert/tiles';
			var method = 'POST';

			function truncateTo6Decimals(value) {
				return value >= 0
					? Math.floor(value * 1e6) / 1e6
					: Math.ceil(value * 1e6) / 1e6;
			}

			var northLat = truncateTo6Decimals(parseFloat(this.northValue) + this.bufferLat);
			var southLat = truncateTo6Decimals(parseFloat(this.southValue) - this.bufferLat);
			var eastLon = truncateTo6Decimals(parseFloat(this.eastValue) + this.bufferLon);
			var westLon = truncateTo6Decimals(parseFloat(this.westValue) - this.bufferLon);

			if (northLat < southLat || eastLon < westLon) {
				f7.dialog.alert("Invalid coordinates. Please check the values.");
				return;
			}

			var data = {
				"nw": {
					"lat": northLat,
					"lon": westLon
				},
				"se": {
					"lat": southLat,
					"lon": eastLon
				},
				"pindrop_id": this.pindropid
			};

			f7.preloader.show();

			// Post data
			await this.fetch(url, method, data, this.success, this.failure);
		},
		success(response) {

			new Date();
			var unixtime = Date.now() / 1000;

			var item = {
				json: {
					lookup_id: "backup-files",
					lookup_value: json.backupFiles,
					lookup_eventid: this.eventid,
					lookup_unixtime: unixtime,
				},
			};

			store.dispatch("updateMapCoordinated", item);
			store.dispatch("insertLookupDB", item);

			f7.preloader.hide();

			f7.dialog.alert("Map successfully created.");

		},
		failure(response) {
			f7.preloader.hide();
			f7.dialog.alert(response.message);
		},
		attachKeyListener() {
			var vue = this;
			this.$nextTick(() => {
				const refs = ['inputNorth', 'inputWest', 'inputSouth', 'inputEast'];
				refs.forEach(ref => {
					const inputEl = this.$refs[ref]?.$el?.querySelector('input');
					if (inputEl) {
						inputEl.addEventListener('keydown', this.restrictDecimalInput);
						console.log(`Listener attached to ${ref}`);
					} else {
						console.warn(`Input element not found for ${ref}`);
					}
				});
			});
		},
		restrictDecimalInput(e) {
			const key = e.key;
			const input = e.target;
			const value = input.value;
			const start = input.selectionStart;
			const end = input.selectionEnd;

			if (
				['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(key) ||
				e.ctrlKey || e.metaKey
			) return;

			if (key === '.') {
				if (value.includes('.')) e.preventDefault();
				return;
			}

			if (/\d/.test(key)) {
				const dot = value.indexOf('.');
				if (dot !== -1 && start > dot) {
					const decimals = value.slice(dot + 1);
					const replacing = start !== end;
					if (decimals.length >= 8 && !replacing) e.preventDefault();
				}
				return;
			}

			e.preventDefault();
		}
	},
	mounted() {
		var vue = this;
		f7ready(() => {
			vue.attachKeyListener();
			vue.northValue = parseFloat(vue.getPindrop.pindrop_north) === 0 ? '' : vue.getPindrop.pindrop_north;
			vue.westValue = parseFloat(vue.getPindrop.pindrop_west) === 0 ? '' : vue.getPindrop.pindrop_west;
			vue.southValue = parseFloat(vue.getPindrop.pindrop_south) === 0 ? '' : vue.getPindrop.pindrop_south;
			vue.eastValue = parseFloat(vue.getPindrop.pindrop_east) === 0 ? '' : vue.getPindrop.pindrop_east;


		});
	},
	beforeDestroy() {
		const refs = ['inputNorth', 'inputWest', 'inputSouth', 'inputEast'];
		refs.forEach(ref => {
			const inputEl = this.$refs[ref]?.$el?.querySelector('input');
			if (inputEl) {
				inputEl.removeEventListener('keydown', this.restrictDecimalInput);
			}
		});
	},
};
</script>
