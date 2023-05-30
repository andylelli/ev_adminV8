<template>
	<div>
		<f7-list class="no-margin-top">
			<f7-list-item title="Upload items from file">
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'upload']"
						/> </f7-icon
				></template>
				<input
					type="file"
					name="file-bulk-upload"
					id="file-bulk-upload"
					accept=".csv"
					class="input-file-bulk-upload c3-hide"
				/>
				<f7-button fill class="color-green" @click="uploadData()"
					>UPLOAD</f7-button
				>
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

export default {
	name: "directory-settings-bulk-upload",
	data() {
		return {
			userid: store.state.userid,
			eventid: store.state.eventid,
			delimiter: ",",
		};
	},
	props: {
		projectid: Number,
	},
	mixins: [newItem, misc, fetch],
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
					.slice(str.result.indexOf("\n"))
					.split("\n");

				// Map the rows to header values and create key value pair in array
				var data = rows.map(function (row) {
					const values = row.split(delimiter);
					const el = headers.reduce(function (object, header, index) {
						object[header] = values[index];
						return object;
					}, {});
					return el;
				});

				data[0].directoryentry_lat = 0;
				data[0].directoryentry_lng = 0;
				data[0].directoryentry_shopid = 0;
				data[0].directoryentry_favourite = 0;
				data[0].directoryentry_directoryid =
					this.getDirectory.directory_id;
				data[0].directoryentry_eventid = this.eventid;

				this.sendToServer(data);
			};

			str.onerror = () => {
				console.log(str.error);
			};
		},
		async sendToServer(data) {
			var url = store.state.url;
			var url = url + "api/post/insert/bulk/directoryentry";

			f7.preloader.show();

			//post
			//console.log(post);

			// Send login post to server
			var method = "POST";
			var response = await this.fetch(url, method, data);

			//Check if the network is too slow
			if (this.networkError(response) == true) {
				return false;
			}

			//response
			//console.log(response);

			f7.preloader.hide();
			f7.dialog.alert(response.message);
		},
	},
	mounted() {
		f7ready((f7) => {
			var vue = this;
			$$(".input-file-bulk-upload").on("change", function (e) {
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

<!-- <style scoped>

</style>-->