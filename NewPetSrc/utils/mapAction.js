// const createMarkerByLatLng = (lat,lng) => {
//     return leafletAPI.addMarker([lat,lng]);
// };
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

// obj = {
//     "id": 76,
//     "surveyTime": 1667964574947,
//     "lat": 23.086715,
//     "lng": 114.423523,
// }
// arr = [obj1,obj2]
const addMarkerWithAction = function ($this) {
    let extent = {
        maxX: 0,
        minX: 0,
        maxY: 0,
        minY: 0,
    };
    let toutId = null;
    let invId = null;
    let time = 5;
    let colors = ['#09af1f','#F00','#09af1f','#F00','#09af1f','#F00','#09af1f','#F00','#09af1f','#F00','#09af1f','#F00','#09af1f','#F00',];
    let bgStyle = `display:none;color: #009688;border-color: #009688;border-width: 2px;border-style: solid;width: 37px;height: 37px;margin-left: -21px;margin-top: -40px;border-radius: 9px;background: #009688;`
    let flash = () => {
        clearTimeout(toutId);
        markers.forEach(m => {
            let div = document.createElement('DIV');
            div.setAttribute('style',bgStyle);
            m._icon.appendChild(div);
        });
        toutId = setTimeout(() => {
            _flash();
        },2000);
    };
    let _flash = () => {
        // window.markers = markers;
        clearTimeout(toutId);
        clearInterval(invId);
        time = colors.length;
        invId = setInterval(() => {
            markers.forEach(m => {
                m._icon.children[0].children[0].style.color = colors[time];
                m._icon.children[0].style.borderColor = colors[time];
            });
            if (time) {
                time--;
            } else {
                clearInterval(invId);
            }
        },150);
    };
    let highlightAndStopFlash = _marker => {
        clearTimeout(toutId);
        clearInterval(invId);
        markers.forEach(m => {
            m._icon.children[0].children[0].style.color = colors[0];
            m._icon.children[0].style.borderColor = colors[0];
            m._icon.children[1].style.display = 'none';
        });
        if (_marker !== -1) {
            _marker._icon.children[0].children[0].style.color = colors[1];
            _marker._icon.children[0].style.borderColor = colors[1];
            _marker._icon.children[1].style.display = 'block';
        }
    }
    let markers = [];
    let leafletAPI = $this.$addin.$leafletAPI;
    let flyToBounds = () => {};
    return {
        getIndex(objId) {
            let i = 0;
            for (i = 0;i < markers.length;i++) {
                if (markers[i].objid === objId) {
                    break;
                }
            }
            if (i === markers.length) return -1;
            return i;
        },
        getNextOneMarker(id,dir) {
            let i = 0;
            if (id === -1) {
                i = 0;
            } else {
                i = this.getIndex(id);
                if (i === -1) i = 0;
            }
            i = (i + dir + markers.length) % markers.length;
            return {
                marker: markers[i],
                index: i
            };
        },
        flyToBounds() {
            flyToBounds();
            flash()
        },
        drawMarker(arr) {
            markers.forEach(m => m.remove());
            markers = [];
            arr.forEach((obj, ind) => {
                let _marker = leafletAPI.addMarker([obj.lat, obj.lng]);
                if (!ind) {
                    extent.minX = obj.lat;
                    extent.minY = obj.lng;
                    extent.maxX = obj.lat;
                    extent.maxY = obj.lng;
                } else {
                    extent.minX = Math.min(extent.minX, obj.lat);
                    extent.minY = Math.min(extent.minY, obj.lng);
                    extent.maxX = Math.max(extent.maxX, obj.lat);
                    extent.maxY = Math.max(extent.maxY, obj.lng);
                }
                _marker.objid = obj.id;
                _marker.on('click', obj => {
                    // console.log(obj);
                    highlightAndStopFlash(obj.target);
                    $this.markerClick(obj);
                });
                markers.push(_marker);
                // console.log(_marker);
            });
            if (arr.length === 0) {
                flyToBounds = () => {};
            } else if (arr.length === 1) {
                flyToBounds = () => {
                    leafletAPI.flyTo([extent.minX, extent.minY]);
                };
            } else {
                flyToBounds = () => {
                    leafletAPI.flyToBounds([
                        [extent.minX, extent.minY],
                        [extent.maxX, extent.maxY]
                    ]);
                }
            }
            this.flyToBounds();
            flash();
        },
        highlightAndStopFlash,
        removeMarker(id) {
            for (let i = 0;i < markers.length;i++) {
                if (markers[i].objid === id) {
                    markers[i].remove();
                    markers.splice(i,1);
                    break;
                }
            }
        },
        clearMarkers() {
            markers.forEach(m => m.remove());
            clearInterval(invId);
            clearTimeout(toutId);
        }
    }
}

export {
    addMarker,
    addMarkerWithAction
}
