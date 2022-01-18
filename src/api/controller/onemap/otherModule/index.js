const files = require.context('.', false, /\.js$/)
const modules = {}
let controllerModule = {}
// 合并/service中的全部js文件
files.keys().forEach(key => {
    if (key === './index.js') return
    modules[key.replace(/(\.\/|\.js)/g, '')] = files(key)
})

for (const key in modules) {
    if (modules.hasOwnProperty.call(modules, key)) {
        const item = modules[key];
        for (const s in item) {
            if (item.hasOwnProperty.call(item, s)) {
                const element = item[s];
                controllerModule[s] = element
            }
        }
    }
}

export default modules