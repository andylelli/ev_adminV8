<template>
	<div>
		<div class="display-flex justify-content-space-between">
			<f7-block-header style="text-transform: uppercase"
				><div v-html="title"></div
			></f7-block-header>
			<f7-block-header>
				<f7-link :sortable-toggle="'.sort-' + table">
					<font-awesome-icon
						class="fa-fw custom-colour"
						style="font-size: 20px"
						:icon="['fal', 'sort']"
					/>
				</f7-link>
			</f7-block-header>
		</div>
		<f7-list
			:class="
				'ripple-color-primary no-margin-top no-padding-top sort-' +
				table
			"
			id="list"
			sortable
			@sortable:sort="onSort()"
		>
			<f7-list-item
				v-for="item in this.items"
				:key="item.id"
				swipeout
				:id="'sort-' + table + '-' + item.id"
				:link="mainLink(item.typeid, item.id)"
				:position="item.position"
				:title="item.name"
				@swipeout:open="closeSortable()"
			>
				<template #media>
					<f7-icon>
						<!-- 1 -->
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="setIcon(item.typeid)"
						/>
					</f7-icon>
				</template>
				<swipeout-actions
					:item="item"
					:table="table"
				></swipeout-actions>
			</f7-list-item>
		</f7-list>
	</div>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { Dom7 } from "framework7";
var $$ = Dom7;

import misc from "../../mixins/misc";

import params from "../../js/config/params.js";

import swipeoutActions from "../../components/misc/swipeoutActions.vue";

export default {
	// 2
	name: "project-list",
	data() {
		return {
			// 3
			eventid: parseInt(localStorage.id),
		};
	},
	props: ["title", "table"],
	components: {
		swipeoutActions,
	},
	mixins: [misc],
	inject: ["eventBus"],
	computed: {
		getEventID() {
			var eventid = store.getters.getEventID();
			if (eventid) {
				return eventid;
			}
		},
		items() {
			if (this.getEventID) {
				var item = {
					table: this.table,
					key: "eventid",
					id: this.getEventID,
					type: "multiple",
				};
				var entries = store.getters.getData(item);

				if (entries) {
					var items = [];
					for (var i = 0; i < entries.length; i++) {
						var item = {
							id: entries[i][this.table + "_id"],
							name: entries[i][this.table + "_name"],
							position: entries[i][this.table + "_position"],
						};
						if (entries[i][this.table + "_typeid"]) {
							item.typeid = entries[i][this.table + "_typeid"];
						}
						if (entries[i][this.table + "_text"]) {
							item.text = entries[i][this.table + "_text"];
						}
						items.push(item);
					}

					items.sort(function (a, b) {
						return a["position"] - b["position"];
					});
					return items;
				}
			}
		},
	},
	methods: {
		closeSortable() {
			f7.sortable.disable(".sort-" + this.table);
		},
		onSort() {
			var els = $$(".sort-" + this.table + " ul").children();
			this.sortList(els, this.table);
		},
		mainLink(typeid, projectid) {
			var table = this.typeidToName(typeid);
			var paramsTable = params.filter(function (result) {
				return result.table == table;
			});
			var linkSuffix = paramsTable[0].linkSuffix;
			return "/" + table + "/" + projectid + linkSuffix;
		},
		setIcon(typeid) {
			var table = this.typeidToName(typeid);
			var paramsTable = params.filter(function (result) {
				return result.table == table;
			});
			var paramsIcon = paramsTable[0].icon;

			var icon = [];
			icon.push("fal");
			icon.push(paramsIcon);
			return icon;
		},
	},
	mounted() {
		var vue = this;
		f7ready((f7) => {
			$$(".item-link").addClass("ripple-color-primary");

			vue.eventBus.on("close-sortable", (x) => {
				this.closeSortable();
			});
		});
	},
};
</script>

<style scoped>
.ripple-color-primary {
	--f7-theme-color-ripple-color: rgba(var(--f7-theme-color-rgb), 0.15);
}
</style>