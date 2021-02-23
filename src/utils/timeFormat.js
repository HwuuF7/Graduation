// 封装时间格式（几天前）
export function timeFormat(timestamp) {
    // 确保是时间戳
    timestamp = new Date(timestamp).getTime()
    // 时间差(秒数)
    const mistiming = Math.round((Date.now() - timestamp) / 1000);
    if (mistiming < 0) return new RangeError('日期时间不正确!')
    const tags = ['年', '个月', '周', '天', '小时', '分钟', '秒'];
    const tagsTime = [31536000, 2592000, 604800, 86400, 3600, 60, 1];
    for (let i = 0; i < 7; ++i) {
        const res = Math.floor(mistiming / tagsTime[i]);
        if (res !== 0) return `${res}${tags[i]}前`;
    }
}


// 时间格式（年月日 上午/下午 HH:MM）
export function timeFormatAmPm(date) {
    date = new Date(date);
    // date = new Date()
    let str = '上午';
    const currentYear = new Date().getFullYear()
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let hour = date.getHours();
    if (hour > 13) {
        hour -= 12;
        str = '下午';
    }
    const min = (date.getMinutes() + '').padStart(2, '0');
    if (currentYear !== year) {
        return `${year}年${month}月${day}日 ${str} ${hour}:${min}`
    } else {
        return `${month}月${day}日 ${str} ${hour}:${min}`
    }
}


// 封装含表情内容的解码
export function emojiDecode(message) {
    let patt = /&#\d+;/g;
    let H, L, code;
    let matchArr = message.match(patt) || [];
    matchArr.forEach((item) => {
        code = item.replace('&#', '').replace(';', '');
        // 高位
        H = Math.floor((code - 0x10000) / 0x400) + 0xD800;
        // 低位
        L = (code - 0x10000) % 0x400 + 0xDC00;
        code = "&#" + code + ";";
        let emoji = String.fromCharCode(H, L);
        message = message.replace(code, emoji);
    })
    return message
}