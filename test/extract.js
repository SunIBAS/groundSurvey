const fs = require('fs');

let mcd = 'C:\\Users\\IBAS\\Downloads\\MCD43A3\\merge.csv';
let oth = 'C:\\Users\\IBAS\\Downloads\\MCD43A3\\LAADS_query.2022-08-25T09_15.csv';

const getObj = filename => fs.readFileSync(filename,'utf-8').split('\n').map(_ => _.trim()).filter(_ => _.startsWith('1') || _.startsWith('2')).map(_ => {
    let ffs = _.split(',');
    d = ffs[1].split('/').reverse()[0].split('.')[1];
    return {
        url: ffs[1],
        date: d, // A200001
    };
});

let outObj = {};
oth = getObj(oth).map(_ => _.date);
mcd = getObj(mcd);
mcd = mcd.filter(_ => oth.includes(_.date));
console.log(`oth.length = ${oth.length}\tmcd.length = ${mcd.length}`);
mcd.forEach((_,i) => {
    outObj[_.date + i] = {
        url: _.url
    };
});

fs.writeFileSync('./mcd.json',JSON.stringify(outObj),'utf-8');







