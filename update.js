const fs = require('fs');

// const config_content = `window.config = {};
// window.config.baseApiUrl = 'https://iot.linkpoi.com/Geo-Investigate';
// // window.config.lang = 'Chs'; // En
// `;

// fs.writeFileSync('./hbuilder-app/dist/js/config.js',config_content,'utf-8');

const indexHtml = fs.readFileSync('./hbuilder-app/dist/index.html','utf-8')
    .replace(/="\//g,'="./');

fs.writeFileSync('./hbuilder-app/dist/index.html',indexHtml,'utf-8');
