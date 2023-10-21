import { f7, f7ready } from "framework7-vue";
import params from "./config/params.js";
import store from "../vuex/store.js";
import Dexie from 'dexie';

import misc from "../mixins/misc.js";

var localLoad = {

    async initiateAppFromLocalDB() {

        if (store.state.initiated == false) {

            // Log where app is being initialised from
            console.log('Initialise App from local DB');

            // Get list of all tables stored in local DB
            var table = store.getters.getTableNames("all");

            // Initialise Store state
            await store.dispatch("initiateState", { table });

            // Initialise user credentials
            await store.dispatch("setUserCredentials");

            // Initialise Local DB
            var db = new Dexie("EvariaAdmin");
            await db.open();

            // Local data into app from local DB
            var state = store.state;

            for (var i = 0; i < table.length; i++) {

                this[table[i] + '_query'] = await db.table(table[i]).toArray();

                state[table[i]].length = 0;
                this[table[i] + '_query'].forEach(j => {
                    state[table[i]].push(j);
                });

                if (table[i] == 'lookup') {
                    misc.methods.getCustomColours();
                }
            }

            //Sort tables to display rows in correct order
            var paramsSort = params.filter(function (result) {
                return result.sort == true;
            });

            paramsSort.forEach(function (item) {
                var table = item.table;
                store.dispatch("reorder", table);
            });


            // Local QR code data into app from local DB
            var qrcodes_query = await db.table('qrcode').toArray();
            state.qrcode.length = 0;
            qrcodes_query.forEach(qrcode => {
                state.qrcode.push(qrcode);
            });

            // Local events list into app from localStorage
            var eventsListString = localStorage.eventsList;
            if (eventsListString) {
                var eventsList = JSON.parse(eventsListString);
                if (eventsList) {
                    store.dispatch('setEventsList', eventsList);
                    store.dispatch('setInitiated');
                }
            }

            if (store.state.event.length > 0) {
                f7.params.name = store.state.event[0].event_name;
            }
        }

    },
};

export default localLoad;