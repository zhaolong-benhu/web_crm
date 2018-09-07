/******************************
** 文件描述 :  Cookie
** 时    间 ： 2019.09
** 作    者 ： zhaolong
** E-mail： zhaolong@DFWSGROUP.COM
*******************************/
import $ from 'jquery'

// //读取Cookie
export function getCookie(cookie_name){
    var allcookies = document.cookie;
    var cookie_pos = allcookies.indexOf(cookie_name);
    if (cookie_pos != -1){
            cookie_pos += cookie_name.length + 1;
            var cookie_end = allcookies.indexOf(";", cookie_pos);
            if (cookie_end == -1){
                cookie_end = allcookies.length;
            }
             return decodeURI(allcookies.substring(cookie_pos, cookie_end));
    }
}
// //删除Cookie
export function delCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=$.cookie(name);
    if(cval!=null)
    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}



// 价格转化方法
 // function toDecimal (num, size) {
 //    return (String(num) + Array((size || 2) + 1).join('0')).replace(/\./g, '').replace(new RegExp('(' + parseInt(num) + ')'), '$1.').match(new RegExp('\\d+\\.\\d{' + size + '}'))[0]
 //  }
