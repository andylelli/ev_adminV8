export default {
    methods: {
        onNow() {
            var onToday = this.onTodayByDirectory();
            var projectid = this.projectid;
            var onNow = [];

            if (onToday.length > 0) {

                //Check if directory has locations
                var find = this.directory.filter(function (result) {
                    return result.directory_projectid === projectid;
                });
                var directory_mapid = find[0].directory_mapid;

                if (directory_mapid > 0) {

                    var onTodayByLocation = this.groupByDirectory(onToday);
                    var onNowArr = this.onNowByDirectory(onTodayByLocation);
                    onNowArr.forEach(function (item) {
                        onNow.push(item);
                    });
                }
                else {

                    //Check if parent directory has locations                        
                    var directoryparentid = find[0].directory_parentid;
                    var find = this.directory.filter(function (result) {
                        return result.directory_id === directoryparentid;
                    });
                    var directory_mapid = find[0].directory_mapid;

                    if (directory_mapid > 0) {
                        var onTodayByLocation = this.groupByDirectory(onToday);
                        var onNowArr = this.onNowByDirectory(onTodayByLocation);
                        onNowArr.forEach(function (item) {
                            onNow.push(item);
                        });
                    }
                }
                return onNow;
            }
            else {
                return false;
            }
        },
        onTodayByDirectory() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }

            today = yyyy.toString() + mm.toString() + dd.toString();

            var projectid = this.projectid;
            var childids = this.childids;
            var onToday = [];

            //Check if child directory has a schedule
            var find = this.directory.filter(function (result) {
                return result.directory_projectid === projectid;
            });

            // IF directory has a schedule, then add items on today to array
            if (find[0].directory_scheduleid > 0) {
                var directoryentries = this.getDirectoryentries(projectid);

                //Get list of directory entries on today
                var directoryentriesToday = directoryentries.filter(function (result) {
                    return result.directoryentry_day === today;
                });
                directoryentriesToday.forEach(function (item) {
                    onToday.push(item);
                });
                return onToday;                
            }
            // ELSE Check if child directories have schedule and add them to array
            else {
                for (var i = 0; i < childids.length; i++) {

                    var find = this.directory.filter(function (result) {
                        return result.directory_projectid === childids[i];
                    });

                    if (find[0].directory_scheduleid > 0) {                    
                        var directoryentries = this.getDirectoryentries(childids[i]);

                        //Get list of directory entries on today
                        var directoryentriesToday = directoryentries.filter(function (result) {
                            return result.directoryentry_day === today;
                        });

                        directoryentriesToday.forEach(function (item) {
                            onToday.push(item);
                        });
                    }
                }
                return onToday;
            }
        },
        getDirectoryentries(projectid) {

            var find = this.directory.filter(function (result) {
                return result.directory_projectid === projectid;
            });
            if (find.length > 0) {
                var directoryid = find[0].directory_id;
                var find = this.directoryentry.filter(function (result) {
                    return result.directoryentry_directoryid === directoryid;
                });
                return find;
            }
        },
        groupByDirectory(onToday) {

            //Get parent directory id
            var directoryid = onToday[0].directoryentry_directoryid;

            //Get list of parent items
            var find = this.directory.filter(function (result) {
                return result.directory_id === directoryid;
            });

            var directoryparentid = find[0].directory_parentid;

            var find = this.directoryentry.filter(function (result) {
                return result.directoryentry_directoryid === directoryparentid;
            });

            var parentDirectoryentries = find;
            var len1 = parentDirectoryentries.length;
            var len2 = onToday.length;

            //Create array of items on today grouped by parent location
            var arrOnTodayByLocation = []
            for (var i = 0; i < len1; i++) {

                var directoryentryid = parentDirectoryentries[i].directoryentry_id;

                var arrOnToday = [];
                for (var j = 0; j < len2; j++) {

                    if (onToday[j].directoryentry_parententryid == directoryentryid) {
                        arrOnToday.push(onToday[j])
                    }

                }
                arrOnTodayByLocation.push(arrOnToday);

            }

            for (i = 0; i < len1; i++) {

                arrOnTodayByLocation[i].sort(function (a, b) {
                    return a.directoryentry_hour - b.directoryentry_hour || a.directoryentry_minute - b.directoryentry_minute;
                });

            }

            return arrOnTodayByLocation;
        },
        onNowByDirectory(onTodayByLocation) {

            var dailyendtime = this.event.event_dailyendtime;
            var len3 = onTodayByLocation.length;
            var arrOnNowByLocation = [];

            var currentdate = new Date();

            var hours = currentdate.getHours().toString();
            var minutes = currentdate.getMinutes().toString();
            if (hours.length == 1) {
                hours = ('0' + hours.toString());
            }
            if (minutes.length == 1) {
                minutes = ('0' + minutes.toString());
            }
            var timeNow = hours.toString() + minutes.toString();

            for (var i = 0; i < len3; i++) {

                var j = 0, len4;
                len4 = onTodayByLocation[i].length;

                for (var j = 0; j < (len4); j++) {

                    var time0Hour = onTodayByLocation[i][j].directoryentry_hour;
                    var time0Min = onTodayByLocation[i][j].directoryentry_minute;

                    if (time0Hour.length == 1) {
                        time0Hour = '0' + time0Hour.toString();
                    }
                    if (time0Min.length == 1) {
                        time0Min = '0' + time0Min.toString();
                    }

                    var time0 = time0Hour.toString() + time0Min.toString();

                    if (j < (len4 - 1)) {

                        var time1Hour = onTodayByLocation[i][j + 1].directoryentry_hour;
                        var time1Min = onTodayByLocation[i][j + 1].directoryentry_minute;

                        if (time1Hour.length == 1) {
                            time1Hour = '0' + time1Hour.toString();
                        }
                        if (time1Min.length == 1) {
                            time1Min = '0' + time1Min.toString();
                        }

                        var time1 = time1Hour.toString() + time1Min.toString();

                        //console.log(onTodayByLocation[i][j].directoryentry_name + ' Start: ' + time0 + ' ' + 'End: ' + time1 + ' NOW: ' + timeNow);

                        if (parseInt(time0) < parseInt(timeNow) && parseInt(time1) > parseInt(timeNow)) {
                            arrOnNowByLocation.push(onTodayByLocation[i][j]);
                        }
                    }

                    else {
                        //console.log(onTodayByLocation[i][j].directoryentry_name + ' Start: ' + time0 + ' ' + 'End: ' + dailyendtime);
                        if (parseInt(time0) < parseInt(timeNow) && dailyendtime > parseInt(timeNow)) {
                            arrOnNowByLocation.push(onTodayByLocation[i][j]);
                        }
                    }

                }
            }
            return arrOnNowByLocation;
        }
    }
}