import { Dom7 } from "framework7";
var $$ = Dom7;

export default {
    methods: {
        initialiseMapMounted() {

            //SET MAX BOUNDS
            var east = 180;
            var west = -180;
            var north = -90;
            var south = 90;

            var lat, lng;

            this.getMarkers.forEach(function (marker) {
                lat = marker.directoryentry_lat;
                lng = marker.directoryentry_lng;

                if (lat != 0 && lng != 0) {
                    if (lng > west) {
                        west = lng;
                    }
                    if (lng < east) {
                        east = lng;
                    }
                    if (lat < south) {
                        south = lat;
                    }
                    if (lat > north) {
                        north = lat;
                    }
                }
            });

            north = parseFloat(north) + 0.01;
            east = parseFloat(east) + 0.02;
            south = parseFloat(south) - 0.01;
            west = parseFloat(west) - 0.02;

            north = parseFloat(north) + 10;
            east = parseFloat(east) + 10;
            south = parseFloat(south) - 10;
            west = parseFloat(west) - 10;

            var maxBounds = [
                [south, west],
                [north, east],
            ];

            var centerLat = (north + south) / 2;
            var centerLng = (west + east) / 2;

            this.center = [centerLat, centerLng];

            //this.maxBounds = maxBounds;

            // NO MAX BOUNDS
            var noMaxBounds = [
                [90, -180],
                [-90, 180],
            ];
            this.maxBounds = noMaxBounds;

            //INITIALISE MAP
            this.map = L.map("map", {
                minZoom: this.minZoom,
                maxZoom: this.maxZoom,
                maxBounds: maxBounds,
                bounceAtZoomLimits: this.bounceAtZoomLimit,
                touchZoom: this.touchZoom,
                fadeAnimation: this.fadeAnimation,
                zoomControl: this.zoomControl,
                touchZoom: this.touchZoom,
                maxBoundsViscosity: this.maxBoundsViscosity,
                inertia: true,
                inertiaDeceleration: 1000,
                inertiaMaxSpeed: 5000,
            }).setView(this.center, 15);

            var tiles = this.url;
            tiles = L.tileLayer(tiles, {
                useCache: this.useCache,
                crossOrigin: this.crossOrigin,
                edgeBufferTiles: this.edgeBufferTiles,
                updateWhenIdle: this.updateWhenIdle,
                updateInterval: this.updateInterval,
                keepBuffer: this.keepBuffer,
            });

            tiles.addTo(this.map);

            if (this.getMarkers) {
                var markers = this.getMarkers;
                if (markers) {
                    this.initiateMarkers(markers);
                }
                var customMarkers = this.getCustomMarkers;
                if (customMarkers) {
                    this.initiateCustomMarkers(customMarkers);
                }
            }

            var vue = this;
            $$(document).on("click", ".compass-click", function (e) {
                var lat = e.srcElement.attributes.lat.value;
                var lng = e.srcElement.attributes.lng.value;
                var title = e.srcElement.attributes.title.value;
                vue.setCompass(lat, lng, title);
            });

            var pulsingIcon = L.icon.pulse({
                iconSize: [18, 18],
                color: "blue",
                heartbeat: 1.5,
            });
            this.here = L.marker([0, 0], {
                icon: pulsingIcon,
            }).addTo(this.map);
        },
        initialiseMapBeforeMount() {
            var vue = this;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((gps) => {
                    this.myposition = [gps.coords.latitude, gps.coords.longitude];
                    if (vue.center[0] != 0 && vue.center[1] != 0) {
                        vue.map.panTo(this.myposition);
                    }
                });
            }

            (function (factory, window) {
                // define an AMD module that relies on 'leaflet'
                if (typeof define === "function" && define.amd) {
                    define(["leaflet"], factory);

                    // define a Common JS module that relies on 'leaflet'
                } else if (typeof exports === "object") {
                    module.exports = factory(require("leaflet"));
                }

                // attach your plugin to the global 'L' variable
                if (
                    typeof window !== "undefined" &&
                    window.L &&
                    !window.L.EdgeBuffer
                ) {
                    factory(window.L);
                }
            })(function (L) {
                L.EdgeBuffer = {
                    previousMethods: {
                        getTiledPixelBounds:
                            L.GridLayer.prototype._getTiledPixelBounds,
                    },
                };

                L.GridLayer.include({
                    _getTiledPixelBounds: function (center, zoom, tileZoom) {
                        var pixelBounds =
                            L.EdgeBuffer.previousMethods.getTiledPixelBounds.call(
                                this,
                                center,
                                zoom,
                                tileZoom
                            );

                        // Default is to buffer one tiles beyond the pixel bounds (edgeBufferTiles = 1).
                        var edgeBufferTiles = 1;
                        if (
                            this.options.edgeBufferTiles !== undefined &&
                            this.options.edgeBufferTiles !== null
                        ) {
                            edgeBufferTiles = this.options.edgeBufferTiles;
                        }

                        if (edgeBufferTiles > 0) {
                            var pixelEdgeBuffer = L.GridLayer.prototype.getTileSize
                                .call(this)
                                .multiplyBy(edgeBufferTiles);
                            pixelBounds = new L.Bounds(
                                pixelBounds.min.subtract(pixelEdgeBuffer),
                                pixelBounds.max.add(pixelEdgeBuffer)
                            );
                        }
                        return pixelBounds;
                    },
                });
            }, window);
        },
        initiateMarkers(markers) {
            markers.forEach((marker) => {

                var id = "marker-" + marker.directoryentry_id;
                var lat = marker.directoryentry_lat;
                var lng = marker.directoryentry_lng;

                if (lat !== 0 && lng !== 0) {
                    var iconUrl = this.iconFilename(marker.directory_colourid);

                    var myIcon = L.icon({
                        iconUrl: iconUrl,
                        iconSize: [28, 80],
                        iconAnchor: [14, 57],
                        popupAnchor: [1, -32],
                    });

                    var draggable;
                    if (this.page == "map") {
                        draggable = false;
                    }
                    if (this.page == "directoryentry") {
                        draggable = true;
                    }
                    this.newMarker(myIcon, marker, id, draggable);
                }
            });
        },
        newMarker(myIcon, marker, id, draggable) {

            var lat = marker.directoryentry_lat;
            var lng = marker.directoryentry_lng;
            var title = marker.directoryentry_name;


            var html = `
            <div align="center" popupid='${id}'>
                <p style=" margin:0px; padding:4px 0px 0px 0px;">${title}</p>
                <p class="compass-click" id='${id}' lat='${lat}' lng='${lng}' title='${title}' style="margin:4px 0px 0px 0px; color:black; font-size: 10px;">COMPASS</p>
            </div>`;

            marker = L.marker([lat, lng], {
                id: id,
                icon: myIcon,
                draggable: draggable
            })
                .addTo(this.map)
                .bindPopup(html, { autoClose: false });

            var vue = this;
            marker.on('dragend', function (event) {
                var pos = marker.getLatLng();
                vue.updateMarkerPosition(pos)
            });


            this.markers.push(marker);

        },
        iconFilename(colour) {
            return "/admin/static/images/pindrop-" + colour + ".svg";
        },
        async myPosition() {
            var vue = this;

            var newposLat;
            var newposLng;
            var oldposLat;
            var oldposLng;
            var old2posLat;
            var old2posLng;
            var old3posLat;
            var old3posLng;
            var old4posLat;
            var old4posLng;
            var old5posLat;
            var old5posLng;
            var old6posLat;
            var old6posLng;
            var old7posLat;
            var old7posLng;
            var old8posLat;

            var numDeltas = 100;
            var delay = 10; //milliseconds
            var i = 0;
            var deltaLat;
            var deltaLng;

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        oldposLat = newposLat;
                        oldposLng = newposLng;

                        old2posLat = oldposLat;
                        old2posLng = oldposLng;

                        old3posLat = old2posLat;
                        old3posLng = old2posLng;

                        old4posLat = old3posLat;
                        old4posLng = old3posLng;

                        old5posLat = old4posLat;
                        old5posLng = old4posLng;

                        old6posLat = old5posLat;
                        old6posLng = old5posLng;

                        old7posLat = old6posLat;
                        old7posLng = old6posLng;

                        newposLat = position.coords.latitude;
                        newposLng = position.coords.longitude;

                        if (oldposLat == null) {
                            newposLat = newposLat;
                            newposLng = newposLng;
                        } else if (old2posLat == null) {
                            newposLat = (newposLat + oldposLat) / 2;
                            newposLng = (newposLng + oldposng) / 2;
                        } else if (old3posLat == null) {
                            newposLat =
                                (newposLat + oldposLat + old2posLat) / 3;
                            newposLng =
                                (newposLng + oldposLng + old2posLat) / 3;
                        } else if (old4posLat == null) {
                            newposLat =
                                (newposLat +
                                    oldposLat +
                                    old2posLat +
                                    old3posLat) /
                                4;
                            newposLng =
                                (newposLng +
                                    oldposLng +
                                    old2posLng +
                                    old3posLng) /
                                4;
                        } else if (old5posLat == null) {
                            newposLat =
                                (newposLat +
                                    oldposLat +
                                    old2posLat +
                                    old3posLat +
                                    old4posLat) /
                                5;
                            newposLng =
                                (newposLng +
                                    oldposLng +
                                    old2posLng +
                                    old3posLng +
                                    old4posLng) /
                                5;
                        } else if (old6posLat == null) {
                            newposLat =
                                (newposLat +
                                    oldposLat +
                                    old2posLat +
                                    old3posLat +
                                    old4posLat +
                                    old5posLat) /
                                6;
                            newposLng =
                                (newposLng +
                                    oldposLng +
                                    old2posLng +
                                    old3posLng +
                                    old4posLng +
                                    old5posLng) /
                                6;
                        } else if (old7posLat == null) {
                            newposLat =
                                (newposLat +
                                    oldposLat +
                                    old2posLat +
                                    old3posLat +
                                    old4posLat +
                                    old5posLat +
                                    old6posLat) /
                                7;
                            newposLng =
                                (newposLng +
                                    oldposLng +
                                    old2posLng +
                                    old3posLng +
                                    old4posLng +
                                    old5posLng +
                                    old6posLng) /
                                7;
                        } else if (old8posLat == null) {
                            newposLat =
                                (newposLat +
                                    oldposLat +
                                    old2posLat +
                                    old3posLat +
                                    old4posLat +
                                    old5posLat +
                                    old6posLat +
                                    old7posLat) /
                                8;
                            newposLng =
                                (newposLng +
                                    oldposLng +
                                    old2posLng +
                                    old3posLng +
                                    old4posLng +
                                    old5posLng +
                                    old6posLng +
                                    old7posLng) /
                                8;
                        }

                        if (oldposLat == null) {
                            oldposLat = newposLat;
                            oldposLng = newposLng;

                            var south, west, north, east;

                            south = vue.maxBounds[0][0];
                            west = vue.maxBounds[0][1];
                            north = vue.maxBounds[1][0];
                            east = vue.maxBounds[1][1];

                            if (
                                newposLat < north &&
                                newposLat > south &&
                                newposLng > west &&
                                newposLng < east
                            ) {
                                if (!vue.directoryentryid) {
                                    vue.map.setView(
                                        [newposLat, newposLng],
                                        16
                                    );
                                }

                            }
                            else {
                                if (vue.directoryentryid && vue.firstLoop == true) {
                                    if (vue.markerPosition[0] == 0 && vue.markerPosition[1] == 0) {
                                        vue.map.setView(
                                            [newposLat, newposLng],
                                            16
                                        );
                                        vue.firstLoop = false;
                                    }
                                    else {
                                        vue.map.setView(
                                            vue.markerPosition,
                                            16
                                        );
                                        vue.firstLoop = false;
                                    }
                                }
                            }
                        }

                        transition();

                        function transition() {
                            i = 0;
                            deltaLat = (newposLat - oldposLat) / numDeltas;
                            deltaLng = (newposLng - oldposLng) / numDeltas;

                            moveMarker();
                        }

                        function moveMarker() {
                            oldposLat += deltaLat;
                            oldposLng += deltaLng;

                            var newLatLng = new L.LatLng(
                                oldposLat,
                                oldposLng
                            );

                            vue.here.setLatLng(newLatLng);
                            if (i != numDeltas) {
                                i++;
                                setTimeout(moveMarker, delay);
                            }

                            //here.setLatLng(vue.center);
                        }
                    },
                    function () {
                        //handleLocationError(true, infoWindow, map.getCenter());
                    }
                );
            }
        },

    }
};