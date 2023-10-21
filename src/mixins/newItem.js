import store from "../vuex/store.js";

import { f7, f7ready } from "framework7-vue";
import { Dom7 } from "framework7";
var $$ = Dom7;

import params from "../js/config/params.js";

export default {
	methods: {
		async newItem(post, table, preloader, displayName, refresh) {

			var t;
			var projects = [];

			// Get tables upder project and push into array
			var paramsTable = params.filter(function (result) {
				return result.newSheetName == "project";
			});
			for (var i = 0; i < paramsTable.length; i++) {
				projects.push(paramsTable[i].table);
			}

			if (projects.includes(post.table)) {
				t = post.table;
			}
			else {
				t = table;
			}

			if (preloader == true) {
				f7.preloader.show();
			}

			var newEvent;
			if (table == 'event') {
				newEvent = true;
			}


			// Parameters
			var url = store.state.url + 'api/post/insert/' + t;
			var method = 'POST';
			var data = post;
			var success = null;
			var failure = null;
			var page = null;

			// Post data
			var response = await this.fetch(url, method, data, success, failure, page, newEvent);

			// Success
			if (response.status == 'success') {

				if (table == 'lookup') {
					this.lookupNew(post, response);
				}
				else if (table == 'event') {
					this.eventNew(response);
				}
				else {
					this.insertNew(post, response, t, displayName, refresh);
				}
			}
			else {
				f7.preloader.hide();
				f7.dialog.alert(response.message);

				return false;
			}
		},

		insertNew(post, response, table, displayName, refresh) {

			new Date; var unixtime = Date.now() / 1000;

			///////////
			// PROJECT
			/////////

			var fields = [];
			var projects = [];

			// Get tables upder project and push into array
			var paramsTable = params.filter(function (result) {
				return result.newSheetName == "project";
			});
			for (var i = 0; i < paramsTable.length; i++) {
				projects.push(paramsTable[i].table);
			}

			if (projects.includes(post.table)) {

				var find = params.filter(function (result) {
					return result.table === 'project';
				});

				var db = find[0].db;
				fields = find[0].fields;

				var item = {};
				item.table = 'project';
				item.json = {};

				for (var i = 0; i < db.length; i++) {
					item.json[db[i]] = response[db[i]];
				}
				item.json.unixtime = unixtime;

				store.dispatch('insertItemApp', item);
				store.dispatch('insertItemDB', item);

				if (refresh == true) {
					var view = f7.views.current;
					view.router.refreshPage();
				}

			}

			////////////////
			// OTHER TABLES
			//////////////			

			var find = params.filter(function (result) {
				return result.table === table;
			});

			var db = find[0].db;
			var newSheetName = find[0].newSheetName;

			var item = {};
			item.table = table;
			item.json = {};

			for (var i = 0; i < db.length; i++) {
				item.json[db[i]] = response[db[i]];
			}
			item.json[table + '_unixtime'] = unixtime;

			store.dispatch('insertItemApp', item);
			store.dispatch('insertItemDB', item);

			console.log(table);

			if (refresh == true && table == 'directoryentry') {
				var view = f7.views.current;
				view.router.refreshPage();
			}			

			// Close preloader, form and show success alert
			f7.preloader.hide();
			f7.sheet.close(".c3-new-" + newSheetName);

			for (var i = 0; i < fields.length; i++) {
				this[fields[i]] = null;
			}

			// OTHER STUFF AFTER INSERT			

			if (table == 'lookup') {
				//Do nothing
			}
			else if (table == 'newsitem') {
				console.log("newsitem");
				var view = f7.views.current;

				//$$(".page-previous").remove();

				var toast = f7.toast.create({
					text: "Posted!",
					position: "center",
					closeTimeout: 1500,
				});
				toast.open();

				var url = '/news/' + post.projectid + '/';
				view.router.back(url, { ignoreCache: true });
			}
			else {
				if (post.name) {
					f7.dialog.alert('New ' + displayName + ' called ' + post.name + ' created.');
				}
				else {
					f7.dialog.alert('New ' + displayName + ' created.')
				}
			}
		},

		///////////
		// EVENT
		///////////
		eventNew(response) {
			f7.panel.close(".panel-left", true);
			f7.preloader.hide();
			var item = {
				event_id: response.event_id,
				event_name: response.event_name,
				event_userid: response.event_userid,
			};
			var toast = f7.toast.create({
				text: 'New event created!',
				position: 'center',
				closeTimeout: 1500,
			});
			toast.open();
			store.dispatch('addEventsList', item);
			f7.sheet.open("#actions-event");
		},

		///////////
		// LOOKUP
		///////////
		async lookupNew(json_post) {

			new Date; var unixtime = Date.now() / 1000;

			var item = {};
			item.json = {
				lookup_id: json_post.id,
				lookup_value: json_post.value,
				lookup_eventid: json_post.eventid,
				lookup_unixtime: unixtime
			};

			if (item.json.lookup_id == 'palette' || item.json.lookup_id == 'schedule-qr-codes') {
				var arr = JSON.parse(item.json.lookup_value);
				item.json.lookup_value = arr;

				if (item.json.lookup_id == 'palette') {
					this.getCustomColours();
				}
			}		

			await store.dispatch('deleteLookupApp', item.json.lookup_id);
			await store.dispatch('deleteLookupDB', item.json.lookup_id);

			await store.dispatch('insertLookupApp', item);
			await store.dispatch('insertLookupDB', item);

			if (item.json.lookup_id == 'appcolour') {
				this.getCustomColours();
			}		
			
			f7.preloader.hide();

			console.log('1 insert made to remote lookup table')
		},
	}
}