const vaildCheck = {
    isSongNameValid(name = '') {
        if(!name) return false
        if(name.trim() !== name) return false // 头尾不能包含空格
    
        let arr = name.match(/[^\u4e00-\u9fa5A-z\s]/g) // 找到所有非汉字英文空格的字符
        if(arr) return false
        arr = name.match(/\s{2,}/g) // 找到所有连续两次及以上的空格
        if(arr) return false
        return true
    },

    isUserNameValid(name = '') {
        if(!name) return false
        if(name.length > 7) return false // 用户名长度不大于7
    
        let arr = name.match(/[^\u4e00-\u9fa5A-z0-9]/g) // 找到所有非汉字英文数字的字符
        if(arr) return false
    
        return true
    },

    isPasswordValid(name = '') {
        if(!name) return false
        if(name.length > 12) return false // 用户名长度不大于12
    
        let arr = name.match(/[^A-z0-9/]/g) // 找到所有非英文数字的字符
        if(arr) return false
    
        return true
    },
}

module.exports = vaildCheck