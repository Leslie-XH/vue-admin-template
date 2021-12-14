import request from '@/utils/request'

export default {
    

    //根据手机号码发送短信
    getMobile(phone) {
        return request({
        url: `/edumsmservice/msm/sendSmsPhone/${phone}`,
        method: 'get'
        })
    },
    //注册
    submitRegister(registerVo){
        return request({
            url: `/ucenterservice/ucentermember/register`,
            method: 'post',
            data: registerVo
          })
    }
}