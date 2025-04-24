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
                navigator.geolocation.watchPosition(
                    (gps) => {
                        this.myposition = [gps.coords.latitude, gps.coords.longitude];

                        if (vue.center[0] !== 0 && vue.center[1] !== 0) {
                            vue.map.panTo(this.myposition);
                        }
                    },
                    (error) => {
                        console.error('Geolocation error:', error.message);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );

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
                <!-- <p class="compass-click" id='${id}' lat='${lat}' lng='${lng}' title='${title}' style="margin:4px 0px 0px 0px; color:black; font-size: 10px;">COMPASS</p> -->
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
            const vue = this;
          
            let oldPositions = [];
          
            const numDeltas = 100;
            const delay = 10;
            let i = 0;
            let deltaLat, deltaLng;
          
            if (!navigator.geolocation) {
              console.error("Geolocation is not supported by this browser.");
              return;
            }
          
            navigator.geolocation.watchPosition(
              (position) => {
                const newLat = position.coords.latitude;
                const newLng = position.coords.longitude;
          
                // Store last 8 positions for smoothing
                if (oldPositions.length >= 8) {
                  oldPositions.shift(); // remove oldest
                }
                oldPositions.push([newLat, newLng]);
          
                // Compute smoothed position
                let avgLat = 0, avgLng = 0;
                oldPositions.forEach(([lat, lng]) => {
                  avgLat += lat;
                  avgLng += lng;
                });
                avgLat /= oldPositions.length;
                avgLng /= oldPositions.length;
          
                const smoothedPos = [avgLat, avgLng];
          
                // Set view if first time and within bounds
                if (oldPositions.length === 1) {
                  const [south, west] = vue.maxBounds[0];
                  const [north, east] = vue.maxBounds[1];
          
                  if (
                    avgLat < north && avgLat > south &&
                    avgLng > west && avgLng < east
                  ) {
                    if (!vue.directoryentryid) {
                      vue.map.setView(smoothedPos, 16);
                    }
                  } else if (vue.directoryentryid && vue.firstLoop) {
                    if (vue.markerPosition[0] === 0 && vue.markerPosition[1] === 0) {
                      vue.map.setView(smoothedPos, 16);
                    } else {
                      vue.map.setView(vue.markerPosition, 16);
                    }
                    vue.firstLoop = false;
                  }
                }
          
                transition(smoothedPos);
          
                function transition([targetLat, targetLng]) {
                  i = 0;
                  const [startLat, startLng] = vue.here.getLatLng();
                  deltaLat = (targetLat - startLat) / numDeltas;
                  deltaLng = (targetLng - startLng) / numDeltas;
                  moveMarker(startLat, startLng);
                }
          
                function moveMarker(currentLat, currentLng) {
                  const newLat = currentLat + deltaLat;
                  const newLng = currentLng + deltaLng;
                  vue.here.setLatLng([newLat, newLng]);
          
                  if (i < numDeltas) {
                    i++;
                    setTimeout(() => moveMarker(newLat, newLng), delay);
                  }
                }
              },
              (error) => {
                console.error('Geolocation error:', error.message);
              },
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
              }
            );
          },
          
    }
};