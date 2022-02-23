export function hasProp(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export function filterObj(obj, arr) {
  const result = {}
  if (obj) {
    Object.keys(obj)
      .filter((key) => arr.includes(key))
      .forEach((key) => {
        result[key] = obj[key]
      })
  }
  return result
}

// Notes:
// when specify parameters as ('k','v')
// it can transfer [{k:k1,v:v1,x:t,y:t},[{k:k2:v:v2,z:t}],[{k:k3:v:v3}],[{k:k4,v:v4}],...
// into {k1:v1,k2:v2,k3:v3,k4,v4,...}
// Usage:
// listToDict('verbose', 'value')(raw_list1, raw_list2, raw_list3, ...)
// listToDict(name_of_key:string, name_of_value:string)(some_parameters_of_list,sep_by_comma)
const listToDict =
  (k, v) =>
  (...lists) => {
    const obj = {}
    lists.forEach((list) => {
      list.forEach((o) => {
        obj[o[k]] = o[v]
      })
    })
    return obj
  }

export { listToDict }
