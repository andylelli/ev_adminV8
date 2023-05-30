<template>
	<div v-if="showImageCheck() == true" class="container">
		<img
			class="animate-bottom"
			style="width: 100vw"
			:src="this.getDirectoryentry.directoryentry_image"
		/>
	</div>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

export default {
	name: "directoryentry-image",
	data() {
		return {
			directoryentryid: parseInt(this.f7route.params.directoryentryId),
		};
	},
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
	},
	methods: {
		getImageStyle() {
			var style = "font-size: 30px; color: white;";
			return style;
		},
		showImageCheck() {
			if (this.getDirectoryentry !== false) {
				if (this.getDirectoryentry.directoryentry_image.length > 0) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},
	},
	mounted() {
		f7ready((f7) => {

		});
	},
};
</script>

<style scoped>
.container {
	position: relative;
	text-align: center;
}

.bottom-left {
	position: absolute;
	bottom: -25px;
	left: 8px;
}

.animate-bottom {
	position: relative;
	-webkit-animation-name: animatebottom;
	-webkit-animation-duration: 1s;
	animation-name: animatebottom;
	animation-duration: 1s;
}
@-webkit-keyframes animatebottom {
	from {
		bottom: -50px;
		opacity: 0;
	}
	to {
		bottom: 0px;
		opacity: 1;
	}
}
@keyframes animatebottom {
	from {
		bottom: -50px;
		opacity: 0;
	}
	to {
		bottom: 0px;
		opacity: 1;
	}
}
</style>