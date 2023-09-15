<template>
	<f7-nav-right>
		<div style="width: 20px;">
			<Transition name="fadein">
				<div style="width: 10px" v-if="this.error == true">
					<font-awesome-icon style="font-size: 20px; color: red" :icon="['far', 'exclamation']" />
				</div>
			</Transition>
		</div>
		<div style="width: 20px; margin-right: 7px">
			<font-awesome-icon v-if="this.working != 'stopped'" class="fa-spin" style="font-size: 20px; color: green" :icon="['fal', 'sync']" />
		</div>
	
		<div v-if="this.online == false" style="width: 25px; margin-right: 2px">
			<font-awesome-icon class="fa-fw" style="font-size: 17px; color: red" :icon="['fal', 'wifi-slash']" />
		</div>
		<f7-link v-if="showLeftView == false" panel-open="left">
			<font-awesome-icon class="fa-fw custom-colour" style="font-size: 20px" :icon="['far', 'bars']" />
		</f7-link>
	</f7-nav-right>
</template>

<script>
import { f7ready } from "framework7-vue";
import store from "../../../vuex/store";

import { Dom7 } from "framework7";
var $$ = Dom7;

export default {
	name: "nav-bars",
	data() {
		return {
			viewportWidth: 0,
		};
	},
	components: {},
	mixins: [],
	computed: {
		showLeftView() {
			if (this.viewportWidth > 768) {
				return true;
			} else {
				return false;
			}
		},
		working() {
			var working = store.getters.getWorking();
			return working;
		},
		error() {
			var error = store.getters.getError();
			return error;
		},
		online() {
			if (localStorage.network == "online") {
				return true;
			} else {
				return false;
			}
		},
	},
	methods: {},
	mounted() {
		f7ready((f7) => {
			var vue = this;
			this.viewportWidth = window.innerWidth;

			window.addEventListener(
				"resize",
				function(event) {
					vue.viewportWidth = window.innerWidth;
				},
				true
			);
		});
	},
};
</script>

<style scoped>
.fadein-enter-active {
	animation: fadein 4s linear;
}

.fadein-leave-active {
	animation: fadeout 0.1s linear;
}

@keyframes fadein {
	0% {
		opacity: 0;
	}
	3% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
}

@keyframes fadeout {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 0;
	}
}
</style>
