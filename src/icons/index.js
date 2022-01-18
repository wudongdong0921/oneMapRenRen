// import './iconfont'
// const svgFiles = require.context('./svg', true, /\.svg$/)
// svgFiles.keys().map(item => svgFiles(item))
// import './fontivew/iconfont'
// import './fontivew/icon-demo/iconfont'
const svgFiles = require.context('./svgivew', true, /\.svg$/)
svgFiles.keys().map(item => svgFiles(item))