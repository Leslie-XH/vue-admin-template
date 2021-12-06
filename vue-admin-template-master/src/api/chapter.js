import request from '@/utils/request'

export default {
  getChapterVideoById(courseId) {
    return request({
      url: `/eduservice/educhapter/getChapterVideoById/${courseId}`,
      method: 'get'
    })
  },
  addChapter(eduChapter) {
    return request({
      url: `/eduservice/educhapter/addChapter`,
      method: 'post',
      data: eduChapter
    })
  },
  // 根据id删除章节
  delChapter(courseId) {
    return request({
      url: `/eduservice/educhapter/delChapter/${courseId}`,
      method: 'delete'
    })
  },
  // 根据id查询章节
  getChapterById(courseId) {
    return request({
      url: `/eduservice/educhapter/getChapterById/${courseId}`,
      method: 'get'
    })
  },
  // 修改章节
  updateChapter(eduChapter) {
    return request({
      url: `/eduservice/educhapter/updateChapter`,
      method: 'post',
      data: eduChapter
    })
  }
}
