<template>
  <f7-swipeout-actions right>
    <f7-swipeout-button :color="'red'" @click="deleteListItem(id, table, name)">
      <font-awesome-icon
        :id="'swipeout-' + table + '-delete-' + id"
        style="font-size: 24px; display: block"
        :icon="['fal', 'trash']"
      />
      <font-awesome-icon
        :id="'swipeout-' + table + '-spinner-' + id"
        class="fa-spin"
        style="font-size: 22px; margin-left: -3px; display: none"
        :icon="['fal', 'sync']"
      />
      <font-awesome-icon
        :id="'swipeout-' + table + '-tick-' + id"
        style="font-size: 24px; display: none"
        :icon="['fal', 'check']"
      />
      <font-awesome-icon
        :id="'swipeout-' + table + '-error-' + id"
        style="font-size: 24px; display: none"
        :icon="['fal', 'times']"
      />
    </f7-swipeout-button>
  </f7-swipeout-actions>
</template>

<script>
import deleteItem from "../../mixins/deleteItem";
import misc from "../../mixins/misc";
import fetch from "../../mixins/fetch";

export default {
  name: "swipeout-actions",
  data() {
    return {};
  },
  props: ["id", "name", "table"],
  mixins: [deleteItem, misc, fetch],
  inject: ["eventBus"],
  computed: {},
  methods: {
    deleteListItem(id, table, name) {
      this.eventBus.emit("is-delete", true);
      this.deleteItem(id, table, name);
      this.eventBus.emit("is-delete", false);
    },
  },
  mounted() {},
};
</script>

<style scoped>
</style>