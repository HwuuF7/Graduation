// 封装时间格式
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