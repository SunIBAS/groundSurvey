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
        fetch(url).then(_ => _.text()).then(src => {
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
