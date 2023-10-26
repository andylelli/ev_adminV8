import params from "../js/config/params.js";
import store from "../vuex/store.js";

import { f7 } from "framework7-vue";

import { Dom7 } from "framework7";
var $$ = Dom7;

export default {
	methods: {
		//////////////////////////////
		// Delete Item method (swipe)
		////////////////////////////
		deleteItem(id, table, name) {

			id = parseInt(id);
			var vue = this;

			var message = "Are you sure you want to delete " + name + "?";
			f7.dialog.confirm(message, function () {

				vue.trashToSpinner(id, table);
				if (table == 'project') {
					var find = store.state.project.filter(function (result) {
						return result.project_id === id;
					});

					var typeid = find[0].project_typeid;
					var t = vue.typeidToName(typeid)
				}
				else {
					var t = table;
				}

				var url = store.state.url + 'api/delete/' + table + '/' + id;
				vue.deleteItemPost(url, id, table, t, name);
			}
			);
		},
		async deleteItemPost(url, id, table, t, name) {

			// Parameters
			var method = 'DELETE';
			var response = await this.fetch(url, method);

			// Check if the network is too slow
			if (this.networkError(response) == true) {
				this.spinnerToError(id, table);
				return false;
			}

			// Success
			if (response[0].status == 'success') {

				console.log(response[0]);

				this.spinnerToTick(id, table);

				var vue = this;

				console.l
				setTimeout(async function () {
					setTimeout(async function () {
						//close swipeout
						var el = "#" + table + "-" + id;
						f7.swipeout.close(el);
						vue.deleteExecute(t, id);
					}, 600);
				}, 600);
			}
			else {
				this.spinnerToError(id, table);

				//close swipeout
				var vue = this;
				setTimeout(async function () {
					//close swipeout
					var el = "#" + table + "-" + id;
					f7.swipeout.close(el);
					var message = name + " couldn't be deleted.";
					f7.dialog.alert(message);
				}, 1500);
			}
		},

		///////////////////////////////
		// Delete Item method (button)
		/////////////////////////////
		deleteItemButton(id, table, name) {

			var vue = this;
			var message = "Are you sure you want to delete " + name + "?";
			f7.dialog.confirm(message, async function () {

				f7.preloader.show();

				if (table == 'event') {

					// Parameters
					var url = store.state.url + 'api/delete/' + table + '/' + id;
					var method = 'DELETE';
					var response = await vue.fetch(url, method);

					// Success
					if (response[0].status == 'success') {
						vue.deleteEvent(id);
					}
				}
				else if (table == 'project') {

					// Parameters
					var url = store.state.url + 'api/delete/' + table + '/' + id;
					var method = 'DELETE';
					var response = await vue.fetch(url, method);

					// Success
					if (response[0].status == 'success') {
						var find = store.state.project.filter(function (result) {
							return result.project_id === id;
						});

						var typeid = find[0].project_typeid;
						var t = vue.typeidToName(typeid)
						vue.deleteExecute(t, id);
					}
				}
				else {

					// Parameters
					var url = store.state.url + 'api/delete/' + table + '/' + id;
					var method = 'DELETE';
					var response = await vue.fetch(url, method);

					// Success
					if (response[0].status == 'success') {
						var t = table;
						vue.deleteExecute(t, id);
					}
				}
			});
		},

		/////////////////////////
		// Delete Event method
		///////////////////////
		deleteEvent(id) {

			var view = f7.views.current;
			view.router.navigate("/empty/");
			f7.views.main.router.clearPreviousHistory();
			var eventsList = store.getters.getEventslist();
			var index = eventsList.indexOf(id);
			eventsList.splice(index, 1);
			store.dispatch('setEventsList', eventsList);
			var eventsList = store.getters.getEventslist();

			setTimeout(function () {
				$$(".page-previous").remove();
				$$(".navbar-hidden").remove();
			}, 4000);

			//CLEAR DATA
			var tables = store.getters.getTableNames("all");
			store.dispatch("initiateState", tables);
			store.dispatch("initiateDB", tables);

			f7.preloader.hide();

			//Show success alert
			this.deleteSuccess('event');

		},


		/////////////////////////////
		// Delete Item - subfunctions
		///////////////////////////
		trashToSpinner(id, table) {
			$$('#swipeout-' + table + '-delete-' + id).hide();
			$$('#swipeout-' + table + '-spinner-' + id).show();
		},
		spinnerToTick(id, table) {
			function change() {
				$$('#swipeout-' + table + '-spinner-' + id).hide();
				$$('#swipeout-' + table + '-tick-' + id).show();
			}
			setTimeout(change, 600)
		},
		spinnerToError(id, table) {
			var vue = this;
			function change() {
				$$('#swipeout-' + table + '-spinner-' + id).hide();
				$$('#swipeout-' + table + '-error-' + id).show();
				vue.errorToDelete(id, table);
			}
			setTimeout(change, 600)
		},
		errorToDelete(id, table) {
			function change() {
				$$('#swipeout-' + table + '-error-' + id).hide();
				$$('#swipeout-' + table + '-delete-' + id).show();
			}
			setTimeout(change, 1200)
		},

		deleteExecute(table, id) {

			////////////////////////////////////////
			// DELETE PROJECTS
			//////////////////////////////////////
			var vue = this;
			var projects = [];
			var sort = [];

			var paramsSort = params.filter(function (result) {
				return result.sort === true;
			});
			for (var i = 0; i < paramsSort.length; i++) {
				sort.push(paramsSort[i].table);
			}

			// Get tables under project and push into array
			var paramsTable = params.filter(function (result) {
				return result.newSheetName == "project";
			});
			for (var i = 0; i < paramsTable.length; i++) {
				projects.push(paramsTable[i].table);
			}

			if (projects.includes(table)) {

				//DELETE TABLE
				var item = {
					table: table,
					key: "projectid",
					id: id,
					type: 'single'
				};
				var data = store.getters.getData(item);
				var item;
				if (data) {
					item = {
						table: table,
						id: data[table + '_id']
					}
					store.dispatch('deleteItemApp', item);
					store.dispatch('deleteItemDB', item);
				}

				//DELETE PROJECT
				item = {
					table: 'project',
					id: id
				}

				store.dispatch('deleteItemApp', item);
				store.dispatch('deleteItemDB', item);

				//DELETE CHILD TABLES
				var paramsTable = params.filter(function (result) {
					return result.table == table;
				});

				var childTables = paramsTable[0].childTables;

				if (childTables) {
					childTables.forEach(function (childTable) {
						var item = {
							table: childTable,
							key: table + '_id',
							id: id
						}
						store.dispatch('deleteItemApp', item);
						store.dispatch('deleteItemDB', item);
					});


					// Reorder list  
					setTimeout(function () {
						var els = $$(".sort-project" + " ul").children();
						vue.sortList(els, table);
					}, 250);

				}
				f7.preloader.hide();
				if (this.previousPage) {
					var view = f7.views.main;
					var event = store.state.eventid;
					var path = "/" + this.previousPage + "/" + event + "/";
					view.router.navigate(path);
					view.router.clearPreviousHistory();
				}
			}

			//////////////////////
			// ALL OTHER TABLES
			/////////////////////			
			else {

				var item = {
					table: table,
					key: "id",
					id: id,
					type: 'single'
				};

				var data = store.getters.getData(item);

				var paramsTable = params.filter(function (result) {
					return result.table == table;
				});

				item = {
					table: table,
					id: id
				}

				store.dispatch('deleteItemApp', item);
				store.dispatch('deleteItemDB', item);

				var view = f7.views.current;
				view.router.refreshPage();

				//DELETE CHILD TABLES
				var childTables = paramsTable[0].childTables;

				if (childTables) {
					childTables.forEach(function (childTable) {
						var item = {
							table: childTable,
							key: table + '_id',
							id: id
						}
						store.dispatch('deleteItemApp', item);
						store.dispatch('deleteItemDB', item);
					});

					// Reorder list
					var paramsChildTable = params.filter(function (result) {
						return result.table == childTable;
					});
					var sort = paramsChildTable[0].sort;
					if (sort) {
						setTimeout(function () {
							var els = $$(".sort-" + table + " ul").children();
							vue.sortList(els, table);
						}, 250);
					}
				}
				if (this.previousPage) {
					f7.preloader.hide();
					var vue = this;
					setTimeout(function () {
						var path = "/" + vue.previousPage + "/" + vue.projectid + "/";

						//IF NEWS
						if (vue.previousPage == 'news') {
							f7.views.current.router.back(path, { force: true });
						}
						else {
							f7.views.current.router.back();
						}
					}, 250);
				}
			}
		},

		deleteSuccess(table) {
			var find = params.filter(function (result) {
				return result.table === table;
			});
			var displayName = find[0].displayName.charAt(0).toUpperCase() + find[0].displayName.slice(1);
			if (displayName) {
				var message = displayName + " successfully deleted.";
			}
			f7.dialog.alert(message);
		}
	}
}