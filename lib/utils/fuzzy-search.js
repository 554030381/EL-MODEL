export function formAutoProcess(data, optionList) {
  const newData = Object.assign({}, data)
  optionList.forEach((item) => {
    if (item?.fuzzySearch && data[item.verbose]) {
      // eslint-disable-next-line
      let fuzzyName = item?.fuzzyName || item.verbose + '__icontains'
      newData[fuzzyName] = data[item.verbose]
      newData[item.verbose] = undefined
    } else if (item?.fuzzyDate && data[item.verbose]) {
      // eslint-disable-next-line
      let fuzzyDateName = item?.fuzzyDateName || item.verbose + '__gte'
      newData[fuzzyDateName] = data[item.verbose]
      newData[item.verbose] = undefined
    } else if (item?.fuzzyDateRange && data[item.verbose]) {
      // eslint-disable-next-line
      let fuzzyDateRangeName = []
      fuzzyDateRangeName[0] =
        item?.fuzzyDateRangeName?.start || item.verbose + '__gte'
      fuzzyDateRangeName[1] =
        item?.fuzzyDateRangeName?.end || item.verbose + '__lte'
      newData[fuzzyDateRangeName[0]] = data[item.verbose][0]
      newData[fuzzyDateRangeName[1]] = data[item.verbose][1]
      newData[item.verbose] = undefined
    }
  })
  return newData
}
