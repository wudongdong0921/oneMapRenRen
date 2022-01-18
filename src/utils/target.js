const target = {};
target.get = function (key){
    return window.SITE_CONFIG['targetPath'][key]
}

export default target
