import store from "../vuex/store.js";


export default {
    methods: {

        async fetch(url, method, jsonx, newEvent) {

            store.dispatch("setWorking", true);

            var timeout = false;

            var asyncTimeout = (ms) => {
                return new Promise((resolve) => {

                    setTimeout(function () {

                        timeout = true;

                    }, ms);

                });
            };

            var ifConnected = window.navigator.onLine;

            //console.log(ifConnected);

            if (ifConnected) {

                var header = {
                    'Authorization': store.state.token,
                    'UserID': store.state.userid,
                    'Role': store.state.role,
                    'Content-Type': 'application/json'
                }

                if (newEvent) {
                    header.EventID = 'new';
                }
                else if (store.state.eventid) {
                    header.EventID = store.state.eventid;
                }
                //console.log(header);

                if (!jsonx) {
                    var props = {
                        method: method,
                        withCredentials: true,
                        credentials: 'include',
                        headers: header,
                    }
                }
                else {
                    this.json = JSON.stringify(jsonx);
                    var props = {
                        method: method,
                        withCredentials: true,
                        credentials: 'include',
                        headers: header,
                        body: JSON.stringify(jsonx)
                    }
                }

                //console.log(props);

                asyncTimeout(store.state.timeout);

                this.debugUrl = url;
                this.debugProps = JSON.stringify(props);
                
                //console.log(url);
                //console.log(props);

                var response = await fetch(url, props);

                if (timeout === false) {


                    if (response.status >= 200 && response.status <= 299) {
                        var json = await response.json();
                        //console.log(json);
                        store.dispatch("setWorking", false);
                        return json;
                    }
                    else {
                        var json = await response.json();
                        if (json) {
                            console.log('Status: ' + response.status + ' ' + method + ' ' + url);
                            return json;
                        }
                        else {
                            console.log('Status: ' + response.status + ' ' + method + ' ' + url);
                            var json = {
                                status: 'fail',
                                message: 'This action failed to complete'
                            };
                            var msg = [];
                            msg.push(json);
                            return msg;
                        }
                    };
                }
                else {
                    console.log('TIMEOUT');
                    var working = false;
                    store.dispatch("setWorking", false);
                    return false;
                }
            }
            else {
                console.log('NOT CONNECTED');
                var working = false;
                store.dispatch("setWorking", false);
                return false;
            }
        }
    },
}