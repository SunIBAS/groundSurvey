const fs = require('fs');
const path = require('path');

// const p = 'mcd43a3';
// const p = 'mod09a1';
// const p = 'mod11a2';
const p = 'mod13a2';
const driverName = 'd';
const tifPath = `${driverName}:\\${p}\\out`

const tifs = {};
fs.readdirSync(tifPath).filter(_ => _.endsWith('.tif')).forEach(fname => {
    let fns = fname.split('.');
    let key = fns[0] + '.' + fns[1];
    if (!(key in tifs)) {
        tifs[key] = [];
    }
    tifs[key].push({
        key: fns[fns.length - 2],
        fname: fname
    });
});

const seqs = {
    mod09a1: ['sur_refl_b01','sur_refl_b02','sur_refl_b03','sur_refl_b04','sur_refl_b05','sur_refl_b06','sur_refl_b07','sur_refl_szen'],
    mcd43a3: ['Albedo_WSA_Band1','Albedo_WSA_Band2','Albedo_WSA_Band3','Albedo_WSA_Band4','Albedo_WSA_Band5','Albedo_WSA_Band6','Albedo_WSA_Band7'],
    mod11a2: ['LST_Day_1km','LST_Night_1km','Emis_31','Emis_32'],
    mod13a2: ['1_km_16_days_NDVI','1_km_16_days_EVI']
}

const build_merge = (arr,seq) => {
    let a = [];
    seq.forEach(_ => a.push(-1));
    arr.forEach((_,ind) => a[seq.indexOf(_.key)] = ind);
    if (a.filter(_=>_===-1).length) {
        console.log('------------ [error] -------------')
        console.log(arr);
        return [];
    }
    return a.map(_ => path.join(tifPath,arr[_].fname));
};

let txts = [`#PackageR.exe RunRAsTplTiff calc ${p}_packager.txt`];
for (let i in tifs) {
    let writeLine = [];
    let ps = build_merge(tifs[i],seqs[p]);
    txts = txts.concat(...ps.map((p,ind) => {
        writeLine.push(`b${ind}`);
        return `read b${ind} ${p}`;
    }));
    txts.push(`write ${writeLine.join('#')} ${driverName}:\\${p}\\merge\\${i}.tif`);
    txts.push('##################################################################')
    txts.push('##################################################################')
    txts.push('##################################################################')
    // break;
}

// console.log(txts.join('\r\n'));
fs.writeFileSync(`${p}_packager.txt`,txts.join('\r\n'),'utf-8');
