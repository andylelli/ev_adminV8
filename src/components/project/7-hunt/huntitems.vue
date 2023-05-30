<template>
	<div class="block block-strong">
		<p v-for="(item, i) in this.getHuntitems" :key="i" class="row">
			<button
				class="
					col
					button button-large button-raised button-fill
					poll-button
				"
				:style="
					'--animation-order: ' +
					(i + 1) +
					'; z-index: 1; margin-top: 10px; margin-bottom: 10px;'
				"
				@click="openHuntitemSheet(item.huntitem_id)"
			>
				{{ item.huntitem_name }}
			</button>
			<span
				class="badge hunt-badge margin-right"
				:style="
					'--animation-order: ' +
					(i + 1) +
					'; position: absolute; z-index: 2; padding-top: 9px; right: 4px;'
				"
			>
				<font-awesome-icon
					v-if="item.huntitem_scanned"
					style="font-size: 30px; font-weight: bold; color: green"
					:icon="['fal', 'check']"
			/></span>
		</p>
	</div>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import Framework7 from "framework7";

import misc from "../../../mixins/misc";

export default {
	name: "huntitems",
	data() {
		return {};
	},
	props: {
		projectid: Number,
	},
	inject: ["eventBus"],	
	mixins: [misc],
	computed: {
		getHunt() {
			var item = {
				table: "hunt",
				key: "projectid",
				id: this.projectid,
				type: "single",
			};
			return store.getters.getData(item);
		},
		getHuntitems() {
			if (this.getHunt) {
				var item = {
					table: "huntitem",
					key: "huntid",
					id: this.getHunt.hunt_id,
					type: "multiple",
				};
				var huntitems = store.getters.getData(item);
				if (huntitems) {
					return huntitems;
				}
			}
		},
	},
	methods: {
		openHuntitemSheet(id) {
			var find = this.getHuntitems.filter(function (result) {
				return result.huntitem_id === id;
			});
			if (find[0].huntitem_scanned) {
				this.eventBus.emit("sheet-huntitem", id);
			}
		},
	},
	mounted() {
		f7ready((f7) => {});
	},
};
</script>

<style scoped>
button {
	display: block;
	animation-name: animateIn;
	animation-duration: 350ms;
	animation-delay: calc(var(--animation-order) * 100ms);
	animation-fill-mode: both;
	animation-timing-function: ease-in-out;
}
span {
	display: block;
	animation-name: animateIn;
	animation-duration: 350ms;
	animation-delay: calc(var(--animation-order) * 100ms);
	animation-fill-mode: both;
	animation-timing-function: ease-in-out;
}

@keyframes animateIn {
	0% {
		opacity: 0;
		transform: scale(0.6) translateY(-8px);
	}

	100% {
		opacity: 1;
	}
}
.hunt-button {
	--f7-button-large-height: 44px;
}
.hunt-badge {
	--f7-badge-text-color: var(--f7-theme-color);
	--f7-badge-bg-color: white;
	--f7-badge-padding: 4 8px;
	--f7-badge-font-weight: 800;
	--f7-badge-size: 64px;
	--f7-badge-font-size: 32px;
}
</style>