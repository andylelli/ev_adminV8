<template>
  <div>
    <f7-list
      accordion-list
      class="ripple-color-primary no-margin-top no-padding-top sort-project"
      title="Nested List"
    >
      <f7-list-item accordion-item title="NEW CONTENT" style="font-size: 14px">
        <template #media>
          <f7-icon>
            <font-awesome-icon
              class="fa-fw custom-colour"
              style="font-size: 20px"
              :icon="['fal', 'plus']"
            />
          </f7-icon>
        </template>
        <f7-accordion-content>
          <f7-list class="no-divider" style="cursor: pointer">
            <f7-list-item
              v-for="item in projectTypes"
              :key="item.id"
              :title="UCFirstDisplayName(item.table)"
              @click="newProject(item.table)"
              class="no-divider"
            >
              <template #media>
                <f7-icon>
                  <font-awesome-icon
                    class="fa-fw custom-colour"
                    style="font-size: 20px"
                    :icon="setIcon(item.icon)"
                  />
                </f7-icon>
              </template>
            </f7-list-item>
          </f7-list>
        </f7-accordion-content>
      </f7-list-item>
    </f7-list>
  </div>
</template>

<script>
import { f7, f7ready } from "framework7-vue";

import { Dom7 } from "framework7";
var $$ = Dom7;

import misc from "../../mixins/misc";
import params from "../../js/config/params.js";

export default {
  name: "new-project",
  data() {
    return {};
  },
  mixins: [misc],
  inject: ["eventBus"],
  computed: {
    projectTypes() {
      var paramsTable = params.filter(function (result) {
        return result.newSheetName == "project";
      });
      return paramsTable;
    },
  },
  methods: {
    UCFirstDisplayName(table) {
      var paramsTable = params.filter(function (result) {
        return result.table == table;
      });
      var displayName = paramsTable[0].displayName;
      return displayName.charAt(0).toUpperCase() + displayName.slice(1);
    },
    setIcon(icon) {
      return ["fal", icon];
    },
    newProject(table) {
      var json = {
        table: "project",
        subtable: table,
        projectName: table,
      };
      this.eventBus.emit("new-item", json);
    },
  },
  mounted() {
    f7ready((f7) => {
      $$(".item-link").addClass("ripple-color-primary");
    });
  },
};
</script>

<style scoped>
.ripple-color-primary {
  --f7-theme-color-ripple-color: rgba(var(--f7-theme-color-rgb), 0.15);
}
.no-divider {
  --f7-list-item-border-color: none;
}
</style>
