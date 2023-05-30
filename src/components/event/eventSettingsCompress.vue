<template>
	<div>
		<f7-block-header>COMPRESS</f7-block-header>
		<f7-text-editor
			:value="uncompressed"
			@texteditor:change="(value) => (uncompressed = value)"
			placeholder="Enter text..."
			:buttons="[[]]"
		/>
		<f7-button large round button-outline @click="compress()"
			>COMPRESS</f7-button
		>
		<f7-text-editor
			:value="compressed"
			@texteditor:change="(value) => (compressed = value)"
			placeholder="Enter text..."
			:buttons="[[]]"
		/>
		<f7-block>
			<p>{{ this.uncompressedLength }}</p>
			<p>{{ this.compressed }}</p>
			<p>{{ this.compressedLength }}</p>
			<p>{{ this.decompressed }}</p>
		</f7-block>
	</div>
</template>

<script>
import store from "../../vuex/store.js";

import LZString from "../js/config/compress.js";
import Base64String from "../js/config/base64Compress.js";

export default {
	name: "event-settings-compress",
	data() {
		return {
			userid: store.state.userid,
			eventid: store.state.eventid,
			uncompressed: "",
			uncompressedLength: "",
			compressed: "",
			compressedLength: "",
			decompressed: "",
		};
	},
	mixins: [],
	computed: {
		getEvent() {
			if (store.state.event.length > 0) {
				return store.state.event[0];
			} else {
				return false;
			}
		},
	},
	methods: {
		compress() {
			var string = this.uncompressed;
			this.uncompressedLength = string.length;
			var compressed = this.lzw_encode(string);
			this.compressedLength = compressed.length;
			this.compressed = compressed;
			this.decompressed = this.lzw_decode(compressed);
		},
		lzw_encode(s) {
			var dict = {};
			var data = (s + "").split("");
			var out = [];
			var currChar;
			var phrase = data[0];
			var code = 256;
			for (var i = 1; i < data.length; i++) {
				currChar = data[i];
				if (dict[phrase + currChar] != null) {
					phrase += currChar;
				} else {
					out.push(
						phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0)
					);
					dict[phrase + currChar] = code;
					code++;
					phrase = currChar;
				}
			}
			out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
			for (var i = 0; i < out.length; i++) {
				out[i] = String.fromCharCode(out[i]);
			}
			return out.join("");
		},

		lzw_decode(s) {
			var dict = {};
			var data = (s + "").split("");
			var currChar = data[0];
			var oldPhrase = currChar;
			var out = [currChar];
			var code = 256;
			var phrase;
			for (var i = 1; i < data.length; i++) {
				var currCode = data[i].charCodeAt(0);
				if (currCode < 256) {
					phrase = data[i];
				} else {
					phrase = dict[currCode]
						? dict[currCode]
						: oldPhrase + currChar;
				}
				out.push(phrase);
				currChar = phrase.charAt(0);
				dict[code] = oldPhrase + currChar;
				code++;
				oldPhrase = phrase;
			}
			return out.join("");
		},
	},
	mounted() {},
};
</script>

<!-- <style scoped>

</style>-->