export const checkAppleDevices = function () {
    let nv = navigator.userAgent.toLocaleLowerCase();
    return nv.includes('iphone') || nv.includes('macintosh');
}
export const checkHeight = function () {
    // alert('check height 123')
    let nv = navigator.userAgent.toLocaleLowerCase();
    if (nv.includes('macintosh')) {
        // return `calc(100dvh - 32px)`;
        return `calc(100vh - 60px)`;
        // return `100vh`;
    } else if (nv.includes('iphone')) {
        return `calc(100dvh - 70px)`;
    } else {
        return '100vh';
    }
}