<template>
	<div>
		<!-- Set as child directory - Toggle -->
		<f7-list list class="no-margin-bottom no-margin-top no-hairline">
			<f7-list-item title="Set as child directory?" class="no-hairline">
				<!-- Icon -->
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'user-friends']"
						/>
					</f7-icon>
				</template>
				<!-- Toggle -->
				<f7-toggle
					:checked="this.isChecked()"
					color="custom-color"
					@toggle:change="toggle($event)"
				></f7-toggle>
			</f7-list-item>
		</f7-list>
		<!-- Select parent - Dropdown Accordian -->
		<f7-list
			inline-labels
			:id="'parent-' + this.projectid"
			class="no-margin-top"
			:style="
				'position: relative; top: -1px;' +
				parentMaxHeight(getProject.project_id)
			"
		>
			<!-- Dropdown -->
			<f7-list-input
				inline-labels
				label="Parent directory"
				type="select"
				placeholder="Choose..."
				:value="setValue()"
				@change="setParent($event.target.value)"
			>	
				<!-- Icon -->
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'user']"
						/>
					</f7-icon>
				</template>
				<!-- Options -->
				<option
					v-for="item in this.getParents"
					:key="item.directoryId"
					:value="item.directoryId"
					v-html="item.directoryName"
				></option>
			</f7-list-input>
		</f7-list>
	</div>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";
import { Dom7 } from "framework7";
var $$ = Dom7;

import misc from "../../../mixins/misc";

export default {
	name: "directoryentry-settings-parent",
	data() {
		return {};
	},
	props: {
		projectid: Number,
	},
	mixins: [misc],
	computed: {
		getProject() {
			var item = {
				table: "project",
				key: "id",
				id: this.projectid,
				type: "single",
			};
			return store.getters.getData(item);
		},
		getDirectory() {
			var item = {
				table: "directory",
				key: "projectid",
				id: this.projectid,
				type: "single",
			};
			return store.getters.getData(item);
		},
		getParents() {
			var projects = store.state.project.filter(function (result) {
				return result.project_typeid === 5;
			});
			var array = [];
			for (var i = 0; i < projects.length; i++) {
				var directory = store.state.directory.filter(function (result) {
					return (
						result.directory_projectid === projects[i].project_id
					);
				});
				var json = {
					directoryId: directory[0].directory_id,
					directoryName: projects[i].project_name,
				};
				if (
					projects[i].project_id !==
					this.getDirectory.directory_projectid
				)
					array.push(json);
			}
			return array;
		},
	},
	methods: {
		parentMaxHeight() {
			var parentid = this.getDirectory.directory_parentid;
			var height;
			if (parentid == 0) {
				height = 0;
			} else {
				height = "96px";
			}
			var z =
				"max-height:" +
				height +
				"; overflow: hidden; transition: max-height 0.4s ease-out";
			return z;
		},
		isChecked() {
			if (this.getDirectory.directory_parentid === 0) {
				return false;
			} else {
				return true;
			}
		},
		toggle(event) {
			var id = "parent-" + this.projectid;
			this.accordianSlide(id, 0);
			new Date();
			var unixtime = Date.now() / 1000;

			var vue = this;
			setTimeout(function () {
				if (event === false) {
					var item = {};
					item.table = "directory";
					item.json = vue.getDirectory;
					item.json.directory_parentid = 0;
					item.json.directory_unixtime = unixtime;
					store.dispatch("updateItemApp", item);
				}
			}, 500);
		},
		setParent(value) {
			var parent = this.getParents.filter(function (result) {
				return result.directoryId == value;
			});
			new Date();
			var unixtime = Date.now() / 1000;
			var item = {};
			item.json = this.getDirectory;
			item.table = "directory";
			item.json.directory_parentid = parent[0].directoryId;
			item.json.directory_unixtime = unixtime;
			store.dispatch("updateItemApp", item);
		},
		setValue() {
			var parentid = this.getDirectory.directory_parentid;
			return parentid;
		},
	},
	mounted() {},
};
</script>

<style>
.ios {
	--f7-picker-sheet-bg-color: #ffffff;
}
.md {
	--f7-picker-sheet-bg-color: #ffffff;
}
.c3-item-input-wrap {
	width: auto important;
}
</style>