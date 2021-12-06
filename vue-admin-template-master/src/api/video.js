import request from '@/utils/request'

export default {
  addVideo(eduVideo) {
    return request({
      url: `/eduservice/eduvideo/addVideo`,
      method: 'post',
      data: eduVideo
    })
  },
  // 根据id删除小节
  delVideo(vedioId) {
    return request({
      url: `/eduservice/eduvideo/delVideo/${vedioId}`,
      method: 'delete'
    })
  },
  // 根据id查询小节
  getVideoById(vedioId) {
    return request({
      url: `/eduservice/eduvideo/getVideoById/${vedioId}`,
      method: 'get'
    })
  },
  // 修改小节
  updateVideo(eduVideo) {
    return request({
      url: `/eduservice/eduvideo/updateVideo`,
      method: 'post',
      data: eduVideo
    })
  }
}
