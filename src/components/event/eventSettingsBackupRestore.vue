<template>
  <div>
    <f7-block-header>BACKUP RESTORE</f7-block-header>
    <f7-list>
      <f7-list-item title="Backup / Restore" link @click="openBackupRestore()">
        <template #media>
          <f7-icon>
            <font-awesome-icon
              class="fa-fw custom-colour"
              style="font-size: 20px"
              :icon="['fal', 'upload']"
            />
          </f7-icon>
        </template>
      </f7-list-item>
    </f7-list>
  </div>
</template>

<script>
import { f7 } from "framework7-vue";

export default {
  name: "event-backup-restore",
  data() {
    return {};
  },
  mixins: [],
  computed: {},
  methods: {
    openBackupRestore() {
      f7.views.main.router.navigate("/event-settings-backup-restore/");
    },
  },
  mounted() {},
};
</script>

<!-- <style scoped>

</style>-->