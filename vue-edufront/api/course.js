import request from '@/utils/request'
export default {
    getPageList(page, limit, searchObj) {
        return request({
            url: `/eduservice/educourseapi/getCoursePage/${page}/${limit}`,
            method: 'post',
            data: searchObj
        })
    },

    //根据课程id查询课程相关信息
    getCourseWebInfo(courseId) {
        return request({
            url: `/eduservice/educourseapi/getCourseWebInfo/${courseId}`,
            method: 'get'
        })
    },
    // 获取课程二级分类
    getNestedTreeList2() {
        return request({
            url: `/eduservice/edusubject/getList`,
            method: 'get'
        })
    }
}