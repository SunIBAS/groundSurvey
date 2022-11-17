const t2 = n => {
    let z = '00';
    n = n + '';
    return z.substring(n.length) + n;
}
// 2022-07-20T01:57:15.000+00:00
export const Ts2Sting = ts => {
    let d = new Date();
    d.setTime(ts);
    return `${d.getFullYear()}-${t2(d.getMonth() + 1)}-${t2(d.getDate())}T${t2(d.getHours())}:${t2(d.getMinutes())}:${t2(d.getSeconds())}`;
}
//
export const String2Date = str => {
    let d = new Date();
    // str = 2022-07-20T01:57:15.000+00:00
    let ymd = str.split('T')[0].split('-');
    let hms = str.split('T')[1].split('.')[0].split(':');
    d.setFullYear(ymd[0]);
    d.setDate(ymd[2]);
    d.setMonth(+ymd[1] - 1);
    d.setHours(hms[0]);
    d.setMinutes(hms[1]);
    d.setSeconds(hms[2]);
    return d;
}

export const TS_Tag = {
    start: 'start',
    end: 'end'
}
// dt : new Date
// tag : start end 表示 0:0:0 23:59:59
export const getDateTSByOneDay = (dt,tag) => {
    let d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    d.setFullYear(dt.getFullYear());
    d.setMonth(dt.getMonth());
    d.setDate(dt.getDate());
    if (tag === 'start') {
        return d.getTime();
    } else {
        return d.getTime() + 24 * 1000 * 3600 - 1;
    }
}
