<template>
	<div>
		<f7-list dividers-ios no-padding-top style="margin-top: 0px;">
			<f7-list-input label="North" type="text" placeholder="Latitude" clear-button v-model="northValue"
				ref="inputNorth">
				<template #media>
					<f7-icon>
						<font-awesome-icon class="fa-fw custom-colour" style="font-size: 20px" :icon="['fal', 'up']" />
					</f7-icon>
				</template>
			</f7-list-input>

			<f7-list-input label="West" type="text" placeholder="Longitude" clear-button v-model="westValue"
				ref="inputWest">
				<template #media>
					<f7-icon>
						<font-awesome-icon class="fa-fw custom-colour" style="font-size: 20px"
							:icon="['fal', 'left']" />
					</f7-icon>
				</template>
			</f7-list-input>

			<f7-list-input label="South" type="text" placeholder="Latitude" clear-button v-model="southValue"
				ref="inputSouth">
				<template #media>
					<f7-icon>
						<font-awesome-icon class="fa-fw custom-colour" style="font-size: 20px"
							:icon="['fal', 'down']" />
					</f7-icon>
				</template>
			</f7-list-input>

			<f7-list-input label="East" type="text" placeholder="Longitude" clear-button v-model="eastValue"
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
				colour="green" type="fill"></general-button>
		</segment>
	</div>
</template>

<script>
import store from "../../../vuex/store.js";
import misc from "../../../mixins/misc.js";
import { f7, f7ready } from "framework7-vue";

import generalButton from "../../misc/generalButton.vue";

export default {
	name: "map-coordinates",
	data() {
		return {
			northValue: '',
			westValue: '',
			southValue: '',
			eastValue: '',
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
	mixins: [misc],
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
		async submitCoordinated() {
			let url = store.state.url + 'api/post/insert/tiles/100';
			var method = 'POST';
			var data = {
				"nw": {
					"lat": 52.951405,
					"lon": -1.131356
				},
				"se": {
					"lat": 52.941287,
					"lon": -1.108696
				},
			};

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
