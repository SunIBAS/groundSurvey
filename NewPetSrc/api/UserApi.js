import {
    request,
    requestPostWithData,
    loginUrl
} from './request';
const registerUrl = `${window.config.baseApiUrl}/user/register`;
const logoutUrl = `${window.config.baseApiUrl}/user/logout`;

const login = (username,password) => {
    return requestPostWithData(loginUrl,{
        password,
        username,
    });
}
// const login = () => {
//     return new Promise((s) => s(123));
// }

const logout = () => request(logoutUrl,{method: 'post'});

const register = (username,password) => {
    return requestPostWithData(registerUrl,{
        username,
        password
    },null,true)
}

export {
    login,
    logout,
    register
}
