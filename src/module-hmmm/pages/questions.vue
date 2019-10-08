<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-form>
        <!-- 顶部按钮 -->
        <el-row style="margin-bottom:10px;margin-left:20px">
          <el-col :span="2">
            <el-button type="info">新增试题</el-button>
          </el-col>
          <el-col :span="3" style="margin-left:20px">
            <el-button type="info">批量导入</el-button>
          </el-col>
        </el-row>
        <!-- 搜索框 1 -->
        <el-row style="margin-bottom:10px">
          <el-col :span="6">
            学科：
            <el-select clearable style="width:180px" v-model="serchForm.subjectID">
              <el-option
                v-for="item in subjectIDList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            难度：
            <el-select clearable style="width:180px" v-model="serchForm.difficulty">
              <el-option
                v-for="item in difficultyList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            试题类型：
            <el-select clearable style="width:180px" v-model="serchForm.questionType">
              <el-option
                v-for="item in questionTypeList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            标签：
            <el-select clearable style="width:180px" v-model="serchForm.tags">
              <el-option
                v-for="item in tagsList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <!-- 搜索框 2 -->
        <el-row style="margin-bottom:10px">
          <el-col :span="12">
            城市：
            <el-select placeholder="选择城市" clearable style="width:180px" v-model="serchForm.province" @change="getCityList">
              <el-option
                v-for="(item, index) in provinceList"
                :key="index"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
            <el-select placeholder="选择区县" clearable style="width:180px" v-model="serchForm.city">
              <el-option v-for="(item, index) in cityList" :key="index" :value="item" :label="item"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            关键字：
            <el-input v-model="serchForm.keyword" placeholder="请输入"  style="width:190px"></el-input>
          </el-col>
          <el-col :span="6">
            题目备注：
            <el-input v-model="serchForm.remarks" placeholder="请输入" style="width:190px"></el-input>
          </el-col>
        </el-row>
        <!-- 搜索框 3 -->
        <el-row style="margin-bottom:10px">
          <el-col :span="6">
            企业简称：
            <el-input v-model="serchForm.shortName" placeholder="请输入" style="width:190px"></el-input>
          </el-col>
          <el-col :span="6">
            方向：
            <el-select clearable style="width:180px" v-model="serchForm.direction">
              <el-option
                v-for="(item, index) in directionList"
                :key="index"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            录入人：
            <el-select clearable style="width:180px" v-model="serchForm.creatorID">
              <el-option
                v-for="(item, index) in creatorIDList"
                :key="index"
                :value="item.id"
                :label="item.username"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            二级目录：
            <el-select clearable style="width:180px" v-model="serchForm.catalogID">
              <el-option
                v-for="item in catalogIDList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <!-- 重置 搜索按钮 -->
        <el-row type="flex" justify="end" style="margin-right:60px;margin-bottom:10px">
          <el-col :span="2">
              <input type="reset" value="重置" class="el-button el-button--info el-button--medium">
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="serch">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-card >
        <el-table
          align="center"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          :data="questionsList"
          border
          style="width: 100%">
          <el-table-column
            align="center"
            width="50px"
            type="index"
            label="序号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="number"
            label="试题编号"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="subject"
            label="学科">
          </el-table-column>
          <el-table-column
            align="center"
            prop="questionType"
            :formatter="questionTypeFM"
            label="题型">
          </el-table-column>
          <el-table-column
            align="center"
            prop="question"
            label="题干">
          </el-table-column>
          <el-table-column
            align="center"
            :formatter="dateFilter"
            prop="addDate"
            label="录入时间">
          </el-table-column>
          <el-table-column
            align="center"
            prop="difficulty"
            :formatter="difficultyFM"
            label="难度">
          </el-table-column>
          <el-table-column
            align="center"
            prop="creator"
            label="录入人">
          </el-table-column>
          <el-table-column
            align="center"
            width="220px"
            prop="address"
            label="操作">
            <template slot-scope="obj">
                <el-button type="text">预览</el-button>
                <el-button type="text">修改</el-button>
                <el-button type="text" @click="deletequestion(obj.row)">删除</el-button>
                <el-button type="text">加入精选</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" style="margin-top:20px">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="serchForm.page"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="serchForm.pagesize"
            layout=" prev, pager, next, jumper,sizes "
            :total="total">
          </el-pagination>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>

import Moment from 'moment'// 引入时间处理
import { simple as tagsSimple } from '@/api/hmmm/tags'// 引入标签分类
import { simple as simpleUsers } from '@/api/base/users'// 导入用户简单列表
import { simple as simpleCatalogID } from '@/api/hmmm/directorys'// 导入目录简单列表
import { simple } from '@/api/hmmm/subjects'// 科目分类
import {
  difficulty as difficultyList,
  questionType as questionTypeList,
  direction as directionList
} from '@/api/hmmm/constants'// 难度 类型 方向
import { provinces, citys } from '@/api/hmmm/citys'// 城市
import { list, remove } from '@/api/hmmm/questions'// 基础题库列表

export default {
  name: 'QuestionsList',
  data() {
    return {
      // 下拉菜单列
      subjectIDList: [],
      difficultyList,
      questionTypeList,
      tagsList: [],
      provinceList: [],
      cityList: [],
      directionList,
      creatorIDList: [],
      catalogIDList: [],
      total: 0,
      // 搜索表单各项
      serchForm: {
        page: 1,
        pagesize: 10,
        subjectID: '',
        difficulty: '',
        questionType: '',
        tags: '',
        province: '',
        city: '',
        keyword: '',
        remarks: '',
        shortName: '',
        direction: '',
        creatorID: '',
        catalogID: ''
      },
      // 题库列表数据
      questionsList: []
    }
  },
  methods: {
    // 删除题库
    async deletequestion(row) {
      this.$confirm('您是否要执行删除操作？', '删除')
        await remove(row)
        this.getQuestionsList()
        
    },
    // 处理题型文字
    questionTypeFM(row, column, cellValue, index) {
      return questionTypeList[cellValue - 1].label
    },
    // 处理难度文字
    difficultyFM(row, column, cellValue, index) {
      return difficultyList[cellValue - 1]['label']
    },
    // 搜索按钮
    serch() {
      this.serchForm.page = 1
      this.getQuestionsList()
    },
    // 分页
    handleSizeChange(val) {
        this.serchForm.pagesize = val
        this.getQuestionsList()
      },
      handleCurrentChange(val) {
        this.serchForm.page = val
        this.getQuestionsList()
      },

      // 时间处理
    dateFilter(row, column, cellValue, index) {
      return Moment(cellValue).format('YYYY-MM-DD ')
    },
    // 获取简单目录
    async getCatalogIDList () {
      let res = await simpleCatalogID()
      this.catalogIDList = res.data
    },
    // 获取用户简易列表
    async getusers() {
      let res = await simpleUsers()
      this.creatorIDList = res.data
    },
    // 获取基础题库表格数据
    async getQuestionsList() {
        let res = await list(this.serchForm)
        this.questionsList = res.data.items
        this.total = res.data.counts
    },
    // 获取简易学科信息
    async getSubjectIDList() {
      let res = await simple()
      this.subjectIDList = res.data
    },
    // 获取省份
    getProvinceList() {
      let res = provinces()
      this.provinceList = res
    },
    // 获取城市
    getCityList() {
      // 清空城市信息
      this.serchForm.city = ''
      let ret = citys(this.serchForm.province)
      this.cityList = ret
    },
    // 获取标签
    async getTagsList () {
      let res = await tagsSimple()
      this.tagsList = res.data
    }
  },
  created() {
    this.getSubjectIDList()
    this.getProvinceList()
    this.getQuestionsList()
    this.getTagsList()
    this.getusers()
    this.getCatalogIDList()
  }
}
</script>

<style scoped>
</style>
