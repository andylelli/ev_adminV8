<template>
    <f7-page stacked name="event-settings-backup-restore">
        <!-- Nav bar-->
        <f7-navbar>
            <nav-back-link></nav-back-link>
            <f7-nav-title>
                <div>Backup / Restore</div>
            </f7-nav-title>
            <nav-bars></nav-bars>
        </f7-navbar>
        <!-- Main -->
        <event-settings-backup></event-settings-backup>
        <event-settings-restore></event-settings-restore>
    </f7-page>
</template>

<script>
import store from "../../vuex/store.js";

import navBackLink from "../misc/nav/navBackLink.vue";
import navBars from "../misc/nav/navBars.vue";

import eventSettingsBackup from "./eventSettingsBackup.vue";
import eventSettingsRestore from "./eventSettingsRestore.vue";

export default {
    data() {
        return {
            eventid: store.state.eventid,
            lookup: store.state.lookup,
        };
    },
    components: {
        navBackLink,
        navBars,
        eventSettingsBackup,
        eventSettingsRestore,
    },
    computed: {},
    methods: {},
    mounted() {},
};
</script>

<style scoped>

</style>
