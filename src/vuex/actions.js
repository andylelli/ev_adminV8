import params from "../js/config/params.js";
import escape from "../js/config/escape.js";
import Dexie from 'dexie';
var db = new Dexie('EvariaAdmin');

import { getDevice, Dom7 } from "framework7";
const device = getDevice();

var actions = {
    //IMPORT DIRECTORYENTRY NAMES
    importDirectoryentryNamesApp: ({ state }, string) => {

        var table = "directoryentry";

        var importArray = string.split("|");
        importArray.splice(0, 2);
        var itemArray = [];
        var itemId, itemName;
        var unixtime = Date.now() / 1000;

        importArray.forEach(lineitem => {

            itemArray = lineitem.split('#');

            itemId = parseInt(itemArray[0]);
            itemName = itemArray[1];

            var i = 0;
            var len = state[table].length;

            for (var i = 0; i < len; i++) {
                if (state[table][i][table + '_id'] == itemId) {
                    state[table][i][table + '_name'] = itemName;
                    state[table][i][table + '_unixtime'] = unixtime;
                }
            }
        });

        console.log('Directoryentry schedule names imported into App.');
    },
    importDirectoryentryNamesDB: ({ state }, string) => {

        var table = "directoryentry";

        var importArray = string.split("|");
        importArray.splice(0, 2);
        var itemArray = [];
        var itemId, itemName;
        var unixtime = Date.now() / 1000;

        db.open().then(function () {

            importArray.forEach(lineitem => {

                itemArray = lineitem.split('#');

                itemId = parseInt(itemArray[0]);
                itemName = itemArray[1];

                db.table(table)
                    .where(table + '_id').equals(itemId)
                    .modify({ directoryentry_name: itemName, directoryentry_unixtime: unixtime });
            });
        });

        console.log('Directoryentry schedule names imported into DB.');
    },
    //DELETE DIRECTORYENTRY NAMES
    deleteDirectoryentryNamesApp: ({ state }, directory) => {
        var unixtime = Date.now() / 1000;
        var len = state.directoryentry.length;
        for (var i = 0; i < len; i++) {
            if (state.directoryentry[i].directoryentry_directoryid == directory.directory_id) {
                state.directoryentry[i].directoryentry_name = 'TBC';
                state.directoryentry[i].directoryentry_unixtime = unixtime;
            }
        }

        var project = state.project.filter(
            (result) =>
                (result.project_id == directory.directory_projectid)
        );
        var projectName = project[0].project_name;

        console.log(
            "Directoryentry schedule names for " + projectName + " removed from App"
        );
    },
    deleteDirectoryentryNamesDB: ({ state }, directory) => {

        var table = "directoryentry";
        var key = "directoryentry_directoryid";
        var directoryid = directory.directory_id;
        var unixtime = Date.now() / 1000;

        db.open().then(function () {

            db.table(table)
                .where(key).equals(directoryid)
                .modify({ directoryentry_name: "TBC", directoryentry_unixtime: unixtime });
        });

        var project = state.project.filter(
            (result) =>
                (result.project_id == directory.directory_projectid)
        );
        var projectName = project[0].project_name;

        console.log(
            "Directoryentry schedule names for " + projectName + " removed from DB"
        );
    },

    //BASE STATE
    setAutoSync({ state }, value) {
        state.autosync = value;
    },
    setWorking({ state }, value) {
        state.working = value;
    },    
    setDevice({ state }) {
        var os;
        if (device.ios == true) {
            os = 'ios';
        }
        else if (device.android == true) {
            os = 'md';
        }
        state.os = os;
    },
    setInitiated({ state }) {
        state.initiated = true;
    },
    setEventsList: ({ state }, eventsList) => {
        state.eventsList = eventsList;
        localStorage.eventsList = JSON.stringify(eventsList);
    },
    addEventsList: ({ state }, item) => {
        state.eventsList.push(item);
        localStorage.eventsList = JSON.stringify(state.eventsList);
    },
    setUserCredentials({ state }) {
        state.userid = parseInt(localStorage.admin_userid);
        state.role = localStorage.admin_role;
        state.token = localStorage.admin_token;
        if (localStorage.admin_eventid) {
            state.eventid = parseInt(localStorage.admin_eventid);
        }
    },
    setInitialised: ({ state }) => {
        state.initialised = true;
    },

    initiateState: ({ state }, tables) => {
        for (var i = 0; i < tables.length; i++) {
            state[tables[i]] = [];
        }
    },
    deleteUserCredentials: ({ state }) => {
        state.userid = null;
        state.eventid = null;
        state.role = null;
        state.token = null;
    },
    //REORDER
    reorder: ({ state }, table) => {
        state[table].sort(function (a, b) {
            return a[table + '_position'] - b[table + '_position'];
        });
        console.log(table + ' reordered.');
    },

    //COMPASS
    setCompass: ({ state }, compass) => {
        state.compass = compass;
        console.log('Compass details updated');
    },

    //QR SCANNER
    setQRScanner: ({ state }, qrscanner) => {
        state.qrscanner = qrscanner;
        console.log('QR Scanner details updated');
    },
    clearQRScanner: ({ state }) => {
        state.qrscanner = {};
        console.log('QR Scanner details cleared');
    },

    ////////////////////////////////////////////////////////
    //
    // APP
    //
    ////////////////////////////////////////////////////////

    //INSERT
    insertItemApp: ({ state }, item) => {
        var findTable = params.filter(function (result) {
            return result.table === item.table;
        });
        var dbFields = findTable[0].db;
        var table = {};
        for (var i = 0; i < dbFields.length; i++) {
            table[dbFields[i]] = item.json[dbFields[i]];
        }

        state[item.table].push(table);
    },
    insertLookupApp: ({ state }, item) => {

        var lookup = {};
        lookup.lookup_id = item.json.lookup_id;
        lookup.lookup_value = item.json.lookup_value;
        lookup.lookup_eventid = item.json.lookup_eventid;
        lookup.lookup_unixtime = item.json.lookup_unixtime;

        //insert app
        state.lookup.push(lookup);

    },
    insertMarkerApp: ({ state }, item) => {

        //insert app
        state.marker.push(item);

        console.log('Marker called "' + item.marker_name + '" inserted into APP.');
    },

    ////////////////
    //UPDATE
    //////////////
    unhideNamesApp: ({ state }, id) => {

        var unixtime = Date.now() / 1000;
        var j=0;

        state.directoryentry.forEach(function () {

            if (state.directoryentry[j].directoryentry_directoryid == id) {

                state.directoryentry[j].directoryentry_schedulehide = 0;
                state.directoryentry[j].directoryentry_unixtime = unixtime;
            }
            j++;
        });
    },    
    updateItemApp: ({ state }, item) => {

        var table = item.table;
        var json = item.json;

        var findTable = params.filter(function (result) {
            return result.table === table;
        });
        var dbFields = findTable[0].db;

        var j = 0;
        state[table].forEach(function () {

            if (state[table][j][table + '_id'] == item.json[table + '_id']) {

                for (var i = 0; i < dbFields.length; i++) {
                    state[table][j][dbFields[i]] = json[dbFields[i]];
                }
            }
            j++;
        });
    },
    updateEditLongTextApp({ state }, item) {
        var table = item.table;
        item.value = escape.encodeXML(item.value);

        var i = 0;
        state[table].forEach(function () {
            if (state[table][i][item.table + '_id'] == item.id) {
                state[table][i][item.table + '_' + item.fieldname] = item.value;
                state[table][i][item.table + '_unixtime'] = item.unixtime;
            }
            i++;
        });
        console.log('Edit long text updated.');
    },
    updateLookupApp: ({ state }, item) => {

        var i = 0;
        state.lookup.forEach(function (lookup) {
            if (lookup.lookup_id == item.json.lookup_id && lookup.lookup_eventid == item.json.lookup_eventid) {
                state.lookup.splice(i, 1);
            }
            i++;
        });

        var lookup = {
            lookup_id: item.json.lookup_id,
            lookup_value: lookup_value,
            lookup_eventid: item.json.lookup_eventid,
            lookup_unixtime: item.json.lookup_unixtime
        };

        //insert app
        state.lookup.push(lookup);

        console.log('Lookup updated into APP.');
    },
    updateImageApp: ({ state }, item) => {

        var table = item.table;
        var i = 0;
        state[table].forEach(function () {

            if (state[table][i][table + '_id'] == item.id) {

                //update app
                state[table][i][table + '_image'] = item.base64image;
                state[table][i][table + '_unixtime'] = item.unixtime;
            }
            i++;
        });
        console.log(table + ' image updated in APP.');
    },
    updateHuntitemScannedApp: ({ state }, item) => {

        var i = 0;
        state.huntitem.forEach(function () {

            if (state.huntitem[i].huntitem_id == item.json.huntitem_id) {

                //update app;
                state.huntitem[i].huntitem_scanned = item.json.huntitem_scanned;
            }
            i++;
        });
    },
    updateMarkerApp: ({ state }, item) => {

        var i = 0;
        state.marker.forEach(function () {

            if (state.marker[i].marker_unixtime == unixtime) {

                //update app
                state.marker[i].marker_lat = item.json.marker_lat;
                state.marker[i].marker_lng = item.json.marker_lng;
                state.marker[i].marker_name = item.json.marker_name;
            }
            i++;
        });
        console.log('Marker called "' + item.json.marker_name + '" updated in APP.');
    },
    updatePollscoreApp: ({ state }, item) => {

        //Remove existing scores
        state.pollscore = state.pollscore.filter(function (result) {
            return result.pollscore_pollid !== item.pollid;
        });

        //insert new score        
        var i = 0;
        item.pollscores.forEach(function (pollscore) {
            state.pollscore.push(pollscore);
            i++;
        });

        console.log('Poll score updated in APP.');
    },
    ////////////////
    //DELETE
    //////////////
    deleteEventlistApp: ({ state }, id) => {

        var i = 0;
        state.event_list.forEach(function () {

            if (state.event_list[i].event_id == id) {
                state.event_list.splice(i, 1);
            }
            i++;
        });
        console.log('Event deleted from APP (eventlist).');
    },
    deleteItemApp: ({ state }, item) => {

        var id = item.id;
        var table = item.table;

        var tableid;
        if (!item.key) {
            tableid = item.table + "_id";
        }
        else tableid = item.key;

        var i = 0;
        state[table].forEach(function () {

            if (state[table][i][tableid] == id) {
                state[table].splice(i, 1);
            }
            i++;
        });
        console.log(table + ' deleted from APP.');
    },
    deleteAllApp: ({ state }, item) => {

        var id = item.id;
        var table = item.table;

        var tableid;
        if (!item.key) {
            tableid = table + "_id";
        }
        else tableid = table + "_" + item.key;

        var i = 0;
        var arr = []
        state[table].forEach(function () {

            if (state[table][i][tableid] != id) {
                arr.push(state[table][i]);
            }
            i++;
        });
        state[table] = arr;
        console.log(table + ' all items deleted from APP.');
    },
    deleteLookupApp: ({ state }, lookupid) => {
        var i = 0;
        state.lookup.forEach(function () {

            if (state.lookup[i].lookup_id == lookupid) {
                state.lookup.splice(i, 1);
                console.log('Lookup ' + lookupid + ' deleted from DB.');
            }
            i++;
        });
    },
    deleteMarkerApp: ({ state }, unixtime) => {

        var i = 0;
        state.marker.forEach(function () {

            if (state.marker[i].marker_unixtime == unixtime) {
                state.marker.splice(i, 1);
                console.log('Marker deleted from APP.');
                return;
            }
            i++;
        });
    },
    //SORT
    sortApp: ({ state }, json) => {

        var list = json.list;
        var table = json.table;

        new Date;
        var unixtime = Date.now() / 1000;
        var sorted;
        var j;
        if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {
                j = 0;
                var id = list[i];
                state[table].forEach(function (item) {
                    if (item[table + '_id'] == id) {
                        state[table][j][table + '_position'] = i;
                        state[table][j][table + '_unixtime'] = unixtime;
                        sorted = true;
                    }
                    j++;
                });
            }
            if (sorted === true) {
                console.log(table + ' resorted in App.');
            }
        }
    },

    ////////////////
    //DB
    //////////////
    initiateDB: ({ state }, tables) => {
        db.open().then(function () {
            for (var i = 0; i < tables.length; i++) {
                db.table(tables[i])
                    .clear();
            }
        }).catch(function (err) {
            console.error('Failed to open db: ' + (err.stack || err));
        });
    },

    //INSERT
    insertItemDB: ({ state }, item) => {
        db.open().then(function () {
            db.table(item.table).add(item.json);
        });
    },
    insertLookupDB: ({ state }, item) => {

        db.open().then(function () {

            db.table('lookup')
                .where({
                    lookup_id: item.json.lookup_id,
                    lookup_eventid: item.json.lookup_eventid
                })
                .delete();

            db.table('lookup').add({
                lookup_id: item.json.lookup_id,
                lookup_value: item.json.lookup_value,
                lookup_eventid: item.json.lookup_eventid,
                lookup_unixtime: item.json.lookup_unixtime,
            });
        });
    },
    //UPDATE
    unhideNamesDB: ({ state }, id) => {

        var unixtime = Date.now() / 1000;

        db.open().then(function () {

            var item = {
                directoryentry_schedulehide: 0,
                directoryentry_unixtime: unixtime
            }

            db.table('directoryentry')
                .where('directoryentry_directoryid')
                .equals(id)
                .modify(item);
        });

    }, 
    updateItemDB: ({ state }, item) => {

        var tableid = item.table + "_id";

        db.open().then(function () {

            db.table(item.table)
                .where(tableid)
                .equals(item.json[item.table + '_id'])
                .modify(item.json);
        });
    },
    updateImageDB: ({ state }, item) => {

        var table = item.table
        db.open().then(function () {

            db.table(table)
                .where(table + "_id")
                .equals(item.id)
                .modify({
                    [table + '_image']: item.base64image,
                    [table + '_unixtime']: item.unixtime
                });
        });
        console.log(table + ' image updated in DB.');
    },
    updateLookupDB: ({ state }, item) => {

        db.open().then(function () {

            db.table('lookup')
                .where({
                    lookup_id: item.json.lookup_id,
                    lookup_eventid: item.json.lookup_eventid
                })
                .modify({
                    lookup_value: lookup_value,
                    lookup_unixtime: item.unixtime,
                });

        });
        console.log('Lookup entry called "' + item.json.lookup_id + '" updated in DB.');
    },
    updateHuntitemScannedDB: ({ state }, item) => {
        db.open().then(async function () {

            db.table('huntitem')
                .where("huntitem_id")
                .equals(item.json.huntitem_id)
                .modify(item.json);
        });
    },
    updateMarkerDB: ({ state }, item) => {

        db.open().then(function () {

            db.table('markers')
                .where("marker_unixtime")
                .equals(unixtime)
                .modify({
                    marker_lat: item.json.marker_lat,
                    marker_lng: item.json.marker_lng,
                    marker_name: item.json.marker_name,
                });
        });
        console.log('Marker called "' + item.json.marker_name + '" in DB.');
    },
    updatePollscoreDB: ({ state }) => {

        db.open().then(function () {
            //Remove existing scores            
            db.table('pollscore')
                .where('pollscore_pollid').equals(item.pollid)
                .delete();
            //insert new score
            item.pollscores.forEach(function (pollscore) {
                db.table('pollscore').add(pollscore);
            });
        });
        console.log('Poll score updated in DB.');
    },
    //DELETE
    deleteAllDB: ({ state }, item) => {
        if (!item) {
            var tables = [];
            for (var i = 0; i < params.length; i++) {
                if (params[i].table) {
                    tables.push(params[i].table);
                }
            }
            db.open().then(function () {
                for (var i = 0; i < tables.length; i++) {
                    db.table(tables[i])
                        .clear();
                }
            });
            for (var i = 0; i < tables.length; i++) {
                state[tables[i]] = [];
            }
        }
        else {
            var table = item.table
            db.table(table)
                .clear();

            console.log(table + ' all items deleted from DB.');
        }
    },
    deleteItemDB: ({ state }, item) => {

        var tableid;
        if (!item.key) {
            tableid = item.table + "_id";
        }
        else tableid = item.key;

        db.open().then(function () {
            db.table(item.table)
                .where(tableid).equals(item.id)
                .delete();
        });
        console.log(item.table + ' deleted from DB');
    },
    deleteLookupDB: ({ state }, lookupid) => {

        db.open().then(function () {
            db.table('lookup')
                .where('lookup_id').equals(lookupid)
                .delete();
            console.log('Lookup ' + lookupid + ' deleted from DB.');
        });
    },
    deleteMarkerDB: ({ state }, unixtime) => {

        db.open().then(function () {
            db.table('marker')
                .where('marker_unixtime').equals(unixtime)
                .delete();
        });
        console.log('Marker deleted from DB.');
    },

    //SORT
    sortDB: ({ state }, json) => {

        var list = json.list;
        var table = json.table;

        if (list.length > 0) {
            db.open().then(function () {
                new Date;
                var unixtime = Date.now() / 1000;
                for (var i = 0; i < list.length; i++) {

                    var id = parseInt(list[i]);
                    state[table].forEach(function (item) {

                        if (item[table + '_id'] === id) {
                            db.table(table).where(table + "_id").equals(id).modify({
                                [table + '_position']: i,
                                [table + '_unixtime']: unixtime
                            });
                        }
                    });
                }
                localStorage['admin_update_' + table + '_time'] = unixtime;
                console.log(table + ' resorted in DB.');
            });
        }
    },
};

export default actions;