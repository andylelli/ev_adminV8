import store from "../vuex/store.js";

import { f7 } from "framework7-vue";

export default {
    methods: {
        async imageLoad(e, id, table, remove) {

            var timeout = false;

            var asyncTimeout = (ms) => {
                return new Promise((resolve) => {

                    setTimeout(function () {

                        timeout = true;

                    }, ms);

                });
            };

            var ifConnected = window.navigator.onLine;

            if (ifConnected) {

                f7.preloader.show();

                if (table == 'event') {
                    this.newImage = true;
                }

                var header;
                var image;
                var obj = {};
                var props;
                var url;

                if (remove) {
                    obj.id = id;
                    obj.table = table;

                    header = {
                        'Authorization': store.state.token,
                        'UserID': store.state.userid,
                        'EventID': store.state.eventid,
                        'Role': store.state.role,
                        'Content-Type': 'application/json'
                    };

                    props = {
                        method: 'POST',
                        withCredentials: true,
                        credentials: 'include',
                        headers: header,
                        body: JSON.stringify(obj)
                    };

                    url = store.state.url + "api/post/remove/image";
                }
                else {
                    header = {
                        'Authorization': store.state.token,
                        'UserID': store.state.userid,
                        'EventID': store.state.eventid,
                        'Role': store.state.role,
                    };

                    image = e.target.files[0];

                    var formData = new FormData()
                    formData.append('image', image);
                    formData.append("id", id);
                    formData.append("table", table);

                    props = {
                        method: 'POST',
                        withCredentials: true,
                        credentials: 'include',
                        headers: header,
                        body: formData
                    };

                    url = store.state.url + "api/post/update/image";
                }

                asyncTimeout(store.state.timeout);

                //console.log(url);
                //console.log(props);

                // Send login post to server
                var response = await fetch(url, props);

                if (timeout === false) {

                    // Receive response back from server
                    var data = await response.json();

                    // Check if response is a success
                    if (data[0].status == 'success') {
                        this.imageNew(data[0], id, table);
                    }
                    else {
                        f7.preloader.hide();
                        f7.dialog.alert('There was a problem uploading the image.');
                    }
                }
                else {
                    f7.preloader.hide();
                    f7.dialog.alert('There was a problem uploading the image.');
                }
            }
            else {
                f7.dialog.alert("Slow network. Action didn't complete");
                console.log('Not connected to network');
                return false;
            }
        },
        imageNew(json, id, table) {

            new Date;
            var unixtime = Date.now() / 1000;
            json.table = table;
            json.id = id;
            json.unixtime = unixtime;

            store.dispatch('updateImageApp', json);
            store.dispatch('updateImageDB', json);

            f7.preloader.hide();

            console.log(json.message);

            setTimeout(() => {
                f7.views.current.router.refreshPage();
            }, 500);


        }
    }
}