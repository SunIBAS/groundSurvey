// import Cookies from 'js-cookie';
const Lang_Cookie = '__lang__cookie__';
import {
    Storage
} from "./storage";

export const systemLangOptions = {
    Chs: {
        text: '中文(简体)',
        type: 'Chs',
        next: true,
    },
    En: {
        text: 'English',
        type: 'En',
        next: false,
    },
    // kk: {
    //     text: 'қазақ тілі', // 哈萨克文
    //     type: 'kk',
    //     next: false,
    // }
};

function setSystemLang(lang) {
    return Storage._set_info_to_sessionStorage(Lang_Cookie,lang);
    // Cookies.set(Lang_Cookie,lang);
}

function getSystemLang() {
    // let lang = Cookies.get(Lang_Cookie);
    return Storage._get_info_from_sessionStorage(Lang_Cookie).then(lang => {
        if (!lang) {
            // debugger
            lang = 'Chs';
            setSystemLang(lang);
        }
        return lang;
    });
}

export const Lang = Vue => {
    let $lang = new (class {
        constructor() {
            this.lang = window.lang;
            this.type = 'Chs';
            this.$vue = null;
        }
        setVueInst($vue) {
            this.$vue = $vue;
        }
        setType(type) {
            this.type = type;
            // this.$vue.$set(this.$vue.$lang,'$lang_type',type);
            // this.$vue.$root.$lang_type = type;
            if (this.$vue) {
                this.$vue.$lang_type = type;
            }
            setSystemLang(type);
        }
        get(word) {
            if (word in this.lang && this.type in this.lang[word]) {
                return this.lang[word][this.type];
            } else {
                console.log(`缺失 ${word}`);
                return word;
            }
        }
    });
    return getSystemLang().then(_lang => {
        Vue.prototype.$lang = {
            setType(type) {
                $lang.setType(type);
                this.$lang_type = type;
            },
            get(word) {
                return $lang.get(word);
            },
            setVueInst($vue) {
                $lang.setVueInst($vue);
            },
            $lang_type: _lang
        }
        $lang.setType(_lang);
        return "";
    });
}
