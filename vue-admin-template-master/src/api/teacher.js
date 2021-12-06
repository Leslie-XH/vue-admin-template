import request from '@/utils/request'

export default {
  getTeacherPageVo(current, limit, teacherQuery) {
    return request({
      url: `/eduservice/eduteacher/getTeacherPageVo/${current}/${limit}`, // 模板字符串
      method: 'post',
      data: teacherQuery // 转化json传递
    })
  },
  // 根据id删除讲师
  delTeacher(id) {
    return request({
      url: `/eduservice/eduteacher/${id}`,
      method: 'delete'
    })
  },
  // 添加讲师
  addTeacher(eduTeacher) {
    return request({
      url: '/eduservice/eduteacher/save',
      method: 'post',
      data: eduTeacher
    })
  },
  // 编辑讲师
  editTeacher(eduTeacher) {
    return request({
      url: '/eduservice/eduteacher/updateTeacherById',
      method: 'post',
      data: eduTeacher
    })
  },
  // 根据id获取讲师
  getTeacherById(id) {
    return request({
      url: `/eduservice/eduteacher/getTeacherById/${id}`,
      method: 'get'
    })
  },
  // 获取所有讲师
  getAllTeacher() {
    return request({
      url: `/eduservice/eduteacher/getAllTeacher/`,
      method: 'get'
    })
  }
}
