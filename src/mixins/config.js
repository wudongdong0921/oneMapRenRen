export function type (target) {
  var tem = {
    '[object Array]': 'array',
    '[object Object]': 'object',
    '[object Boolean]': 'boolean - object',
    '[object Number]': 'number - object',
    '[object String]': 'string - object'
  }
  if (target === null) {
    return null
  }
  if (typeof target === 'object') {
    var str = Object.prototype.toString.call(target)
    return tem[str]
  } else {
    return typeof target
  }
}
