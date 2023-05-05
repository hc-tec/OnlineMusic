const isNameValid = (name) => {
    if(!name) return false
    if(name.trim() !== name) return false // 头尾不能包含空格

    let arr = name.match(/[^\u4e00-\u9fa5A-z\s]/g) // 找到所有非汉字英文空格的字符
    if(arr) return false
    arr = name.match(/\s{2,}/g) // 找到所有连续两次及以上的空格
    if(arr) return false
    return true
}

module.exports = isNameValid