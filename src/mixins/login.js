import Dexie from 'dexie';
var db = new Dexie('EvariaAdmin');

import params from "../js/config/params.js";

import store from "../vuex/store.js";

import { f7, f7ready } from "framework7-vue";
import { Dom7 } from "framework7";

var $$ = Dom7;

// userLogin
// initiateAppFromRemoteDB
// syncGetFromWebServer
// userLogout

export default {
    methods: {
        initiateAppFromRemoteDB() {

            //Log where app is being initialised from
            console.log('Initialise App from remote server');

            var tables = store.getters.getTableNames("all");
            store.dispatch('initiateState', tables);

            // Set last sync times to zero
            for (var i = 0; i < tables.length; i++) {
                localStorage[store.state.role + '_sync_' + tables[i] + '_time'] = 0;
            }

            // Set last update times to zero
            for (var i = 0; i < tables.length; i++) {
                localStorage[store.state.role + '_update_' + tables[i] + '_time'] = 0;
            }

            // Prepare Dexie DB table information from JSON file parameters
            var dbTables = params.filter(function (result) {
                return result.table;
            });
            var dbJson = {}
            for (var i = 0; i < dbTables.length; i++) {
                var findTable = dbTables.filter(function (result) {
                    return result.table === dbTables[i].table;
                });
                var dbFields = findTable[0].db;
                var commaSep = dbFields.join(", ");
                var commaSep = "++id, " + commaSep;
                dbJson[dbTables[i].table] = commaSep;
            }

            // Initialise Dexie DB
            var db = new Dexie("EvariaAdmin");

            // Add data to DB
            db.version(1).stores(dbJson);
            db.open().catch(function (err) {
                console.error('Failed to open db: ' + (err.stack || err));
            });

            store.dispatch('initiateDB', tables);

            return true;
        },
        async progress(eventid) {

            // Get table count and initialise variables
            var table = store.getters.getTableNames("remote");
            var total = table.length;
            var progress = 0;
            var initialised = false;

            // Show progress dialog
            f7.preloader.hide();
            var dialog = f7.dialog.progress('Loading', progress, 'primary');
            dialog.setText('Loading 0 of ' + total);
            dialog.setProgress(progress);

            // Set counter to zero
            localStorage[store.state.role + '_counter'] = 0;

            // Close left panel and navigate to main page
            f7.panel.close(".panel-left", true);
            f7.views.main.router.navigate({
                url: '/main/' + eventid + '/',
                force: true
            });

            // Start timer to update progress dialog
            var timer = setInterval(function () {

                // Get latest from the loading counter
                var count = Number(localStorage[store.state.role + '_counter']);

                // Update progress percentage
                if (count > total) { count = total; }
                progress = (count / total) * 100;

                var terminate = false;
                if (typeof dialog.setProgress == 'function') {
                    dialog.setProgress(progress);
                    dialog.setText(parseInt(progress) + '% downloaded');
                }
                else {
                    terminate = true;
                }

                // If progress equals 100% then close dialogue and
                if ((count >= total && initialised === false) || terminate === true) {
                    clearInterval(timer);
                    dialog.close();
                    f7.views.main.router.clearPreviousHistory();
                }
            }, 100);
        },
        async syncGetFromWebServer(eventid, tables, fullSync, getDeletes) {

            // Get array of tables
            var table = store.getters.getTableNames("remote");

            // Initialise variables
            var tableArr = [];
            var sync_time = [],
                update_time = [],
                i;

            // Check if tables to get have been set specifically for this instance
            if (tables) {
                tableArr = tables;
            }
            else {
                tableArr = table
            }

            // Create an array of last sync times
            for (i = 0; i < tableArr.length; i++) {
                var j = localStorage[store.state.role + '_sync_' + tableArr[i] + '_time'];
                if (!j || fullSync === true) {
                    j = 0;
                }
                sync_time.push(j);
            }

            // Create an array of last local update times
            for (i = 0; i < tableArr.length; i++) {
                var j = localStorage[store.state.role + '_update_' + tableArr[i] + '_time'];
                update_time.push(j);
                if (!j) {
                    j = 0;
                }
            }

            //GET INSERTS AND UPDATES FROM WEBSERVER

            // Loop through table list and execute a GET fecth
            for (var i = 0; i < tableArr.length; i++) {

                // Initiate insert and update counters
                var insert = 0;
                var update = 0;

                // Parameters
                var method = 'GET';
                var url = store.state.url + 'api/get/update/' + tableArr[i] + '/' + eventid + '/' + sync_time[i];

                var response = await this.fetch(url, method);

                if (response) {

                    if (response[0].status == "success") {

                        // Set timestamp variable
                        new Date;
                        var unixtime = Date.now() / 1000;

                        // Loop through each response item and insert into local App and DB storage
                        for (j = 0; j < response[0].data.length; j++) {

                            // Prepare App and DB Insert / Update
                            var item = {};
                            item.table = tableArr[i];
                            item.json = response[0].data[j];

                            // Remove server timestamp
                            delete item.json[tableArr[i] + '_uxtime'];

                            // Set local timestamp
                            item.json[tableArr[i] + '_unixtime'] = unixtime;

                            //Check if item is for not for lookup table
                            if (tableArr[i] != 'lookup') {

                                // Check if this is going to be an insert or an update
                                var find = store.state[tableArr[i]].filter(function (result) {
                                    return result[tableArr[i] + '_id'] === response[0].data[j][tableArr[i] + '_id'];
                                });

                                // Insert
                                if (find.length < 1) {
                                    store.dispatch("insertItemApp", item);
                                    store.dispatch("insertItemDB", item);
                                    insert++;
                                }
                                // Update
                                else {
                                    store.dispatch("updateItemApp", item);
                                    store.dispatch("updateItemDB", item);
                                    update++;
                                }

                            } else {

                                // Check if this is going to be an insert or an update
                                var find = store.state.lookup.filter(function (result) {
                                    return (result.lookup_id === response[0].data[j].lookup_id && result.lookup_eventid === response[0].data[j].lookup_eventid);
                                });

                                if (item.json.lookup_id == 'palette' || item.json.lookup_id == 'schedule-qr-codes') {
                                    item.json.lookup_value = item.json.lookup_value.replace(/\\/g, "");
                                    var arr = JSON.parse(item.json.lookup_value);
                                    item.json.lookup_value = arr;
                                }

                                // Insert
                                if (find.length < 1) {
                                    store.dispatch('insertLookupApp', item);
                                    store.dispatch('insertLookupDB', item);
                                    insert++;
                                }

                                // Update
                                else {
                                    store.dispatch('insertLookupApp', item);
                                    store.dispatch('insertLookupDB', item);
                                    update++;
                                }

                                // Set custom colours
                                this.getCustomColours();
                            }
                        }

                        // Update counter
                        localStorage[store.state.role + '_counter'] = Number(localStorage[store.state.role + '_counter']) + 1;

                        // Update last sync time
                        localStorage[store.state.role + '_sync_' + tableArr[i] + '_time'] = unixtime + 1;

                        // Logging
                        if (insert > 0) {
                            console.log(insert + ' insert(s) made to ' + tableArr[i]);
                        }
                        else if (update > 0) {
                            console.log(update + ' update(s) made to ' + tableArr[i]);
                        }
                        else {
                            console.log('0 insert(s)/update(s) made to ' + tableArr[i]);
                            if (tableArr[i] == 'lookup') {
                                this.getCustomColours();
                            }
                        };
                    }
                    else {
                        f7.dialog.close();
                        f7.dialog.alert(response[0].message);
                    }
                }
                else {

                    // Set working spinner to error
                    store.dispatch("setWorking", "stopping");

                    // Set error
                    store.dispatch("setError", true);

                    //No network
                    f7.dialog.close();
                    f7.dialog.alert("No network.");
                    return;
                }
            };

            if (getDeletes == true) {
                await this.getDeletes(tableArr, eventid);
            }

            this.sortDB();

        },
        async getDeletes(tableArr, eventid) {

            //GET DELETES FROM WEBSERVER

            // Initialise variables
            var response;
            var state = store.state;

            // Loop through each response remove necessary items from local App and DB storage            
            for (var i = 0; i < tableArr.length; i++) {

                // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                // This needs to be parameterised
                // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                if (tableArr[i] != 'user' && tableArr[i] != 'event' && tableArr[i] != 'lookup' && tableArr[i] != 'qrcode' && tableArr[i] != 'guest' && tableArr[i] != 'shop' && tableArr[i] != 'shopitem' && tableArr[i] != 'order' && tableArr[i] != 'orderdetail') {

                    // Create an array of item ids from local App memory
                    var find = state[tableArr[i]].filter(function (result) {
                        return result[tableArr[i] + '_eventid'] === eventid;
                    });

                    // Data
                    var items = [];
                    for (j = 0; j < find.length; j++) {
                        var t_id = tableArr[i] + '_id';
                        var t_eventid = tableArr[i] + '_eventid';
                        var json = {}
                        json[t_id] = find[j][t_id];
                        json[t_eventid] = find[j][t_eventid];
                        items.push(json);
                    }

                    // Parameters
                    var url = store.state.url + 'api/post/delete/' + tableArr[i];
                    var method = 'POST';
                    var response = await this.fetch(url, method, items);

                    // Log number of items need to be deleted according to the response
                    console.log((response.length - 1) + ' delete(s) to ' + tableArr[i]);

                    // Loop through loop array and delete necessary items
                    for (var j = 1; j < response.length; j++) {
                        var item = {
                            id: response[j].id,
                            table: tableArr[i],
                        }

                        store.dispatch("deleteItemApp", item);
                        store.dispatch("deleteItemDB", item);
                    }

                    // Update counter                    
                    localStorage[store.state.role + '_counter'] = Number(localStorage[store.state.role + '_counter']) + 1;
                }
                else {
                    // Update counter
                    localStorage[store.state.role + '_counter'] = Number(localStorage[store.state.role + '_counter']) + 1;
                }
            }

        },
        sortDB(ptr) {
            //Sort tables to display rows in correct order
            var paramsSort = params.filter(function (result) {
                return result.sort == true;
            });

            paramsSort.forEach(function (item) {
                var table = item.table;
                store.dispatch("reorder", table);
            });

            // Hide preloader, remove login page and set initialised flag to true
            f7.preloader.hide();

            // Set store as initialised
            if (ptr == false) {
                $$(".page-previous").remove();
                store.dispatch("setInitialised");
            }
        },
        async userLogout() {

            // Close left panel
            f7.panel.close(".panel-left");

            $$(".view").hide();

            // Delete DB            
            db.delete().then(() => {
                console.log("Database successfully deleted");
            }).catch((err) => {
                console.error("Could not delete database");
            });

            // Clear data from Store
            var tables = store.getters.getTableNames("all");
            store.dispatch("initiateState", tables);

            // Delete data from localStorage
            this.clearLocalStorage();

            // Go back to login page
            f7.views.main.router.navigate("/login/", { reloadAll: true });
            $$(".login").show();
            $$(".login-button").show();
            $$(".logged-in").hide();

            setTimeout(() => {
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(function (registrations) {
                        for (let registration of registrations) {
                            // registration.update();  does not work!
                            registration.unregister();
                        }
                        window.location.reload(true);
                    });
                }
            }, 1000);
            f7.views.main.router.navigate("/login/", { reloadAll: true });
        },
    },
};