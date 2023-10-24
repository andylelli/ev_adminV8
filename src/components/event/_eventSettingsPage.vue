<template>
    <f7-page stacked name="event-settings">
        <!-- Nav bar-->
        <f7-navbar>
            <nav-back-link :page="'main'" :id="this.eventid"></nav-back-link>
            <f7-nav-title>Event Settings</f7-nav-title>
            <nav-bars></nav-bars>
        </f7-navbar>
        <!-- Main -->
        <div v-if="getEvent">
            <segment header="Name">
                <field-edit-text type="single" :id="this.getEvent.event_id" table="event" fieldname="name"></field-edit-text>
            </segment>
            <event-settings-image></event-settings-image>
            <event-settings-qr-code></event-settings-qr-code>
            <event-settings-date-time></event-settings-date-time>
            <event-settings-dark-theme></event-settings-dark-theme>
            <settings-auto-update></settings-auto-update>
            <event-settings-sync></event-settings-sync>
            <event-settings-full-load></event-settings-full-load>
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
          <event-settings-hidenames></event-settings-hidenames>
          <general-button
            class="margin-bottom"
            @generalButtonAction="deleteItem()"
            label="DELETE"
            width="200"
            colour="red"
            type="fill"
          ></general-button>
          <sheet-edit table="event"></sheet-edit>
        </div>
      </f7-page>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { Dom7 } from "framework7";
var $$ = Dom7;

import { getDevice } from "framework7";
const device = getDevice();

import login from "../../mixins/login";
import fetch from "../../mixins/fetch";
import misc from "../../mixins/misc";
import deleteItem from "../../mixins/deleteItem";

import navBackLink from "../misc/nav/navBackLink.vue";
import navBars from "../misc/nav/navBars.vue";

import segment from "../misc/segment.vue";
import fieldEditText from "../misc/fieldEditText.vue";
import generalButton from "../misc/generalButton.vue";

import eventSettingsDateTime from "./eventSettingsDateTime.vue";
import eventSettingsImage from "./eventSettingsImage.vue";
import eventSettingsDarkTheme from "./eventSettingsDarkTheme.vue";
import settingsAutoUpdate from "./settingsAutoUpdate.vue";
import eventSettingsSync from "./eventSettingsSync.vue";
import eventSettingsFullLoad from "./eventSettingsFullLoad.vue";
import eventSettingsHidenames from "./eventSettingsHidenames.vue";
import eventSettingsQrCode from "./eventSettingsQrCode.vue";

import sheetEdit from "..//sheet/sheetEdit.vue";

export default {
    data() {
        return {
            eventid: store.state.eventid,
            lookup: store.state.lookup,
            desktop: device.desktop,
        };
    },
    components: {
        navBackLink,
        navBars,
        segment,
        sheetEdit,
        generalButton,
        fieldEditText,
        eventSettingsDateTime,
        eventSettingsImage,
        eventSettingsDarkTheme,
        settingsAutoUpdate,
        eventSettingsSync,
        eventSettingsFullLoad,
        eventSettingsHidenames,
        eventSettingsQrCode,
    },
    mixins: [login, deleteItem, misc, fetch],
    computed: {
        getEvent() {
            var item = {
                table: "event",
                key: "id",
                id: store.state.eventid,
                type: "single",
            };
            return store.getters.getData(item);
        },
        getGuest() {
            var item = {
                table: "guest",
                key: "eventid",
                id: store.state.eventid,
                type: "single",
            };
            return store.getters.getData(item);
        },        
    },
    methods: {
        openBackupRestore() {
            f7.views.main.router.navigate("/event-settings-backup-restore/");
        },
        deleteItem() {
            this.deleteItemButton(
                this.getEvent.event_id,
                "event",
                this.getEvent.event_name
            );
        },
    },
    mounted() {
        f7ready((f7) => {
            this.$watch(
                "getEvent",
                function(newValue, oldValue) {
                    if (this.getEvent) {
                        new Date();
                        var unixtime = Date.now() / 1000;

                        var item = {};
                        item.table = "event";
                        item.json = this.getEvent;

                        store.dispatch("updateItemDB", item);


                        //var guest_email = this.getEvent.event_name.replace(/\s+/g, '-').toLowerCase();

                        //var item = {};
                        //item.table = "guest";
                        //item.json = this.getGuest;
                        //item.json.guest_email = guest_email + "@evaria.io";;
                        //item.json.guest_lastname = "Evaria";
                        //item.json.guest_firstname = this.getEvent.event_name;
                        //item.json.guest_unixtime = unixtime;

                        //store.dispatch("updateItemApp", item);
                        //store.dispatch("updateItemDB", item);

                        localStorage.admin_update_event_time = unixtime;
                        localStorage.admin_update_guest_time = unixtime;
                    }
                }, { deep: true }
            );
        });
    },
};
</script>

<style scoped>
:root {
    --f7-list-button-text-align: center;
}
</style>
