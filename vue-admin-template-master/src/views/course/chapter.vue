<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>
    <!--
    <el-form label-width="120px">

      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form> -->

    <el-button type="text" @click="openAddChapter()">添加章节</el-button>

    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button
              type="text"
              @click="openAddVedio(chapter.id)"
            >添加小节</el-button
            >
            <el-button
              style
              type="text"
              @click="openUpdateChapter(chapter.id)"
            >编辑</el-button
            >
            <el-button
              type="text"
              @click="delChapterInfo(chapter.id)"
            >删除</el-button
            >
          </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button
                  type="text"
                  @click="openUpdateVideo(video.id)"
                >编辑</el-button
                >
                <el-button
                  type="text"
                  @click="delVideoInfo(video.id)"
                >删除</el-button
                >
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button
        :disabled="saveBtnDisabled"
        type="primary"
        @click="next"
      >下一步</el-button
      >
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="eduChapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="eduChapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="eduChapter.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="eduVideo" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="eduVideo.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number
            v-model="eduVideo.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="eduVideo.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button
          :disabled="saveVideoBtnDisabled"
          type="primary"
          @click="saveOrUpdateVideo"
        >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from '@/api/chapter'
import video from '@/api/video'
export default {
  data() {
    return {
      courseId: '',
      saveBtnDisabled: false, // 保存按钮是否禁用
      saveVideoBtnDisabled: false,
      chapterVideoList: [], // 大纲列表数据
      eduChapter: {}, // 章节数据
      eduVideo: {}, // 小节数据
      dialogChapterFormVisible: false, // 章节对话框展示与否
      dialogVideoFormVisible: false // 小节对话框展示与否
    }
  },

  created() {
    console.log('chapter created')
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getChapterVideoList()
    }
  },

  methods: {
    getChapterVideoList() {
      chapter.getChapterVideoById(this.courseId).then((response) => {
        this.chapterVideoList = response.data.chapterVideoList
      })
    },
    saveOrUpdate() {
      if (this.eduChapter.id) {
        this.updateChapterInfo()
      } else {
        this.saveChapter()
      }
    },
    // 添加章节信息
    saveChapter() {
      // 1把课程id存入eduChapter
      this.eduChapter.courseId = this.courseId
      // 2调用api添加章节
      chapter.addChapter(this.eduChapter).then((response) => {
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        // 3关闭章节对话框
        this.dialogChapterFormVisible = false
        // 4刷新大纲页面
        this.getChapterVideoList()
      })
    },
    updateChapterInfo() {
      chapter.updateChapter(this.eduChapter).then((response) => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        // 3关闭章节对话框
        this.dialogChapterFormVisible = false
        // 4刷新大纲页面
        this.getChapterVideoList()
      })
    },
    delChapterInfo(chapterId) {
      this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          chapter.delChapter(chapterId).then((response) => {
            // 删除成功
            console.log('删除成功')
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 刷新大纲
            this.getChapterVideoList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    saveOrUpdateVideo() {
      if (this.eduVideo.id) {
        this.updateVedioInfo()
      } else {
        this.saveVedio()
      }
    },
    // 保存小节信息
    saveVedio() {
      // 课程id存储
      this.eduVideo.courseId = this.courseId
      video.addVideo(this.eduVideo).then((response) => {
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        // 关闭小节对话框
        this.dialogVideoFormVisible = false
        // 刷新大纲页面
        this.getChapterVideoList()
      })
    },
    updateVedioInfo() {
      video.updateVideo(this.eduVideo).then((response) => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        // 3关闭章节对话框
        this.dialogVideoFormVisible = false
        // 4刷新大纲页面
        this.getChapterVideoList()
      })
    },
    // 删除小节信息
    delVideoInfo(videoId) {
      this.$confirm('此操作将永久删除该小节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          video.delVideo(videoId).then((response) => {
            // 删除成功
            console.log('删除成功')
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 刷新大纲
            this.getChapterVideoList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    openAddChapter(chapterId) {
      this.eduChapter = {}
      this.dialogChapterFormVisible = true
    },
    // 打开小节绑定方法
    openAddVedio(chapterId) {
      this.eduVideo = {}
      //   this.eduVideo.isFree = false
      this.eduVideo.chapterId = chapterId
      this.dialogVideoFormVisible = true
    },
    // 打开小节编辑绑定方法
    openUpdateVideo(videoId) {
      video.getVideoById(videoId).then((response) => {
        this.eduVideo = response.data.eduVideo
        this.dialogVideoFormVisible = true
      })
    },
    openUpdateChapter(chapterId) {
      chapter.getChapterById(chapterId).then((response) => {
        this.eduChapter = response.data.eduChapter
        this.dialogChapterFormVisible = true
      })
    },

    previous() {
      console.log('previous')
      this.$router.push({ path: `/course/add/${this.courseId}` })
    },

    next() {
      console.log('next')
      this.$router.push({ path: `/course/publish/${this.courseId}` })
    }
  }
}
</script>
<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>
