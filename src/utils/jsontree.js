//将后台的json转成jsonTree格式
var jsonTree = function (data,config) {
  var id = config.id || 'id',
      pid = config.pid || 'pid',
      children = config.children || 'children';
      var idMap = [],
      jsTree = [];
      data.forEach(function(v){
        idMap[v[id]] = v;
      });
      data.forEach(function(v){
      var parent = idMap[v[pid]];
      if(parent) {
        !parent[children] && (parent[children] = []);
        parent[children].push(v);
      } else {
        jsTree.push(v);
      }
  });
  return jsTree;
};




export default jsonTree