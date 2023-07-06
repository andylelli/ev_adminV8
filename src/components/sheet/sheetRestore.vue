<template>
  <f7-sheet
    class="justify-content-center"
    id="sheet-restore"
    style="height: auto; --f7-sheet-bg-color: #fff"
    swipe-to-close
    backdrop
    @sheet:open="sheetOpen()"
  >
    <f7-page-content>
      <f7-block>
        <f7-block-title
          ><div align="center">AVAILABLE BACK UPS</div></f7-block-title
        >
        <f7-list inset strong>
          <f7-list-button
            v-for="(file, i) in this.files"
            :key="i"
            :id="file.id"
            :title="file.name"
            @click="restore(file.id)"
          >
          </f7-list-button>
        </f7-list>
      </f7-block>
    </f7-page-content>
  </f7-sheet>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import misc from "../../mixins/misc";

import generalButton from "../misc/generalButton.vue";

export default {
  name: "sheet-restore",
  data() {
    return {
      files: [],
    };
  },
  mixins: [misc],
  components: {
    generalButton,
  },
  inject: ["eventBus"],
  computed: {},
  methods: {
    sheetOpen() {
      var str = store.getters.getLookup("backup-files");
      if (str.length > 0) {
        this.files = this.backupDateFormat(str);
      } else {
        return [];
      }
    },
    restore(id) {
      f7.sheet.close("#sheet-restore", true);
      this.eventBus.emit("restore-file", id);
    },
  },
  beforeMounted() {},
  mounted() {
    var vue = this;

    //Event Open sheet restore
    this.eventBus.on("open-sheet-restore", (x) => {
      f7.sheet.open("#sheet-restore", true);
    });
    this.eventBus.eventsListeners["open-sheet-restore"].splice(1);
  },
};
</script>

<style scoped>
@media (min-width: 1024px) {
  .sheet-modal {
    margin-left: 25%;
    width: 50% !important;
  }
}
</style>
