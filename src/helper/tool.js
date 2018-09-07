/**
 * Created by huangchao on 2017/10/20.
 */

const ArrayDelRepetition = function(data) {
  let tmp = {}
  let arr = []
  for (let i = 0; i < data.length; i++) {
    if (!tmp[data[i]]) {
      arr.push(data[i])
      tmp[data[i]] = data[i]
    }
  }
  return arr
}

const changeEmail = function(email) {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
  return reg.test(email)
}

const changePhoneNumber = function(num) {
  const reg = /^1[3456789]\d{9}$/
  return reg.test(num)
}

const filterUndefind = function(obj) {
  const o = {}
  Object.keys(obj).forEach(data => {
         if(obj[data] === ""){
              o[data] = null
         }
        if (obj[data] !== undefined) {
          o[data] = obj[data]
        }
  })
  return o
}

const recursionData = function(array = []) {
  const data =[]
  array.forEach((d, index) => {
    let obj = {}
    obj.title = d.departmentName || d.chineseName
    obj.key = d.idz || d.userId
    obj.children = []
    data.push(obj)
    if(d.idz) {
      if(d.child.length > 0) {
        let arr = recursionData(d.child)
        data[index].children = arr
      }
    }
  })
  return data
}

export default {
  ArrayDelRepetition,
  changeEmail,
  changePhoneNumber,
  filterUndefind,
  recursionData,
}
