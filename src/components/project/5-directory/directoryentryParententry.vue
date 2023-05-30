<template>
	<f7-list inline-labels class="no-margin-top">
		<f7-list-input
			inline-labels
			:label="label"
			type="select"
			placeholder="Choose..."
			:value="setValue()"
			@change="setParentDirectoryentry($event.target.value)"
		>
			<template #media>
				<f7-icon>
					<font-awesome-icon
						class="fa-fw custom-colour"
						style="font-size: 22px; padding-top: 2px"
						:icon="['fal', 'user-friends']"
					/>
				</f7-icon>
			</template>
			<option
				v-for="item in this.getParentDirectoryentries"
				:key="item.directoryentry_id"
				:value="item.directoryentry_id"
				v-html="item.directoryentry_name"
			></option>
		</f7-list-input>
	</f7-list>
</template>

<script>
import store from "../../../vuex/store.js";

import misc from "../../../mixins/misc";

export default {
	name: "directoryentry-parent",
	data() {
		return {};
	},
	props: {
		directoryentryid: Number,
	},
	mixins: [misc],
	computed: {
		label() {
			var parentname = this.getParentProject.project_name;
			if (parentname) {
				return parentname + " entry";
			}
		},
		getParentProject() {
			if (this.getDirectoryentry) {
				var id = this.getDirectoryentry.directoryentry_directoryid;
				var item = {
					table: "directory",
					key: "id",
					id: id,
					type: "single",
				};
				var directory = store.getters.getData(item);

				if (directory) {
					var item = {
						table: "directory",
						key: "id",
						id: directory.directory_parentid,
						type: "single",
					};
					var parentdirectory = store.getters.getData(item);

					if (parentdirectory) {
						var project = store.state.project.filter(function (
							result
						) {
							return (
								result.project_id ===
								parentdirectory.directory_projectid
							);
						});
						if (project.length > 0) {
							return project[0];
						} else {
							return false;
						}
					}
				} else {
					return false;
				}
			}
		},
		getDirectoryentry() {
			var item = {
				table: "directoryentry",
				key: "id",
				id: this.directoryentryid,
				type: "single",
			};
			var data = store.getters.getData(item);
			if (data) {
				return data;
			}
		},
		getDirectory() {
			var directoryid = this.getDirectoryentry.directoryentry_directoryid;
			var find = store.state.directory.filter(function (result) {
				return result.directory_id === directoryid;
			});
			if (find.length > 0) {
				return find[0];
			}
		},
		getParentDirectoryentries() {
			var parentdirectoryid = this.getDirectory.directory_parentid;
			var find = store.state.directoryentry.filter(function (result) {
				return result.directoryentry_directoryid === parentdirectoryid;
			});
			if (find.length > 0) {
				return find;
			}
		},
	},
	methods: {
		setParentDirectoryentry(value) {
			new Date();
			var unixtime = Date.now() / 1000;
			var item = {};
			item.table = "directoryentry";
			item.json = this.getDirectoryentry;
			item.json.directoryentry_parententryid = value;
			item.json.directoryentry_unixtime = unixtime;
			store.dispatch("updateItemApp", item);
		},
		setValue() {
			var parentid = this.getDirectoryentry.directoryentry_parententryid;
			return parentid;
		},
	},
	mounted() {},
};
</script>

<style scoped>
.ios {
	--f7-picker-sheet-bg-color: #ffffff;
}
.md {
	--f7-picker-sheet-bg-color: #ffffff;
}
.c3-item-input-wrap {
	width: auto !important;
}

.input-item-wrap select {
	height: 0px !important;
}
</style>