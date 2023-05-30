import params from "../js/config/params.js";
import store from "../vuex/store.js";

export default {
    methods: {

        getTableNames: ({ state }, type) => {
            var dbTables;
            var tables = [];
            if (type === 'remote') {
                dbTables = params.filter(function (result) {
                    return result.table && !result.localOnly;
                });
            }
            else if (type === 'local') {
                dbTables = params.filter(function (result) {
                    return result.table && !result.localOnly === true;
                });
            }
            //else get all
            else {
                dbTables = params.filter(function (result) {
                    return result.table;
                });
            }
            for (var i = 0; i < dbTables.length; i++) {
                tables.push(dbTables[i].table);
            }
            return tables;
        },
        getData(item) {

            var table = item.table;
            var key = item.key;
            var id = item.id;
            var type = item.type;
            var sort = item.sort;

            var data = store.state[table].filter(function (result) {
                return result[table + '_' + key] === id;
            });

            if (sort) {
                data.sort(function (a, b) {
                    return a[table + '_position'] - b[table + '_position'];
                });
            }

            if (type == 'single') {
                if (data.length > 0) {
                    return data[0];
                }
            }
            else if (type == 'multiple') {
                if (data.length > 0) {
                    return data;
                }
            }
        },
        getMessagerTitle: ({ state }, id) => {
            var title = state.messager.title;
            return title;
        },
        getLocations: ({ state }, id) => {
            var directories_parentid = state.directory.filter(function (result) {
                return result.directory_parentid > 0;
            });
            var directories_mapid = state.directory.filter(function (result) {
                return result.directory_mapid > 0;
            });

            var location_types = [];
            directories_parentid.forEach(function (directory_parentid) {
                var find = directories_mapid.filter(function (result) {
                    return result.directory_id === directory_parentid.directory_parentid;
                });
                if (find.length > 0) {
                    var exist = location_types.some(function (location_type) {
                        return location_type.directory_id === find[0].directory_id;
                    });

                    if (exist === false) {
                        location_types.push(find[0]);
                    }
                }
            });

            var locations = [];
            location_types.forEach(function (location_type) {
                var find = state.directoryentry.filter(function (result) {
                    return result.directoryentry_directoryid === location_type.directory_id;
                });
                if (find.length > 0) {
                    for (var i = 0; i < find.length; i++) {
                        locations.push(find[i]);
                    }
                }
            });
            return locations;
        },
        getQRCode: ({ state }, id) => {
            var find = state.qrcode.filter(function (result) {
                return result.qrcode_guestid == id;
            });
            if (find.length > 0) {
                return find[0].qrcode_image;
            }
        },
        getCompass: ({ state }) => {
            return state.compass;
        },
        getMessages: ({ state }, id) => {
            if (state.messager.messages.length > 0) {
                return state.messager.messages;
            }
        },
        getOrderHistory: ({ state }, shopid) => {
            var find = state.order.filter(function (result) {
                return result.order_shopid === shopid;
            });
            return find;
        },
        getCartQuantity: ({ state }, shopid) => {
            var find = state.shopcart.filter(function (result) {
                return result.shopid === shopid;
            });
            return find.length;
        },
        getShopcart: ({ state }, shopid) => {
            var find = state.shopcart.filter(function (result) {
                return result.shopid === shopid;
            });
            return find;
        },
        getShopCartItem: ({ state }, json) => {
            var find = state.shopcart.filter(function (result) {
                return result.shopid === json.shopid && result.id === json.id;
            });
            return find[0];
        },
        getLookup: ({ state }, id) => {
            var find = state.lookup.filter(function (result) {
                return result.lookup_id === id
            });
            if (find.length > 0) {
                return find[0].lookup_value;
            }
            else {
                return false;
            }
        },
        getLookupColour: ({ state }, pos) => {
            var find = state.lookup.filter(function (result) {
                return result.lookup_id === 'palette'
            });
            if (find.length > 0) {
                var colours = find[0].lookup_value;
                var json = JSON.parse(colours);
                return json[pos];
            }
        },
        getLookupColourLight: ({ state }, pos) => {
            var find = state.lookup.filter(function (result) {
                return result.lookup_id === 'light-palette'
            });
            if (find.length > 0) {
                var colours = find[0].lookup_value;
                var json = JSON.parse(colours);
                var len = json.length;
                var mod = (pos % len);
                return json[mod];
            }
        },
        getDirectoryentries: ({ state }, projectid) => {
            var find = state.directory.filter(function (result) {
                return result.directory_projectid === projectid;
            });
            if (find.length > 0) {
                var directoryid = find[0].directory_id;
                var find = state.directoryentry.filter(function (result) {
                    return result.directoryentry_directoryid === directoryid;
                });
                find.sort(function (a, b) {
                    return a.directoryentry_position - b.directoryentry_position;
                });
                return find;
            }
        },
        getParentDirectoryentries: ({ state }, projectid) => {
            var find = state.directory.filter(function (result) {
                return result.directory_projectid === projectid;
            });

            if (find[0].directory_parentid > 0) {
                var parentdirectoryid = find[0].directory_parentid;

                var find = state.directoryentry.filter(function (result) {
                    return (
                        result.directoryentry_directoryid === parentdirectoryid
                    );
                });
                return find;
            }
        },
        getMarkers: ({ state }, mapid) => {
            var markers = [];
            var marker;

            //Get pindrop id from project id
            var find = state.pindrop.filter(function (result) {
                return result.pindrop_projectid === mapid;
            });

            if (find.length > 0) {
                var pindropid = find[0].pindrop_id;

                //Get directories with this pindrop id
                var find = state.directory.filter(function (result) {
                    return result.directory_mapid === pindropid;
                });

                //All markers
                find.forEach(function (directory) {
                    marker = state.directoryentry.filter(function (result) {
                        return result.directoryentry_directoryid === directory.directory_id
                    });
                    for (let i = 0; i < marker.length; i++) {
                        marker[i].directory_colourid = directory.directory_colourid;
                        markers.push(marker[i]);
                    }
                });
                return markers;
            }
        },
        getCustomMarkers: ({ state }, projectid) => {

            //Get pindrop id from project id
            var find = state.pindrop.filter(function (result) {
                return result.pindrop_projectid === projectid;
            });

            if (find.length > 0) {
                var pindropid = find[0].pindrop_id;

                //Get markers associated with this map
                var markers = state.marker.filter(function (result) {
                    return result.marker_mapid === pindropid;
                });

                return markers;
            }
        },
        getChildDirectoriesWithSchedule: ({ state }, projectid) => {
            //Get directory id
            var find = state.directory.filter(function (result) {
                return result.directory_projectid === projectid;
            });
            var directoryid = find[0].directory_id;

            var find = state.directory.filter(function (result) {
                return result.directory_parentid === directoryid;
            });
            var schedule = [];
            find.forEach(function (child) {
                if (child.directory_scheduleid == 1) {
                    schedule.push(child.directory_projectid);
                }
            });
            return schedule;
        },

        ///////////////////////////////////////////////////////
        // CHECKS
        ///////////////////////////////////////////////////////

        ///////////////////////////////////
        // Check if directory uses location
        ///////////////////////////////////
        locationCheck: ({ state }, projectid) => {
            var find = state.directory.filter(function (result) {
                return result.directory_projectid === projectid;
            });
            if (find.length > 0) {
                var directorymapid = find[0].directory_mapid;

                if (directorymapid > 0) {
                    return directorymapid;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        ////////////////////////////////////////////
        // Check if directory's parent uses location
        ////////////////////////////////////////////
        locationParentCheck: (state, getters) => (projectid) => {
            var find = state.directory.filter(function (result) {
                return result.directory_projectid === projectid;
            });
            if (find.length > 0) {
                var directoryparentid = find[0].directory_parentid;

                if (directoryparentid > 0) {
                    var find = state.directory.filter(function (result) {
                        return result.directory_id === directoryparentid;
                    });
                    var parentprojectid = find[0].directory_projectid;

                    var parentLocation = getters.locationCheck(parentprojectid);

                    return parentLocation;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        /////////////////////////////////////////////////
        //Check if directory uses schedule
        /////////////////////////////////////////////////
        scheduleCheck: ({ state }, projectid) => {
            //Get directory id
            var find = state.directory.filter(function (result) {
                return result.directory_projectid === projectid;
            });
            if (find.length > 0) {
                var directoryscheduleid = find[0].directory_scheduleid;

                if (directoryscheduleid > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },

        /////////////////////////////////////////////////
        //Check if directory's parent uses schedule
        /////////////////////////////////////////////////
        scheduleParentCheck: ({ state }, projectid) => {
            //Get directory id
            var find = state.directory.filter(function (result) {
                return result.directory_projectid === projectid;
            });

            if (find.length > 0) {
                var directoryparentid = find[0].directory_parentid;

                //check if has parent
                if (directoryparentid > 0) {
                    var find = state.directory.filter(function (result) {
                        return result.directory_id === directoryparentid;
                    });

                    if (find[0].directory_scheduleid == 1) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        },
    }

};
