<template>
	<div>
		<f7-list dividers-ios no-padding-top style="margin-top: 0px;">
			<f7-list-input label="North" type="text" placeholder="Latitude" clear-button v-model="northValue"
				ref="inputNorth" :value="this.northValue">
				<template #media>
					<f7-icon>
						<font-awesome-icon class="fa-fw custom-colour" style="font-size: 20px" :icon="['fal', 'up']" />
					</f7-icon>
				</template>
			</f7-list-input>

			<f7-list-input label="West" type="text" placeholder="Longitude" clear-button v-model="westValue"
				ref="inputWest" :value="this.westValue">
				<template #media>
					<f7-icon>
						<font-awesome-icon class="fa-fw custom-colour" style="font-size: 20px"
							:icon="['fal', 'left']" />
					</f7-icon>
				</template>
			</f7-list-input>

			<f7-list-input label="South" type="text" placeholder="Latitude" clear-button v-model="southValue"
				ref="inputSouth" :value="this.southValue">
				<template #media>
					<f7-icon>
						<font-awesome-icon class="fa-fw custom-colour" style="font-size: 20px"
							:icon="['fal', 'down']" />
					</f7-icon>
				</template>
			</f7-list-input>

			<f7-list-input label="East" type="text" placeholder="Longitude" clear-button v-model="eastValue"
				ref="inputEast" :value="this.eastValue">
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
				colour="green" type="fill"></general-button>
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
			northValue: 52.951405,
			westValue: -1.131356,
			southValue: 52.941287,
			eastValue: -1.108696,
			bufferLat: 0.015, // Buffer to prevent rounding issues
			bufferLon: 0.015, // Buffer to prevent rounding issues
		};
	},
	components: {
		generalButton
	},
	props: {
		table: String,
		id: Number,
		fieldname: String
	},
	mixins: [misc, fetch],
	computed: {
		getItemText() {
			var item = {
				table: this.table,
				key: "id",
				id: this.id,
				type: "single",
			};
			// var item = store.getters.getData(item);
			if (item) {
				var text = item[this.table + "_" + this.fieldname];
				var textDecode = escape.decodeXML(text);
				return textDecode;
			}
		},
	},
	methods: {
		async submitCoordinates() {
			let url = store.state.url + 'api/post/insert/tiles';
			var method = 'POST';

			console.log("BEFORE" + this.northValue + " " + this.westValue + " " + this.southValue + " " + this.eastValue);

			var northLat = this.northValue + this.bufferLat;
			var southLat = this.southValue - this.bufferLat;
			var eastLon = this.eastValue + this.bufferLon;
			var westLon = this.westValue - this.bufferLon;

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
				"pindrop_id": 100
			};

			f7.preloader.show();

			// Post data
			await this.fetch(url, method, data, this.success, this.failure);
		},
		success(response) {
			f7.preloader.hide();
			f7.dialog.alert(response.message);
			//this.clearForm();
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
						vue.northValue = 52.951405;
						vue.westValue = -1.131356;
						vue.southValue = 52.941287;
						vue.eastValue = -1.108696;
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
		f7ready(() => {
			this.attachKeyListener();
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
