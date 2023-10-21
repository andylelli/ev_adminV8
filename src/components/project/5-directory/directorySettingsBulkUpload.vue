<template>
	<div>
		<f7-list class="no-margin-top">
			<f7-list-item title="Upload items from file">
				<template #media>
						<f7-icon>
							<font-awesome-icon class="fa-fw custom-colour" style="font-size: 20px" :icon="['fal', 'upload']" />
						</f7-icon>
</template>
				<input type="file" name="file-bulk-upload" id="file-bulk-upload" accept=".csv"
					class="input-file-bulk-upload c3-hide" />
				<f7-button fill class="color-green" @click="uploadData()">UPLOAD</f7-button>
			</f7-list-item>
		</f7-list>
	</div>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";
import { utils } from "framework7";

import { Dom7 } from "framework7";
var $$ = Dom7;

import newItem from "../../../mixins/newItem";
import misc from "../../../mixins/misc";
import fetch from "../../../mixins/fetch";
import login from "../../../mixins/login";

import params from "../../../js/config/params.js";
import escape from "../../../js/config/escape.js";

export default {
	name: "directory-settings-bulk-upload",
	data() {
		return {
			userid: store.state.userid,
			eventid: store.state.eventid,
			delimiter: ",",
			count: 0,
			error: false
		};
	},
	props: {
		projectid: Number,
	},
	mixins: [newItem, misc, fetch, login],
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
	},
	methods: {
		uploadData() {
			document.getElementById("file-bulk-upload").click();
		},
		csvToArray(file, delimiter) {
			// slice from start of text to the first \n index
			// use split to create an array from string by delimiter
			let str = new FileReader();

			str.readAsText(file);

			str.onload = () => {
				const headers = str.result
					.replaceAll("\r", "")
					.slice(0, str.result.indexOf("\n"))
					.replaceAll("\n", "")
					.split(delimiter);

				// slice to the end of the text
				// use split to create an array of each csv value row
				const rows = str.result
					.replaceAll("\r", "")
					.replaceAll('""', '@quot@')
					.replaceAll('"', "")
					.replaceAll('@quot@', '"')
					.replaceAll("\r", "")
					.slice(str.result.indexOf("\n"))
					.split("\n");

				// Map the rows to header values and create key value pair in array
				var vue = this;
				var data = rows.map(function(row) {
					const values = row.split(delimiter);
					const el = headers.reduce(function(object, header, index) {
						object[header] = values[index];
						return object;
					}, {});

					el.directoryentry_directoryid =
						vue.getDirectory.directory_id;
					el.directoryentry_eventid = vue.eventid;

					return el;
				});

				var len = data.length;
				if (data[len - 1].directoryentry_name == "") {
					data.pop();
				}

				var response = this.validate(headers, data);
				var message = response[0];
				var data = response[1];

				if (message.success != true) {
					f7.dialog.alert(message.error);
				} else {
					//console.log(data);
					this.sendToServer(data);
				}
			};

			str.onerror = () => {
				console.log(str.error);
			};
		},
		validate(headers, input) {
			var table = "directoryentry";
			var paramsTable = params.filter(function(result) {
				return result.table == table;
			});
			var bulkInsert = paramsTable[0].bulkInsert;
			var dataType;
			var dataMaxLen, field, fieldLength, fieldType;
			var field;
			var message = {};
			var row = 1;

			message.success = true;
			var output = input;

			input.forEach(item => {

				for (var i = 0; i < headers.length; i++) {
					dataType = bulkInsert[headers[i]][0];
					dataMaxLen = bulkInsert[headers[i]][1];

					field = item[headers[i]];
					fieldLength = field.length;
					if (fieldLength > dataMaxLen) {
						var msg = "Error in row " + row + ". Max length for " + headers[i] + " exceeded";
						message.success = false;
						message.error = msg;
						i = headers.length;
						return message;
					}

					if (dataType == "boolean" && parseInt(item[headers[i]]) < 2) {
						var msg = "Error in row " + row + ". " + headers[i] + " should be boolean";
						//Do nothing
					} else {
						if (parseInt(item[headers[i]]) || parseInt(item[headers[i]]) == 0) {
							fieldType = "number";
						} else {
							fieldType = "string";
						}
						if (fieldType != dataType) {
							var msg = "Error in row " + row + ". " + headers[i] + " should be " + dataType;
							message.success = false;
							message.error = msg;
							i = headers.length;
							return message;
						} else if (fieldType == "string") {
							var j = row - 1;
							var str = output[j][headers[i]];
							str = str.replaceAll("@comma@", ",");
							output[j][headers[i]] = escape.encodeXML(str);
						}
					}
				}
				row++
			});

			var response = [message, output];

			return response;


		},
		async sendToServer(data) {

			var total = data.length;

			this.progress(total);

			//post
			//console.log(post);

			// Send login post to server
			var vue = this;

			//Send each item to webserver
			for (let i = 0; i < data.length; i++) {

				// Data
				var arr = [];
				arr.push(data[i]);

				// Parameters
				var url = store.state.url + "api/post/insert/bulk/directoryentry";
				var method = "POST";
				var response = await vue.fetch(url, method, arr);

				//Check if the network is too slow
				if (this.networkError(response) == true) {
					return false;
				}

				// Success
				if (response.status != "success") {
					i = total;
					vue.error = true;
					return false;
				}
				vue.count++;
			}

			//response
			//console.log(response);
		},
		progress(total) {
			// Start timer to update progress dialog
			var progress = 0;
			var dialog = f7.dialog.progress("Loading", progress, "primary");
			var vue = this;
			var timer = setInterval(function() {
				// Update progress percentage
				progress = ((vue.count + 1) / total) * 100;

				var terminate = false;
				if (typeof dialog.setProgress == "function") {
					dialog.setProgress(progress);
					dialog.setText(parseInt(vue.count) + " of " + total);
				} else {
					terminate = true;
				}

				// If progress equals 100% then close dialogue and
				if (vue.count >= total || terminate === true || vue.error === true) {
					clearInterval(timer);
					dialog.close();

					if (vue.error == false) {
						f7.dialog.alert("Upload complete");
					} else if (vue.count > 0) {
						f7.dialog.alert("Partial upload. Please check file for errors");
					} else {
						f7.dialog.alert("Error. Please check file for errors");
					}

					vue.count = 0;

					localStorage.admin_counter = 0;

					var tables = ['directoryentry'];
					var fullSync = false;
					var getDeletes = false;
					vue.syncGetFromWebServer(
						vue.eventid,
						tables,
						fullSync,
						getDeletes
					);
				}
			}, 100);
		},
	},
	mounted() {
		f7ready((f7) => {
			var vue = this;
			$$(".input-file-bulk-upload").on("change", function(e) {
				var file = e.target.files[0];
				var delimiter = vue.delimiter;

				vue.csvToArray(file, delimiter);

				//var table = "directoryentry";
				//vue.bulkUpload(e, eventid, table);
			});
		});
	},
};
</script>

<!--<style scoped>

</style>-->