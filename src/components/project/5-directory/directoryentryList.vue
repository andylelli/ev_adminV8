<template>
	<div v-if="showSwipeout()" class="text-align-center"
		:style="'position: relative; top: -1px;' + maxHeight()">
		<f7-block strong style=" margin-top: 3px; margin-bottom: 7px;">
		Swipe items left to add to favourites
		</f7-block>
	</div>
	<div class="list swipeout ripple-color-primary no-margin-top no-padding-top">
		<ul>
			<li v-for="item in this.getDirectoryentries" :key="item.directoryentry_id" class="swipeout"
				:id="'directoryentry' + item.directoryentry_id" :position="item.directoryentry_position">
				<div class="swipeout-content">
					<a :href="link(item.directoryentry_id)" class="item-link item-content">
						<div class="item-media" :style="setStyle(getProject.project_position)">
							<font-awesome-icon class="fa-fw" style="font-size: 28px;"
								:icon="iconArray(getProject.project_appicon)" />
						</div>
						<div class="item-inner">
							<div class="item-title" v-html="item.directoryentry_name"></div>
							<div v-if="
								isFavourite(item.directoryentry_id) === true
							" class="item-after">
								<font-awesome-icon style="font-size: 20px; color: #ffcc00" :icon="['fas', 'star']" />
							</div>
						</div>
					</a>
				</div>
				<div v-if="showSwipeout()" class="swipeout-actions-right">
					<a class="color-yellow" @click="setFavourite(item.directoryentry_id)">
						<font-awesome-icon style="font-size: 20px" :icon="['fas', 'star']" />
					</a>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { Dom7 } from "framework7";
var $$ = Dom7;

import params from "../../../js/config/params.js";

export default {
	name: "directoryentry-list",
	data() {
		return {
			table: "directoryentry",
			colourStyles: [],
			toggleState: null
		};
	},
	props: {
		id: Number,
		image: Number,
		title: String,
		text: String,
		favourite: String,
		projectid: Number,
	},
	computed: {
		getProject() {
			if (this.projectid) {
				var item = {
					table: "project",
					key: "id",
					id: this.projectid,
					type: "single",
				};

				var project = store.getters.getData(item);

				return project;
			}
		},
		getDirectory() {
			var item = {
				table: "directory",
				key: "id",
				id: this.id,
				type: "single",
			};

			return store.getters.getData(item);
		},		
		getDirectoryentries() {
			var item = {
				table: "directoryentry",
				key: "directoryid",
				id: this.id,
				type: "multiple",
			};

			return store.getters.getData(item);
		},
		getColours() {
			var item = {
				table: "lookup",
				key: "id",
				id: "light-palette",
				type: "single",
			};

			var data = store.getters.getData(item);
			var value = data.lookup_value;
			return value;
		},
	},
	methods: {
		showSwipeout() {
			if(this.getDirectory.directory_mapid == 0 && this.getDirectory.directory_scheduleid == 0) {
				return false;
			}
			else {
				return true
			}
		},		
		maxHeight() {
			var height;
			if (this.countFavourites() > 0) {
				height = 0;
			} else {
				height = "70px";
			}
			var z =
				"max-height:" +
				height +
				"; overflow: hidden; transition: max-height 0.4s ease-out";
			return z;
		},		
		countFavourites() {
			var find = this.getDirectoryentries.filter(function (result) {
				return result.directoryentry_favourite == "1";
			});
			if(find.length == 0) {
				this.toggleStage = "on";
			}
			else {
				this.toggleState = "off"
			}
			return find.length;

		},
		setStyle(i) {
			var pos = (i) % this.getColours.length;
			var colour = this.getColours[pos];
			var style = "color:" + colour + ";";
			return style;
		},
		iconArray(appicon) {
			if (appicon) {
				var iconArr = appicon.split(" ");
				return iconArr;
			}
		},
		link(id) {
			var vue = this;
			var find = params.filter(function (result) {
				return result.table === vue.table;
			});
			var link = find[0].link;
			if (link) {
				return "/" + this.table + "/" + id + "/";
			}
		},
		setId(id) {
			return this.table + id;
		},
		isFavourite(directoryentryid) {
			var find = this.getDirectoryentries.filter(function (result) {
				return result.directoryentry_id === directoryentryid;
			});
			if (find[0].directoryentry_favourite === 1) {
				return true;
			} else {
				return false;
			}
		},
		setFavourite(id) {
			var favourite;

			var item = {
				table: "directoryentry",
				key: "id",
				id: id,
				type: "single",
			};

			var directoryentry = store.getters.getData(item);

			if (directoryentry.directoryentry_favourite === 1) {
				favourite = 0;
			} else {
				favourite = 1;
			}

			new Date();
			var unixtime = Date.now() / 1000;
			var item = {};
			item.json = directoryentry;
			item.table = "directoryentry";
			item.json.directoryentry_favourite = favourite;
			item.json.directoryentry_unixtime = unixtime;

			store.dispatch("updateItemApp", item);
			store.dispatch("updateItemDB", item);

			if (favourite === 1) {
				var el = $$("#directoryentry" + id);
				var itemAfter = el.find(".item-after");
				itemAfter.html(
					'<span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-star fa-w-18" style="font-size: 20px; color: rgb(255, 204, 0);"><path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" class=""></path></svg></span>'
				);
			} else {
				var el = $$("#directoryentry" + id);
				var itemAfter = el.find(".item-after");
				itemAfter.html("<span></span>");
			}
			f7.swipeout.close("#" + this.table + id);
		},
	},
	mounted() {
		var vue = this;
		f7ready((f7) => { });
	},
};
</script>

<style scoped>
.max-lines {
	--f7-list-item-text-max-lines: 1;
}

.animate-left {
	position: relative;
	-webkit-animation-name: animateleft;
	-webkit-animation-duration: 1s;
	animation-name: animateleft;
	animation-duration: 1s;
}

@-webkit-keyframes animateleft {
	from {
		left: -50px;
		opacity: 1;
	}

	to {
		left: 0px;
		opacity: 1;
	}
}

@keyframes animateleft {
	from {
		left: -50px;
		opacity: 1;
	}

	to {
		left: 0px;
		opacity: 1;
	}
}
</style>