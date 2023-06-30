<template>
  <f7-sheet
    class="justify-content-center"
    id="sheet-restore"
    style="height: auto; --f7-sheet-bg-color: #fff"
    swipe-to-close
    backdrop
  >
    <f7-page-content>
      <f7-block>
        <f7-block-header>AVAILABLE BACK UPS</f7-block-header>
        <f7-list>
          <f7-list-item
            v-for="(filename, i) in this.getBackupFiles"
            :key="i"
            :title="filename"
          >
            <template #media>
              <f7-icon>
                <font-awesome-icon
                  class="fa-fw custom-colour"
                  style="font-size: 20px"
                  :icon="['fal', 'database']"
                />
              </f7-icon>
            </template>
          </f7-list-item>
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
  name: "sheet-restore",
  data() {
    return {
      event: store.state.event,
      displayName: null,
      subtable: null,
      data: {},
      fields: [],
      allowChange: false,
    };
  },
  components: {
    generalButton,
  },
  inject: ["eventBus"],
  computed: {},
  methods: {},
  beforeMounted() {},
  mounted() {},
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
