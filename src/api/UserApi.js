const login = (username,password) => {
    return new Promise(s => {
        s({
            username,
            password,
        })
    })
};

export {
    login
}
