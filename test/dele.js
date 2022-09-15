const fs = require('fs');

let cmds = [];
fs.readdirSync('X:\\MODIS_DOWNLOAD_10-20\\MCD43A3').filter(_ => _.endsWith('.hdf')).forEach(f => {
    // MCD43A3.A2019001.h22v04.006.2019010202616.hdf
    let doy = +f.split('.')[1].substring(5);
    if ((doy - 1) % 8) {
        cmds.push(`del ${f}`);
    }
    // console.log(doy);
});
fs.writeFileSync('dels.bat',cmds.join('\r\n'),'utf-8');
