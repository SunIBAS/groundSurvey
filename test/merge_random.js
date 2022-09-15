const fs = require('fs');
const path = require('path');

// const p = 'mcd43a3';
// const p = 'mod09a1';
// const p = 'mod11a2';
const source_path = process.argv[2] || 'd:\\mod13a2';// + out
const merge_path = (process.argv[2] || 'd:\\mod13a2') + "\\merge"
const p = (process.argv[3] || 'mod13a2').toLowerCase();

const driverName = 'd';
const tifPath = `${source_path}\\out`

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

let txts = [`echo #PackageR.exe RunRAsTplTiff calc ${p}_packager.txt`,`mkdir ${merge_path}`];
for (let i in tifs) {
    let writeLine = [];
    let ps = build_merge(tifs[i],seqs[p]);
    txts.push(`del merge.txt`)
    txts = txts.concat(...ps.map((p,ind) => {
        writeLine.push(`b${ind}`);
        return `echo read b${ind} ${p} >> merge.txt`;
    }));
    txts.push(`echo write ${writeLine.join('#')} ${merge_path}\\${i}.tif >> merge.txt`);
    txts.push(`PackageR.exe RunRAsTplTiff calc merge.txt`);
    txts.push('echo ##################################################################')
    txts.push('echo ##################################################################')
    txts.push('echo ##################################################################')
    // break;
}

// console.log(txts.join('\r\n'));
fs.writeFileSync(`merge_${p}_packager.bat`,txts.join('\r\n'),'utf-8');
