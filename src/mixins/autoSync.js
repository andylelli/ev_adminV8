import Dexie from 'dexie';
import store from "../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

export default {
    methods: {
        autoSync() {
            var sync = setInterval(async () => {
                var item = {
                    table: "event",
                    key: "id",
                    id: store.state.eventid,
                    type: "single"
                }
                var event = store.getters.getData(item);
                if (event) {
                    if (event.event_autosync === 1) {
                        if (store.state.initiated === true) {
                            if (localStorage.network != 'offline') {
                                this.syncPutToWebServer(null, null, null);
                            }
                        }
                    }
                }
            }, 3000);
        },
        syncPutToWebServer(fullSync, manualSync, tables) {
            var vue = this;
            var table = store.getters.getTableNames('remote');

            var db = new Dexie('EvariaAdmin');
            db.open().catch(function (err) {
                console.error('Failed to open db: ' + (err.stack || err));
            }).then(function () {

                if (tables) {
                    var tableArr = tables;
                }
                else {
                    var tableArr = table
                }

                //set sync times array        
                var sync_time = [];
                var j;
                for (var i = 0; i < tableArr.length; i++) {
                    j = localStorage['admin_sync_' + tableArr[i] + '_time'];
                    if (j == null || j == 'NaN') {
                        j = "0";
                    }
                    sync_time.push(j);
                }

                //set update times array    
                var update_time = [];
                var j;
                for (var i = 0; i < tableArr.length; i++) {
                    j = localStorage['admin_update_' + tableArr[i] + '_time'];
                    if (j == null || j == 'NaN') {
                        j = "0";
                    }
                    update_time.push(j);
                }

                var get = async () => {

                    var noUpdates = true;
                    //loop through list of tables
                    for (var i = 0; i < tableArr.length; i++) {

                        //check if there has been an update since the last sync               
                        if (sync_time[i] < update_time[i] || fullSync === true) {

                            noUpdates = false;

                            //select from indexDB
                            var query;
                            if (tableArr[i] == 'event') {
                                query = await db.table(tableArr[i]).where(tableArr[i] + '_id').equals(store.state.eventid).toArray();
                            }
                            else {
                                query = await db.table(tableArr[i]).where(tableArr[i] + '_eventid').equals(store.state.eventid).toArray();
                            }

                            //create array of updates to make from rows with update time greater that last sync time
                            var arr = [];
                            var c = 0;
                            query.forEach(t => {

                                //remove image
                                if (t[tableArr[i] + '_image']) {
                                    delete t[tableArr[i] + '_image'];
                                }

                                for (var j = 0; j < tableArr.length; j++) {
                                    if (tableArr[i] == tableArr[j]) {
                                        if (t[tableArr[j] + '_unixtime'] > sync_time[i] || fullSync === true) {
                                            if (t.lookup_id == "palette" || t.lookup_id == "schedule-qr-codes") {
                                                t.lookup_value = JSON.stringify(t.lookup_value);
                                            }
                                            arr.push(t)
                                            c++;
                                        }
                                    }
                                }
                            });

                            // log
                           //console.log(arr);

                            if (arr.length > 0) {

                                //Parameters
                                var url = store.state.url + 'api/post/update/' + tableArr[i];
                                var method = 'POST';
                                var data = arr;
                                var success = null;
                                var failure = null;
                                var page = 'autosync';
                                var response = await vue.fetch(url, method, data, success, failure, page);

                                //
                                if (response != false) {

                                    if (response[0].status == 'success') {

                                        var successCount = response[0].count;
                                        var errorCount = response[0].errors;
                                        var msg;

                                        if (successCount != 0 || errorCount != 0) {
                                            if (successCount == c) {
                                                if (successCount == 1) {
                                                    msg = ' update ';
                                                } else {
                                                    msg = ' updates ';
                                                }
                                                console.log(successCount + msg + 'made to remote ' + tableArr[i] + ' table');
                                            }
                                            else {
                                                if (errorCount == 1) {
                                                    msg = ' error ';
                                                } else {
                                                    msg = ' errors ';
                                                }
                                                console.log(errorCount + msg + 'while updating ' + tableArr[i] + ' table');
                                            }
                                        }
                                        else {
                                            localStorage['admin_sync_' + tableArr[i] + '_time'] = unixtime - 1;
                                            console.log('0 ' + tableArr[i] + ' updates.');
                                        }

                                        new Date;
                                        var unixtime = Date.now() / 1000;

                                        if (successCount != 0 || errorCount != 0) {

                                            localStorage['admin_sync_' + tableArr[i] + '_time'] = unixtime - 1;

                                        }
                                    }
                                    else {
                                        localStorage['admin_sync_' + tableArr[i] + '_time'] = unixtime - 1;
                                        console.log(response[0].message + ' for ' + tableArr[i]);
                                    }
                                }
                            }
                        }
                    }

                    //reset full sync stuff
                    if (fullSync == true || manualSync == true) {
                        f7.preloader.hide();
                        if (noUpdates == true) {
                            f7.dialog.alert('No updates.');
                        }
                        else {
                            f7.dialog.alert('Updates done.');
                        }
                    }
                }
                get();
            });
        }
    }
};