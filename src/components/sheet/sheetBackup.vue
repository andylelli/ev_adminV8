<template>
  <f7-sheet
    class="justify-content-center"
    id="sheet-backup"
    style="height: auto; --f7-sheet-bg-color: #fff"
    swipe-to-close
    backdrop
  >
    <f7-page-content>
      <f7-block>
        <f7-block-title
          ><div align="center">SELECT BACK UP TO OVERWRITE</div></f7-block-title
        >
        <f7-list inset strong>
          <f7-list-button
            v-for="(file, i) in this.files"
            :key="i"
            :id="file.id"
            :title="file.name"
            @click="remove(file.id)"
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

import generalButton from "../misc/generalButton.vue";

export default {
  name: "sheet-backup",
  data() {
    return {
      files: [],
    };
  },
  components: {
    generalButton,
  },
  inject: ["eventBus"],
  computed: {},
  methods: {
    remove(id) {
      f7.sheet.close("#sheet-backup", true);
      this.eventBus.emit("delete-file", id);
    },
  },
  beforeMounted() {},
  mounted() {
    var vue = this;

    // Event - Open sheet backup
    this.eventBus.on("open-sheet-backup", (json) => {
      vue.files = json.files;
      f7.sheet.open("#sheet-backup", true);
      if (vue.eventBus.eventsListeners["open-sheet-backup"].length > 1) {
        vue.eventBus.eventsListeners["open-sheet-backup"].splice(1);
      }
    });
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
