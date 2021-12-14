import request from '@/utils/request'

export default {

    //用户登录
    submitLogin(loginVo) {
        return request({
            url: `/ucenterservice/ucentermember/login`,
            method: 'post',
            data: loginVo
        })
    },
    //根据token字符串获取用户信息
    getUcenterByToken() {
        return request({
            url: `/ucenterservice/ucentermember/getUcenterByToken`,
            method: 'get'
        })
    },
    getUcenterByToken2() {
        return request({
            url: `/ucenterservice/ucentermember/getUcenterByToken2`,
            method: 'get'
        })
    }


}