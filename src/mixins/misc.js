import params from "../js/config/params.js";
import store from "../vuex/store.js";

import { f7 } from "framework7-vue";
import { utils } from 'framework7';

import { Dom7 } from "framework7";
var $$ = Dom7;

export default {
	methods: {
		sortList(els, table) {

			var positionList = [];

			//Create new order list array
			els.forEach(function (el) {
				var x = $$(el).attr('id');
				if (x) {
					var id = x.replace("sort-" + table + "-", "");
					positionList.push(id);
				}
			});

			var json = {
				list: positionList,
				table: table
			}

			//Re order directoryentries
			store.dispatch('reorder', table);
			store.dispatch('sortApp', json);
			store.dispatch('sortDB', json);

		},
		lightOrDark(color, type) {

			var hex;

			if (type == 'rgb') {

				function ColorToHex(color) {
					var hexadecimal = color.toString(16);
					return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
				}

				hex = "#" + ColorToHex(parseInt(color[0])) + ColorToHex(parseInt(color[1])) + ColorToHex(parseInt(color[2]));
			}
			else {
				hex = color;
			}

			hex = hex.replace('#', '');
			const c_r = parseInt(hex.substr(0, 2), 16);
			const c_g = parseInt(hex.substr(2, 2), 16);
			const c_b = parseInt(hex.substr(4, 2), 16);
			const hsp = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;


			// Using the HSP value, determine whether the color is light or dark

			//Is Light?
			if (hsp > 80) {
				return "light";
			}

			//Is Dark
			if (hsp < 180) {
				return "dark"
			}
		},
		toast(message) {
			var toastTop = f7.toast.create({
				text: message,
				position: 'top',
				closeTimeout: 2000,
			});
			toastTop.open();
		},
		async getQRCode(id, table) {

			// Parameters
			var url = store.state.url + 'api/get/qrcode/guest/' + id;
			var method = 'GET'
			var response = await this.fetch(url, method);

			// Success
			if (response[0].data.length > 0) {

				new Date();
				var unixtime = Date.now() / 1000;

				// Prepare App and DB Insert / Update
				var item = {};
				item.table = 'qrcode';
				item.json = response[0].data[0];

				// Remove server timestamp
				delete item.json['qrcode_uxtime'];

				// Set local timestamp
				item.json['qrcode_unixtime'] = unixtime;

				store.dispatch('insertItemApp', item);
				store.dispatch('insertItemDB', item);

				console.log("1 insert made to qrcode");
			} 
			// Failure
			else {
				console.log('QR code failure - please set error action!');
			}
		},
		async changeEvent(eventid) {

			await db.open();

			event_query = await db.table('event').toArray();

			app.methods.event.length = 0;
			event_query.forEach(event => {
				if (event.event_id == eventid) {
					app.methods.event.push(event);
				}
			});
		},
		async setLightPalette() {
			var palette = store.getters.getLookup("palette");

			var vue = this;

			var lightPalette = [];

			if (palette.length > 0) {
				palette.forEach(function (colour) {

					var rgbArr = colour.substring(4, colour.length - 1).replace(/ /g, '').split(',');

					var ld = vue.lightOrDark(rgbArr, 'rgb');
					if (ld == 'light') {
						lightPalette.push(colour);
					}
				});

				new Date();
				var unixtime = Date.now() / 1000;

				var item = {
					json: {
						lookup_id: "light-palette",
						lookup_value: lightPalette,
						lookup_eventid: store.state.eventid,
						lookup_unixtime: unixtime
					},
				};
				store.dispatch("insertLookupApp", item);
				store.dispatch("insertLookupDB", item);
			}
		},
		getCustomColours() {

			// Your CSS as text
			var find = store.state.lookup.filter(function (result) {
				return result.lookup_id === "appcolour";
			});

			var colour;
			if (find.length > 0) {
				colour = "#" + find[0].lookup_value
			}
			else {
				colour = "#2b2b2b";
			}
			f7.setColorTheme(colour);
		},
		clearLocalStorage() {

			localStorage.removeItem("admin");
			localStorage.removeItem("admin_counter");
			localStorage.removeItem("admin_role");
			localStorage.removeItem("admin_email");
			localStorage.removeItem("admin_token");
			localStorage.removeItem("admin_eventid");
			localStorage.removeItem("admin_userid");
			localStorage.removeItem("eventsList");

			localStorage.removeItem("syncStatus");
			localStorage.removeItem("fullSync");

			var dbTables = params.filter(function (result) {
				return result.table;
			});
			dbTables.forEach(item => {
				localStorage.removeItem("admin_sync_" + item.table + "_time");
				localStorage.removeItem("admin_update_" + item.table + "_time");

			});

			store.dispatch('deleteUserCredentials');

			var colour = "#2b2b2b";
			var customCSS = ':root ';
			var customColour = JSON.stringify(utils.colorThemeCSSProperties(colour));
			customColour = customColour.replace(/\"/g, "");
			customColour = customColour.replace(",--", "; --");
			customColour = customColour.replace(",--", "; --");
			customColour = customColour.replace(",--", "; --");
			customColour = customColour.replace(",--", "; --");
			customColour = customColour.replace("}", ";}");
			customCSS = customCSS + customColour;

			var styleSheet = document.createElement("style");
			styleSheet.id = "my-custom-colour";
			styleSheet.innerText = customCSS;
			document.head.appendChild(styleSheet);

		},
		loadCounter(total, page) {
			var vue = this;
			var timer = setInterval(function () {
				if (localStorage.admin_counter >= total) {
					clearInterval(timer);
					if (page) {
						//$$('#' + page + '-icon-sync').toggleClass('fa-spin');
					}

					var paramsSort = params.filter(function (result) {
						return result.sort == true;
					});

					paramsSort.forEach(function (item) {
						store.dispatch('reorder', item.table);
					});

					f7.preloader.hide();
					f7.dialog.alert('Updates done.');
				}
			}, 100);
		},
		accordianSlide(id, px) {
			var x = document.getElementById(id);

			if (x.style.maxHeight == '0px') {
				if (px === 0) {
					x.style.maxHeight = x.scrollHeight + "px";
				}
				else {
					x.style.maxHeight = (px) + "px";
				}
			} else {
				x.style.maxHeight = '0px';
			}

		},
		decodeHTML(html) {
			var txt = document.createElement('textarea');
			txt.innerHTML = html;
			return txt.value;
		},
		rgbToHex(r, g, b) {
			const rgb = (r << 16) | (g << 8) | (b << 0);
			return '#' + (0x1000000 + rgb).toString(16).slice(1);
		},
		getScheduleDays() {
			//Get event start / end
			var a = this.getEventStartEnd();
			var start = a[0].start;
			var end = a[0].end;
			var days = a[0].days;

			function getOrdinalNum(n) {
				return (
					n +
					(n > 0
						? ["TH", "ST", "ND", "RD"][
						(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10
						]
						: "")
				);
			}

			const dofw = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

			var event_length = days;
			var scheduleArr = [];
			var j = 0;
			var button_start = new Date(start);

			for (var i = 0; i < event_length; i++) {
				j = i + 1;
				var date = button_start.getDate();
				var dateTH = this.getOrdinalNum(date);
				var day = dofw[button_start.getDay()];

				var item = {};
				item.class = "show-tab-" + j + " col button color-grey";
				item.label = day + " " + dateTH;
				scheduleArr.push(item);

				button_start.setDate(button_start.getDate() + 1);
			}
			return scheduleArr;
		},
		getEventDates() {
			//Get event start / end
			var a = this.getEventStartEnd();
			var start = a[0].start;
			var end = a[0].end;
			var days = a[0].days;

			var event_length = days;
			var datesArr = [];
			var j = 0;
			var eventDate = new Date(start);

			for (var i = 0; i < event_length; i++) {
				j = i + 1;
				var year = eventDate.getFullYear().toString();;
				var month = (eventDate.getMonth() + 1).toString();
				var day = eventDate.getDate().toString();

				if (month.length < 2) month = "0" + month;
				if (day.length < 2) day = "0" + day;

				var date = year + month + day;
				datesArr.push(date);

				eventDate.setDate(eventDate.getDate() + 1);
			}
			return datesArr;
		},
		getEventStartEnd() {
			var event_startdate_Y = this.event.event_startdate.substring(0, 4);
			var event_startdate_M = this.event.event_startdate.substring(4, 6) - 1;
			var event_startdate_D = this.event.event_startdate.substring(6, 8);

			var event_enddate = this.event.event_enddate;
			var event_enddate_Y = event_enddate.substring(0, 4);
			var event_enddate_M = event_enddate.substring(4, 6) - 1;
			var event_enddate_D = event_enddate.substring(6, 8);

			var start = new Date(
				event_startdate_Y,
				event_startdate_M,
				event_startdate_D
			);
			var end = new Date(event_enddate_Y, event_enddate_M, event_enddate_D);

			var res = Math.abs(end - start) / 1000;
			var days = Math.floor(res / 86400) + 1;

			var response = [];
			var obj = {};
			obj.start = start;
			obj.end = end;
			obj.days = days;

			response.push(obj);

			return response;
		},
		getOrdinalNum(n) {
			return (
				n +
				(n > 0
					? ["TH", "ST", "ND", "RD"][
					(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10
					]
					: "")
			);
		},
		getOrdinalNumLower(n) {
			return (
				n +
				(n > 0
					? ["th", "st", "nd", "rd"][
					(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10
					]
					: "")
			);
		},
		getDateFromYYYYMMDD(yyyymmdd) {
			const year = + yyyymmdd.substring(0, 4);
			const month = + yyyymmdd.substring(4, 6);
			const day = + yyyymmdd.substring(6, 8);
			const date = new Date(year, month - 1, day);
			return date;
		},
		formatDate(yyyymmdd) {
			var inputDate = this.getDateFromYYYYMMDD(yyyymmdd);
			var date = inputDate.getDate();
			var dateTH = this.getOrdinalNum(date);
			const dofw = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
			var day = dofw[inputDate.getDay()];
			var month = inputDate.getMonth().toString();
			var months = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			];
			var monthName = months[month].toUpperCase();

			return day + " " + dateTH + " " + monthName;
		},
		formatDateLower(yyyymmdd) {
			var inputDate = this.getDateFromYYYYMMDD(yyyymmdd);
			var date = inputDate.getDate();
			var dateTH = this.getOrdinalNumLower(date);
			const dofw = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			var day = dofw[inputDate.getDay()];
			var month = inputDate.getMonth().toString();
			var months = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			];
			var monthName = months[month];

			return day + " " + dateTH + " " + monthName;
		},
		getDirectoriesWithSchedule() {
			//Get array of directories with a schedule
			var dirWithSchedule = this.directory.filter(function (result) {
				return result.directory_scheduleid === 1;
			});
			var dirArray = [];
			dirWithSchedule.forEach(function (item) {
				dirArray.push(item.directory_id);
			});
			return dirArray;
		},
		getDirectoriesWithLocation() {
			//Get array of directories with a schedule
			var dirWithLocation = this.directory.filter(function (result) {
				return result.directory_mapid > 0;
			});
			var dirArray = [];
			dirWithLocation.forEach(function (item) {
				dirArray.push(item.directory_id);
			});
			return dirArray;
		},
		deleteCache(workboxCache) {
			console.log(workboxCache);
			var cacheName = "workbox-precache-v2-" + workboxCache;
			console.log(cacheName);
			//caches.delete(cacheName).then(function (boolean) {
			//	console.log("workbox-precache-v2 is now deleted");
			//});

			var cacheName = "evaria-user-precache";
			caches.delete(cacheName).then(function (boolean) {
				console.log("evaria-user-precache is now deleted");
			});

			var cacheName = "evaria-user-js-cache";
			caches.delete(cacheName).then(function (boolean) {
				console.log("evaria-user-js-cache is now deleted");
			});

			var cacheName = "evaria-user-css-cache";
			caches.delete(cacheName).then(function (boolean) {
				console.log("evaria-user-css-cache is now deleted");
			});

			var cacheName = "evaria-user-html-cache";
			caches.delete(cacheName).then(function (boolean) {
				console.log("evaria-user-html-cache is now deleted");
			});

			var find = store.state.lookup.filter(function (result) {
				return result.lookup_id === "update-pending";
			});

			if (find.length > 0) {
				store.dispatch("deleteLookupApp", "update-pending");
				store.dispatch("deleteLookupDB", "update-pending");
			}

			localStorage.app_update_in_progress = 'true';

			f7.sheet.close(".sheet-update-available");

			//window.location.reload();
			//console.log("reloaded");
		},
		typeidToName(typeid) {
			switch (typeid) {
				case 1:
					return 'poll';
				case 2:
					return 'scoreboard';
				case 3:
					return 'queue';
				case 4:
					return 'pindrop';
				case 5:
					return 'directory';
				case 6:
					return 'shop';
				case 7:
					return 'hunt';
				case 8:
					return 'news';
				case 9:
					return 'schedule';
			}
		},
		async updatePollscores(pollid, page) {

			// Prepare submit URL
			var url = store.state.url;
			var eventid = store.state.eventid;
			var guestid = localStorage.uniqueId;
			var token = store.state.token;

			// Parameters
			var getURL =
				url +
				"api/get/pollscore/" +
				pollid +
				"/" +
				eventid +
				"/" +
				token +
				"/" +
				guestid;
			var method = "GET";
			var data = null;
			var success = null;
			var failure = null;
			var response = await this.fetch(getURL, method, data, success, failure, page);

			var eventName = f7.params.name;;

			// Success
			if (response.status == 'ended') {
				f7.dialog.alert(response.message, eventName);
				return false;
			}
			else {

				// Prepare to update poll scores
				new Date();
				var unixtime = Date.now() / 1000;
				var arr = [];
				response.forEach((item) => {
					if (item.pollitem_id) {
						var json = {
							pollscore_pollitemid: item.pollitem_id,
							pollscore_count: item.count,
							pollscore_vote: item.vote,
							pollscore_pollid: pollid,
							pollscore_eventid: eventid,
							pollscore_unixtime: unixtime,
						};
						arr.push(json);
					}
				});

				var json = {
					pollid: pollid,
					pollscores: arr,
				};

				// Update poll scores in app and DB
				store.dispatch("updatePollscoreApp", json);
				store.dispatch("updatePollscoreDB", json);

				if (response[0].poll_live === 1) {
					return true;
				}
				else {
					return false;
				}
			}
		},
		unixtimeConversion(unixtime) {
			var a = new Date(unixtime * 1000);
			var months = [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec",
			];
			var year = a.getFullYear();
			var month = months[a.getMonth()];
			var date = a.getDate();
			var hour = "0" + a.getHours();
			var min = "0" + a.getMinutes();
			var sec = "0" + a.getSeconds();

			var time =
				date +
				" " +
				month +
				" " +
				year +
				" " +
				hour.substr(-2) +
				":" +
				min.substr(-2) +
				":" +
				sec.substr(-2);

			return time;
		},
		networkError(response, page) {
			if (store.state.autosync == "ok") {
				if (!response) {
					f7.preloader.hide();
					if (page == 'autosync') {
						var vue = this;
						var message =
							"Slow network. Action didn't complete.";

						f7.dialog.alert(message, function () {
							store.dispatch("setAutoSync", "pause");
						});
					}
					else {
						f7.dialog.alert("Slow network. Action didn't complete");
					}

					return true;
				}
				else { return false; }
			}
		},
		setHiddenQrDatesLookup() {
			new Date();
			var unixtime = Date.now() / 1000;

			var dates = [];
			var json = {};

			if (this.event.event_hideqrtype == 1) {
				json = {
					date: "ALL",
					hasSchedule: 0
				};
				dates.push(json);
			}

			if (this.event.event_hideqrtype == 2) {
				var eventDates = this.getEventDates()
				eventDates.forEach(date => {
					json = {
						date: date,
						hasSchedule: 0
					};
					dates.push(json);
				});
			}

			var item = {};
			item.json = {
				lookup_id: "hidden-qr-dates",
				lookup_value: dates,
				lookup_eventid: this.event.event_id,
				lookup_unixtime: unixtime
			};

			store.dispatch('insertLookupDB', item);
			store.dispatch('insertLookupApp', item);
		},
		//////// ADMIN NEW

		getParams(url) {
			var params = {};
			var parser = document.createElement('a');
			parser.href = url;
			var query = parser.search.substring(1);
			var vars = query.split('&');
			for (var i = 0; i < vars.length; i++) {
				var pair = vars[i].split('=');
				params[pair[0]] = decodeURIComponent(pair[1]);
			}
			return params;
		},
		backupDateFormat(str) {
			var files = str.split("|");
			var backups = [];
	
			for (let i = 0; i < files.length; i++) {
			  var json = {
				id: files[i],
			  };
	
			  const file = files[i].split("_");
			  const year = file[0].substring(0, 4);
			  const MM = file[0].substring(4, 6);
			  const DD = file[0].substring(6, 8);
	
			  const dateObj = new Date(year + "-" + MM + "-" + DD);
	
			  const months = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			  ];
	
			  const nth = function (d) {
				if (d > 3 && d < 21) return "th";
				switch (d % 10) {
				  case 1:
					return "st";
				  case 2:
					return "nd";
				  case 3:
					return "rd";
				  default:
					return "th";
				}
			  };
	
			  const monthIndex = dateObj.getMonth();
			  const month = months[monthIndex];
	
			  const day = dateObj.getDate();
	
			  const strDate = day + nth(day) + " " + month + " " + year;
	
			  const hh = file[1].substring(0, 2);
			  const mm = file[1].substring(2, 4);
			  const ss = file[1].substring(4, 6);
	
			  const strTime = hh + ":" + mm + ":" + ss;
	
			  const name = strDate + " " + strTime;
	
			  json.name = name;
	
			  backups.push(json);
			}
			return backups;
		}
	}
}