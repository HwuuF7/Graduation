// 校验规则的封装

// 输入内容不能为空
const notNull = function (input) {
    return String(input).trim() !== ''
}

// 输入内容必须为数字
const mustNumber = function (input) {
    let pattern = /^\d{1,}$/
    return pattern.test(input)
}

// 限制输入长度
const inputLen = function (input, min, max) {
    let pattern = `^.{${min},${max}}$`;
    pattern = new RegExp(pattern);
    console.log(pattern);
    return pattern.test(input)
}
console.log(inputLen('我很好你呢', 1, 3));