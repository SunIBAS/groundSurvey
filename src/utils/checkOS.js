const OS = {
    Apple: 0,
    Android: 1,
    PC: 2
};

const checkOS = () => new Promise(s => {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        s(OS.Apple);
    } else if (/(Android)/i.test(navigator.userAgent)) {
        s(OS.Android);
    } else{
        s(OS.PC)
    }
})

export {
    checkOS,
    OS
}
