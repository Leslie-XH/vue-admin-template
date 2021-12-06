<template>
  <div class="app-container">

    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.name" placeholder="讲师名"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="courseQuery.isFree" clearable placeholder="是否免费">
          <el-option :value="0" label="收费"/>
          <el-option :value="1" label="免费"/>
        </el-select>
      </el-form-item>

      <el-form-item label="课程类别">
        <el-select
          v-model="courseQuery.subjectParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged(courseQuery.subjectParentId)"
        >
          <el-option
            v-for="subject in subjectNestedList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseQuery.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in subSubjectList"
            :key="subject.title"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="courseQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="courseQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" @click="addTeacher()">添加</el-button>
      <el-button type="primary" icon="el-icon-search" @click="getCoursePage()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
      row-class-name="myClassList"
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column label="课程信息" width="470" align="center">
        <template slot-scope="scope">
          <div class="info">
            <div class="pic">
              <img :src="scope.row.cover" alt="scope.row.title" width="150px">
            </div>
            <div class="title">
              <a href>{{ scope.row.title }}</a>
              <p>{{ scope.row.lessonNum }}课时</p>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">{{ scope.row.gmtCreate.substr(0, 10) }}</template>
      </el-table-column>
      <el-table-column label="发布时间" align="center">
        <template slot-scope="scope">{{ scope.row.gmtModified.substr(0, 10) }}</template>
      </el-table-column>
      <el-table-column label="价格" width="100" align="center">
        <template slot-scope="scope">
          {{ Number(scope.row.price) === 0 ? '免费' :
          '¥' + scope.row.price.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="buyCount" label="付费学员" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.buyCount }}人</template>
      </el-table-column>

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/add/'+scope.row.id">
            <el-button type="text" size="mini" icon="el-icon-edit">编辑课程信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button type="text" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
          </router-link>
          <el-button type="text" size="mini" icon="el-icon-delete" @click="delCourse(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="current"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getCoursePage"
    />
  </div>
</template>
<script>
import course from '@/api/course'
import subject from '@/api/subject'

export default {
  data() {
    return {
      listLoading: true, // 是否显示loading信息
      list: [], // 课程数据列表
      page: 1, // 页码
      limit: 2, // 每页记录数
      total: 0, // 总记录数
      courseQuery: {},
      current: 1,
      subjectNestedList: [], // 一级目录
      subSubjectList: {}

    }
  },
  created() {
    // 组装课程类别
    this.getAllSubjectInfo()
    this.listLoading = false
    this.getCoursePage()
  },
  methods: {
    getCoursePage(current = 1) {
      this.current = current// 传值的
      course.getCourseInfo(this.current, this.limit, this.courseQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.records
        this.listLoading = false
      })
    },
    // 一级目录
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
    resetData() {
      this.courseQuery = {}
    },
    delCourse(id) {
      this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          course.delCourseInfo(id).then((response) => {
            // 删除成功
            console.log('删除成功')
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 刷新页面
            this.getCoursePage()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }

}
</script>
