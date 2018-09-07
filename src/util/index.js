//获取url参数
// export function getUrlParam(name){
//      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//      var r = window.location.search.substr(1).match(reg);
//      if (r != null) return unescape(r[2]); return null;
// }

let windowCount = 0

/*
但当参数中有中文的时候， 就会出现乱码的问题。 通过查询资料 原来是浏览器默认使用的是 encodeURI 对汉字进行的编码 所以在解码的时候就需要使用decodeURI  而不是 unescape 上面的代码稍微修改下后 就能解决中文乱码的问题了
*/
export function getUrlParam(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/*
过滤Select中option选项(支持中文，拼音，拼音首字母缩写)
*/
export function filterOption(input, option) {
  if (option.props.children) {
    let userPinyin = option.props.userPinyin
    let long = ''
    let short = ''
    if (!long && !short && userPinyin) {
      long = userPinyin.split('/')[0]
      short = userPinyin.split('/')[1]
    }
    const tf1 = long.toUpperCase().indexOf(input.trim().toUpperCase()) === 0
    const tf2 = short.toUpperCase().indexOf(input.trim().toUpperCase()) === 0
    const tf3 = option.props.children.indexOf(input.trim()) === 0
    if (tf1 || tf2 || tf3) {
      return true
    }
  }
}

export function getBigDate(date1, date2) {
  var oDate1 = new Date(date1)
  var oDate2 = new Date(date2)
  if (oDate1.getTime() > oDate2.getTime()) {
    return 1
  } else if (oDate1.getTime() < oDate2.getTime()) {
    return 2
  } else {
    return 0
  }
}

export function newWindow(url, text) {
  windowCount = windowCount - 1
  const iWidth = 900 //弹出窗口的宽度;
  const iHeight = 700 //弹出窗口的高度;
  const iTop = (window.screen.height- 160 - (80 * windowCount) - iHeight) / 2 //获得窗口的垂直位置;
  const iLeft = (window.screen.width - (80 * windowCount) - iWidth) / 2 //获得窗口的水平位置;
  const w = window.open(
    url,
    '_blank',
    `location=no,menubar=no,toolbar=no,status=no,scrollbars=yes,height=${iHeight},width=${iWidth},top=${iTop},left=${iLeft}`
  )

  setTimeout(() => {
      try{
          w.document.title = text
      }catch(err){
          console.log(err);
      }

  }, 1000)

  const popupTick = setInterval(() => {
    if (w.closed) {
      clearInterval(popupTick);
      windowCount = windowCount + 1
    }
  }, 500);
}
