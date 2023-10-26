import store from "../vuex/store.js";

import params from "../js/config/params.js";

import { f7, f7ready } from "framework7-vue";

import { Dom7 } from "framework7";
var $$ = Dom7;

export default {
    methods: {
        async pullToRefresh(eventid, tables, refresh) {

            var table = store.getters.getTableNames('remote');
            var favourites;

            if (tables) {
                let isDirectoryEntry = Object.values(tables).includes("directoryentry");
                var items = {
                    table: "directoryentry",
                    key: "favourite",
                    id: 1,
                    type: "multiple",
                };                

                favourites = store.getters.getData(items);
            }

            localStorage.user_counter = 0;

            if (tables) {
                var total = tables.length * 2;
            }
            else {
                var total = table.length * 2;
            }

            var fullSync = false;
            var ptr = true;
            var ptrSuccess = this.syncGetFromWebServer(eventid, tables, fullSync, ptr);

            if (ptrSuccess) {

                var vue = this;
                var loop = setInterval(function () {

                    if (localStorage.user_counter >= total) {
                        console.log('Refresh success');
                        $$('.ptr-content').removeClass('ptr-pull-up');
                        $$('.ptr-content').removeClass('ptr-refreshing');
                        clearInterval(loop);

                        //Sort tables to display rows in correct order
                        var paramsSort = params.filter(function (result) {
                            return result.sort == true;
                        });

                        paramsSort.forEach(function (item) {
                            vue.$store.dispatch('reorder', item.table);
                        });

                        if(favourites) {
                            vue.$store.dispatch('setFavourites', favourites); 
                        }

                        if (refresh) {
                            var view = f7.views.current;
                            console.log('REFRESH PAGE');
                            view.router.refreshPage();
                        }

                        vue.getCustomColours();

                        return;
                    }
                }, 200);
            }
            else {
                vue.$$('.ptr-content').removeClass('ptr-pull-up');
                vue.$$('.ptr-content').removeClass('ptr-refreshing');
                console.log('Refresh failed');
            }
        }
    }
}