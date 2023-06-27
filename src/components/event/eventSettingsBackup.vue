<template>
  <div>
    <f7-block-header>BACKUP</f7-block-header>
    <f7-list>
      <f7-list-item title="Backup Event">
        <template #media>
          <f7-icon>
            <font-awesome-icon
              class="fa-fw custom-colour"
              style="font-size: 20px"
              :icon="['fal', 'text']"
            />
          </f7-icon>
        </template>
        <f7-button fill class="color-green" @click="backup()"
          >BACKUP</f7-button
        >
      </f7-list-item>
    </f7-list>
    <!-- <div v-if="this.getHiddenDirectories().length > 0">
			<div v-for="(item, i) in this.delimitedString" :key="i">
				<f7-block-header
					><div v-html="getQrCodeDate(item)"></div
				></f7-block-header>
				<p class="text-align-center" style="margin-bottom: 30px">
					<qrcode-vue
						:value="item"
						:size="size"
						:margin="margin"
						level="L"
					></qrcode-vue>
				</p>
			</div>
			<f7-text-editor
				:value="getDelimitedStrings(delimitedString)"
				@texteditor:change="(value) => (importString = value)"
				placeholder="Enter data..."
				:buttons="[[]]"
			>
			</f7-text-editor>
		</div>
		--></div>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import misc from "../../mixins/misc";
import fetch from "../../mixins/fetch";

export default {
  name: "event-settings-backup",
  data() {
    return {
      userid: store.state.userid,
      eventid: store.state.eventid,
    };
  },
  mixins: [misc, fetch],
  components: {},
  computed: {},
  methods: {
    backup() {
      // Parameters
      let url = store.state.url + "api/get/event/insert/backup/" + this.eventid;
      var method = "GET";
	  var data = null;

      // Post data
      this.fetch(url, method, data, this.success, this.failure);
    },
	success(json) {
		console.log(json);
	},
	failure(json) {
		console.log(json);
	},
    scheduleMaxHeight() {
      var scheduleid = this.getDirectory.directory_scheduleid;
      var hidenames = this.getDirectory.directory_hidenames;
      var height;
      if (scheduleid == 0 && hidenames == 0) {
        height = 0;
      } else if (scheduleid == 1 && hidenames == 0) {
        height = "80px";
      } else if (scheduleid == 1 && hidenames == 1) {
        height = "540px";
      } else {
        height = 0;
      }
      var z =
        "max-height:" +
        height +
        "; overflow: hidden; transition: max-height 0.4s ease-out";
      return z;
    },
  },
  mounted() {
    var vue = this;
    f7ready((f7) => {
      vue.delimitedString = store.getters.getLookup("schedule-qr-codes");
    });
  },
};
</script>

<!--<style scoped>

</style>-->