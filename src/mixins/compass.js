export default {
    methods: {
        //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
        calcCrow(lat1, lon1, lat2, lon2) {
            var R = 6371; // km
            var dLat = this.toRad(lat2 - lat1);
            var dLon = this.toRad(lon2 - lon1);
            var lat1 = this.toRad(lat1);
            var lat2 = this.toRad(lat2);

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d;
        },
        bearing(startLat, startLng, destLat, destLng) {
            var startLat = this.toRadians(startLat);
            var startLng = this.toRadians(startLng);
            var destLat = this.toRadians(destLat);
            var destLng = this.toRadians(destLng);

            var y = Math.sin(destLng - startLng) * Math.cos(destLat);
            var x = Math.cos(startLat) * Math.sin(destLat) -
                Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
            var brng = Math.atan2(y, x);
            var brng = this.toDegrees(brng);
            return (brng + 360) % 360;
        },
        // Converts numeric degrees to radians
        toRad(Value) {
            return Value * Math.PI / 180;
        },

        // Converts from degrees to radians.
        toRadians(degrees) {
            return degrees * Math.PI / 180;
        },

        // Converts from radians to degrees.
        toDegrees(radians) {
            return radians * 180 / Math.PI;
        }
    }
}

