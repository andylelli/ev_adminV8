<template>
	<div class="text-align-center">
		<div align="center">
			<input
				type="file"
				name="file"
				id="file"
				class="c3-input-file c3-hide"
			/>
			<label
				id="imageAjax"
				for="file"
				class="c3-show"
				style="margin-top: 5px"
			>
				<img
					id="image"
					:class="imageClass"
					width="300"
					:src="image"
				/>
			</label>
			<span
				id="progress"
				class="progressbar c3-hide"
				data-progress="0"
				style="width: 70vw; margin-top: 10px"
			></span>
			<div v-if="showImage" align="center" style="margin-top: 20px">
					<font-awesome-icon
						@click="removeImage()"
						class="fa-fw"
						style="font-size: 30px; color: #2b2b2b;"
						:icon="['fal', 'times']"
					/>
				</div>			
		</div>
	</div>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { Dom7 } from "framework7";
var $$ = Dom7;

import images from "../../mixins/images";
import newItem from "../../mixins/newItem";
import login from "../../mixins/login";
import misc from "../../mixins/misc";
import fetch from "../../mixins/fetch";

export default {
	name: "image-load",
	data() {
		return {
			userid: store.state.userid,
			eventid: store.state.eventid,
			newImage: false,
			name: "",
		};
	},
	props: ["id", "table"],
	mixins: [images, newItem, login, misc, fetch],
	computed: {
		getItem() {
			var item = {
				table: this.table,
				key: "id",
				id: this.id,
				type: "single",
			};
			return store.getters.getData(item);
		},
		image() {
			if (this.getItem[this.table + "_image"]) {
				return this.getItem[this.table + "_image"];
			} else {
				return "/admin/static/images/image_upload.svg";
			}
		},
		imageClass() {
			if (this.getItem[this.table + "_image"]) {
				return "elevation-4 c3-show c3-pointer";
			} else {
				return "c3-show c3-pointer";
			}
		},
		img() {
			return document.getElementById("image");
		},
		showImage() {
			if(this.getItem[this.table + "_image"]) {
				return true;
			}
			else {
				return false;
			}
		}
	},
	methods: {
		removeImage() {
			var e = null;
			var remove = true;
			this.imageLoad(e, this.id, this.table, remove);
		},		
	},
	mounted() {
		f7ready((f7) => {
			var vue = this;
			$$(".c3-input-file").on("change", function (e) {
				vue.imageLoad(e, vue.id, vue.table);
			});
		});
	},
};
</script>

<!-- <style scoped>

</style>-->