<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 所属分类 TODO -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged(courseInfo.subjectParentId)"
        >
          <el-option
            v-for="subject in subjectNestedList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in subSubjectList"
            :key="subject.title"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/ossservice/fileoss/uploadFile'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" >
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />元
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="next"
        >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from '@/api/course'
import teacher from '@/api/teacher'
import subject from '@/api/subject'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },
  data() {
    return {
      courseId: '',
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo: {
        subjectId: '',
        cover: '/static/1.png'
      }, // 课程基本信息
      teacherList: [], // 教师列表
      subjectNestedList: [],
      subSubjectList: [],
      BASE_API: process.env.BASE_API // 接口API地址
    }
  },
  created() {
    this.getAllSubjectInfo()
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getCourseInfoFormById(this.courseId)
    }

    this.getTeacherList()
  },
  methods: {
    getCourseInfoFormById(id) {
      course.getCourseInfoById(id).then((response) => {
        this.courseInfo = response.data.courseInfo
        // 一级
        subject.getNestedTreeList().then((response) => {
          this.subjectNestedList = response.data.items
          // 二级
          for (let i = 0; i < this.subjectNestedList.length; i++) {
            const oneSubject = this.subjectNestedList[i]
            if (oneSubject.id === this.courseInfo.subjectParentId) {
              this.subSubjectList = oneSubject.children
              console.log('this.subSubjectList:' + this.subSubjectList)
            }
          }
        })
      })
    },
    next() {
      course.saveCourseInfo(this.courseInfo).then((response) => {
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        this.$router.push({
          path: `/course/chapter/${response.data.courseId}`
        })
      })
    },
    getTeacherList() {
      teacher.getAllTeacher().then((response) => {
        this.teacherList = response.data.items
      })
    },
    getAllSubjectInfo() {
      subject.getNestedTreeList().then((response) => {
        this.subjectNestedList = response.data.items
      })
    },
    // 组装二级分类数据
    subjectLevelOneChanged(oneId) {
      for (let i = 0; i < this.subjectNestedList.length; i++) {
        console.log('oneId' + oneId)
        const oneSubject = this.subjectNestedList[i]
        if (oneSubject.id === oneId) {
          this.subSubjectList = oneSubject.children
          this.courseInfo.subjectId = ''
          console.log('this.subSubjectList:' + this.subSubjectList)
        }
      }
    },
    handleAvatarSuccess(res, file) {
      console.log(res) // 上传响应
      console.log(URL.createObjectURL(file.raw)) // base64编码
      this.courseInfo.cover = res.data.url
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
