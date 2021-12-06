import request from '@/utils/request'

export default {
  getNestedTreeList() {
    return request({
      url: '/eduservice/edusubject/getList/',
      method: 'get'
    })
  }

}
