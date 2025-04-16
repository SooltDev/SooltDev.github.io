
const cookieParser = () => {

    let cookie = {};

    function init(){
        cookie = {};

        let cookies = document.cookie.split("; "); 

        for (const cookieItem of cookies){
            const cookieKeyVal = cookieItem.split("=");
            cookie[cookieKeyVal[0]] = cookieKeyVal[1];
        }
    }

    init();

    const getItem = key => cookie[key];

    const setItem = (key, val, expireday = 30, path = '/') => {
        const d = new Date( Date.now() + (1000 * 60 * 60 * 24 * expireday) );
        document.cookie = `${key}=${val}; expires=${d.toUTCString()}; path=${path};`;

        //cookie[key] = val;
        init();
    }

    const removeItem = key => {
        document.cookie = `${key}=; expires=${new Date(0).toUTCString()}; path=/`;
        init();
    }

    return {
        getItem, setItem, removeItem,
        get cookie() {
            return cookie;
        }
    }
}

