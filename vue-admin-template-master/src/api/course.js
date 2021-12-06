import request from '@/utils/request'

export default {
  saveCourseInfo(courseInfo) {
    return request({
      url: '/eduservice/educourse/savecourseinfo/',
      method: 'post',
      data: courseInfo
    })
  },
  getCourseInfoById(id) {
    return request({
      url: `/eduservice/educourse/getCourseInfoById/${id}`,
      method: 'get'
    })
  },
  getCoursePublishById(id) {
    return request({
      url: `/eduservice/educourse/getCoursePublishById/${id}`,
      method: 'get'
    })
  },
  publishCourse(id) {
    return request({
      url: `/eduservice/educourse/publishCourse/${id}`,
      method: 'put'
    })
  },
  // 查询所有课程信息
  getCourseInfo(current, limit, courseQuery) {
    return request({
      url: `/eduservice/educourse/getCourseInfo/${current}/${limit}`,
      method: 'post',
      data: courseQuery // 转化json传递
    })
  },
  // 删除课程信息
  delCourseInfo(id) {
    return request({
      url: `/eduservice/educourse/delCourseInfo/${id}`,
      method: 'delete'
    })
  }
}
