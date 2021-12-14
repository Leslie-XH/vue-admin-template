import request from '@/utils/request'

export default {


    //获取所以讲师集合 分页
    getTeacherApiPage(page, limit) {
        return request({
            url: `/eduservice/teacherapi/getTeacherApiPage/${page}/${limit}`,
            method: 'get'
        })
    },
    getTeacherCourseInfo(id) {
        return request({
            url: `/eduservice/teacherapi/getTeacherCourseInfo/${id}/`,
            method: 'get'
        })
    }
}