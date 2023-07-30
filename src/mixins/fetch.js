import store from "../vuex/store.js";
import { f7 } from "framework7-vue";

export default {
    methods: {

        async fetch(url, method, jsonx, success, failure, page, newEvent) {

            // Set working spinner
            store.dispatch("setWorking", true);

            // Script to time out after set milliseconds
            var timeout = false;
            var asyncTimeout = (ms) => {
                return new Promise((resolve) => {

                    setTimeout(function () {

                        timeout = true;

                    }, ms);

                });
            };

            // See if device is online on not
            var ifConnected = window.navigator.onLine;

            // If device is online
            if (ifConnected) {

                // Set header
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

                // Set properties for GET
                if (!jsonx) {
                    var props = {
                        method: method,
                        withCredentials: true,
                        credentials: 'include',
                        headers: header,
                    }
                }

                // Set properties for POST
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

                // Run timeout scripts
                asyncTimeout(store.state.timeout);

                this.debugUrl = url;
                this.debugProps = JSON.stringify(props);


                // Send request to server
                var response = await fetch(url, props);

                // Check if the network is too slow
                if (this.networkError(response, page) == true) {
                    return false;
                }

                // If request compleest before network timeout
                if (timeout === false) {

                    // Unset working spinner
                    store.dispatch("setWorking", false);

                    // If response is in the 200 range
                    if (response.status >= 200 && response.status <= 299) {
                        var json = await response.json();

                        // If array returned
                        if (json[0]) {
                            if (json[0].status == "success") {
                                if (success) {
                                    var result = success(json);
                                    return result;
                                }
                                else {
                                    return json;
                                }
                            }
                            else {
                                if (failure) {
                                    var result = failure(json);
                                    return result;
                                }
                                else {
                                    return json;
                                }
                            }
                        }

                        // If json returned
                        else {
                            if (json.status == "success") {
                                if (success) {
                                    var result = success(json);
                                    return result;
                                }
                                else {
                                    return json;
                                }
                            }
                            else {
                                if (failure) {
                                    var result = failure(json);
                                    return result;
                                }
                                else {
                                    return json;
                                }
                            }
                        }
                    }
                    else {
                        // If error and json returned
                        var json = await response.json();
                        console.log('Status: ' + response.status + ' ' + method + ' ' + url);
                        if (json) {
                            if (failure) {
                                
                                var result = failure(json);
                                return result;
                            }
                            else {
                                return json;
                            }


                        }
                        // If error and json not returned
                        else {
                            console.log('Status: ' + response.status + ' ' + method + ' ' + url);
                            var json = {
                                status: 'fail',
                                message: 'This action failed to complete'
                            };
                            var msg = [];
                            msg.push(json);
                            if (failure) {
                                var result = failure(msg);
                                return result
                            }
                            else {
                                return msg;
                            }
                        }
                    };
                }
                else {
                    // If timeout
                    console.log('TIMEOUT');
                    f7.preloader.hide();
                    f7.dialog.alert("Slow network. Action didn't complete");
                    store.dispatch("setWorking", false);
                    return false;
                }
            }
            // If not online
            else {
                console.log('NOT CONNECTED');
                f7.preloader.hide();
                f7.dialog.alert("No network.");
                store.dispatch("setWorking", false);
                return false;
            }
        }
    },
}