const addMarker = function ($this) {
    let leafletAPI = $this.$addin.$leafletAPI;
    let cb = ()=>null;
    leafletAPI.set_onMapClick(function (e) {
        cb('before');
        let _marker = leafletAPI.addMarker([e.latlng.lat,e.latlng.lng]);
        $this.$addin.$map.flyTo(e.latlng);
        cb('after',_marker,e.latlng)
    });
    return function (_cb) {
        cb = _cb;
    }
};

export {
    addMarker
}
