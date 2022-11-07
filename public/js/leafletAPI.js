window.fetchBase64ByUrl = url => {
    return fetch(url).then(_=>_.text())
};
var TileBase64 = L.TileLayer.extend({
    // @method createTile(coords: Object, done?: Function): HTMLElement
    // Called only internally, overrides GridLayer's [`createTile()`](#gridlayer-createtile)
    // to return an `<img>` HTML element with the appropriate image URL given `coords`. The `done`
    // callback is called when the tile has been loaded.
    createTile: function (coords, done) {
        var tile = document.createElement('img');

        // on(tile, 'load', bind(this._tileOnLoad, this, done, tile));
        // on(tile, 'error', bind(this._tileOnError, this, done, tile));

        if (this.options.crossOrigin || this.options.crossOrigin === '') {
            tile.crossOrigin = this.options.crossOrigin === true ? '' : this.options.crossOrigin;
        }

        /*
         Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
         http://www.w3.org/TR/WCAG20-TECHS/H67
        */
        tile.alt = '';

        /*
         Set role="presentation" to force screen readers to ignore this
         https://www.w3.org/TR/wai-aria/roles#textalternativecomputation
        */
        tile.setAttribute('role', 'presentation');

        // tile.src = this.getTileUrl(coords);

        // re-start
        let url = this.getTileUrl(coords);
        let done1 = this._tileOnLoad.bind(this,done,tile)
        let err1 = this._tileOnError.bind(this,done,tile)
        window.fetchBase64ByUrl(url).then(src => {
            tile.src = src;
            // this._tileOnLoad(done,tile);
            done1();
        }).catch(() => {
            err1();
        })

        return tile;
    },
})
function tileBase64(url, options) {
    return new TileBase64(url, options);
}


const leafletAPI = (function (){
    let _L = null;
    let map = null;
    let _baseMap = null;
    let layerMinZIndex = 10;
    // 配置点击地图时的回调函数
    let onMapClick = _=>null;
    let _marker = null;
    let current_baseMap_key = 'arcgis';
    const baseMap = {
        // Arcgis: {
        //     url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        //     option: {
        //         attribution:
        //             'Tiles &copy; Esri &mdash; ' +
        //             'Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
        //     }
        // },
        // google map   https://github.com/iahmedani/gmapleaflet/blob/master/dist/gmapleaflet.js
        google_street: {
            name: 'google street',
            url: 'http://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            option: {
                maxZoom: 20,
                attribution: `google.map`
            }
        },
        google_hybrid: {
            name: 'google hybrid',
            url: 'http://mt0.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
            option: {
                maxZoom: 20,
                attribution: `google.map`
            }
        },
        google_satellite: {
            name: 'google satellite',
            url: 'http://mt0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
            option: {
                maxZoom: 20,
                attribution: `google.map`
            }
        },
        google_terrain: {
            name: 'google terrain',
            url: 'http://mt0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
            option: {
                maxZoom: 20,
                attribution: `google.map`
            }
        },
        // https://account.mapbox.com/access-tokens
        mapbox: {
            name: 'mapbox',
            url: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=sk.eyJ1IjoiaWJhcyIsImEiOiJjbDNpZHg3d2kwNjZ4M2pxeDZ2bTZkaW8wIn0.w2eGWNDpYXnodJ8IXGdhxg',
            option: {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: 'sk.eyJ1IjoiaWJhcyIsImEiOiJjbDNpZHg3d2kwNjZ4M2pxeDZ2bTZkaW8wIn0.w2eGWNDpYXnodJ8IXGdhxg',
            }
        },
        // https://qiita.com/TakeshiNickOsanai/items/783caa9f31bcf762da16
        openstreetmap: {
            name: 'openstreetmap',
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            option: {
                attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            }
        },
        // https://esri.github.io/esri-leaflet/tutorials/working-with-authenticated-services-server.html
        arcgis() {
            _baseMap = _L.esri.basemapLayer('Streets').addTo(map);
            return _baseMap;
        },
        local_cache() {
            window.fetchBase64ByUrl = window.getMapBase64;
            _baseMap = tileBase64("http://a.b?x={x}&y={y}&z={z}",{}).addTo(map);
            map.setZoom(6);
            map.setMaxZoom(7);
            return _baseMap;
        }
    };
    if (-1 === location.search.indexOf('hbuilder=true')) {
        delete baseMap.local_cache;
    }
    return {
        initMap(L,id,center,zoom) {
            _L = L;
            map = L.map(id,{
                zoomControl: false
            }).setView(center, zoom);
            map.on('click', function (e) {
                onMapClick(e);
            });
        },

        set_onMapClick(fn) {
            onMapClick = fn;
        },
        get_map() {
            return map;
        },
        get_basemap() {
            let ret = [];
            for (let i in baseMap) {
                // console.log(i);
                ret.push({
                    name: baseMap[i].name,
                    key: i,
                });
            }
            return ret;
        },
        get_current_basemap_key() {
            return current_baseMap_key;
        },

        changeBaseMap(key) {
            if (key === current_baseMap_key) {
                return ;
            }
            // if (key === 'local_cache') {}
            if (_baseMap) {
                map.removeLayer(_baseMap);
            }
            current_baseMap_key = key;
            if (key in baseMap) {
                if (typeof baseMap[key] === "function") {
                    baseMap[key]();
                } else {
                    _baseMap = _L.tileLayer(baseMap[key].url, {
                        zIndex: 1,
                        ...baseMap[key].option
                    }).addTo(map);
                }
            }
        },
        // add mark
        // https://github.com/masajid390/BeautifyMarker
        addMarker(latlng,text,noAddToMap,flyto) {
            let options = {
                icon: 'street-view',
                iconShape: 'marker'
            };
            let marker = L.marker(latlng, {
                icon: L.BeautifyIcon.icon(options),
                draggable: true
            });
            if (!noAddToMap) {
                marker.addTo(map);
            }
            if (text) {
                marker.bindPopup("popup").bindPopup(text);
            }
            _marker = marker;
            return marker;
        },
        getLastMark() {
            return _marker;
        },
        clickAddMark(flyto) {
            return new Promise(s => {
                let tmpOnMapClick = onMapClick;
                onMapClick = (e) => {
                    _marker = this.addMarker([e.latlng.lat,e.latlng.lng]);
                    onMapClick = tmpOnMapClick;
                    if (flyto) {
                        map.flyTo(e.latlng);
                    }
                    s(_marker);
                }
            });
        },
        removeLayer(obj) {
            map.removeLayer(obj);
        }
    }
})();
