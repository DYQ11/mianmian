<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-row>
        <el-col :span="6">
          学科：
          <el-select style="width:160px" v-model="searchForm.subjectID">
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
          <el-select style="width:160px" v-model="searchForm.difficulty">
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
          <el-select style="width:140px" v-model="searchForm.questionType">
            <el-option
              v-for="item in questionTypeList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          标签:
          <el-select placeholder="请选择" v-model="searchForm.tags">
            <el-option
              v-for="item in tagsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin:10px 0">
        <el-col :span="6">
          城市：
          <el-select
            placeholder="请选择"
            v-model="searchForm.province"
            style="width:90px"
            @change="getCitys"
          >
            <!-- v-for遍历，既可以遍历data成员，也可以遍历methods方法,遍历methods的时候，要给方法后边设置() 括号 -->
            <el-option v-for="item in provinces()" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-select placeholder="请选择" v-model="searchForm.city" style="width:90px">
            <el-option v-for="item in cityList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          关键字：
          <el-input
            type="text"
            placeholder="请输入关键字"
            v-model="searchForm.keyword"
            style="width:160px"
          ></el-input>
        </el-col>
        <el-col :span="6">
          题目备注：
          <el-input
            type="text"
            placeholder="请输入备注"
            v-model="searchForm.remarks"
            style="width:160px"
          ></el-input>
        </el-col>
        <el-col :span="6">
          企业简称：
          <el-input
            type="text"
            placeholder="请输入简称"
            v-model="searchForm.shortName"
            style="width:160px"
          ></el-input>
        </el-col>
      </el-row>

      <el-row :gutter="10" style="margin:10px 0">
        <el-col :span="6">
          方向：
          <el-select placeholder="请选择" v-model="searchForm.direction" style="width:135px">
            <el-option v-for="item in directionList" :key="item" :value="item" :label="item"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          录入人：
          <el-select placeholder="请选择" v-model="searchForm.creatorID" style="width:135px">
            <el-option
              v-for="item in creatorIDList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          二级目录：
          <el-select placeholder="请选择" v-model="searchForm.catalogID" style="width:135px">
            <el-option
              v-for="item in catalogIDList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button size="mini">清除</el-button>
          <el-button type="primary" size="mini" @click="getQuestionList()">搜索</el-button>
        </el-col>
      </el-row>
      <el-table :data="questionsList" style="width:100%">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="试题编号" prop="number"></el-table-column>
        <el-table-column label="学科" prop="subject"></el-table-column>
        <el-table-column label="题型" prop="questionType" :formatter="questionTypeFMT"></el-table-column>
        <el-table-column label="题干" prop="question"></el-table-column>
        <el-table-column label="录入时间" prop="addDate" width="170">
          <span slot-scope="stData">{{stData.row.addDate | parseTimeByString}}</span>
        </el-table-column>
        <el-table-column label="难度" prop="difficulty" :formatter="difficultyFMT"></el-table-column>
        <el-table-column label="录入人" prop="creator"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="stData">
            <a href="#">预览</a>
            <a href="#">修改</a>
            <a href="#" @click.prevent="del(stData.row)">删除</a>
            <a href="#">加入精选</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// 基础题库相关api导入
import { list, remove } from '@/api/hmmm/questions'
// 获取 省份/城市 信息方法导入
import { provinces, citys } from '@/api/hmmm/citys'
// 获取二级目录信息方法导入
import { simple as directorysSimple } from '@/api/hmmm/directorys'
// 获取录入人信息方法导入
import { simple as usersSimple } from '@/api/base/users'
// 获取标签信息方法导入
import { simple as tagsSimple } from '@/api/hmmm/tags'
// 把api数据接口相关方法导入进来
import { simple } from '@/api/hmmm/subjects'
// as给导入的成员设置别名
import {
  direction as directionList,
  difficulty as difficultyList,
  questionType as questionTypeList
} from '@/api/hmmm/constants'
export default {
  name: 'QuestionsList',
  data() {
    return {
      questionsList: [], // 基础题库列表信息
      cityList: [], // 区县信息
      directionList, // 方向(简易成员复制)
      catalogIDList: [], // 二级目录
      creatorIDList: [], // 录入人
      tagsList: [], // 标签
      subjectIDList: [],
      // difficultyList: difficultyList,简易成员赋值
      difficultyList,
      // questionTypeList: questionTypeList,简易成员赋值
      questionTypeList,
      searchForm: {
        subjectID: '', // 科学
        difficulty: '', // 难度
        questionType: '', // 试题类型
        tags: '', // 标签
        province: '', // 省份
        city: '', // 城市
        keyword: '', // 关键字
        remarks: '', // 备注
        shortname: '', // 企业简称
        direction: '', // 方向
        creatorID: '', // 录入人
        catalogID: '' // 二级目录
      }
    }
  },
  methods: {
     // 删除题库
    del(info) {
      // 确认框
      this.$confirm('确认要删除该题库么?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          remove(info) // 删除数据
          this.getQuestionList() // 更新数据
        }).catch(() => {
        })
    },
    // 难度数字转汉字
    difficultyFMT(row, column, cellValue) {
      return this.difficultyList[cellValue - 1]['label']
    },
    // 题型数字转汉字
    questionTypeFMT(row, column, cellValue) {
      return this.questionTypeList[cellValue - 1]['label']
    },
    // 获得基础题库列表信息
    async getQuestionsList() {
      var rst = await list(this.searchForm)
      // 把获得好的题库列表信息赋予给 questionList 成员
      this.questionsList = rst.data.items
    },
    // 获得区县，getCitys方法在模板中声明的时候，没有设置()
    // 这个pname形参就代表被选中的省份信息
    getCitys(pname) {
      this.searchForm.city = '' // 清除之前选取好的城市
      this.cityList = citys(pname)
    },
    // 获得城市信息，因为是个函数，所以必须在methods里进行简易成员赋值
    provinces, // provinces:provinces
    // 获得 录入人 列表数据
    async getCatalogIDList() {
      var rst = await directorysSimple()
      this.catalogIDList = rst.data
    },
    // 获得 录入人 列表数据
    async getCreatorIDList() {
      var rst = await usersSimple()
      this.creatorIDList = rst.data
    },
    async getTagsList() {
      var rst = await tagsSimple() // Promise对象 变为 dt了
      this.tagsList = rst.data
    },
    async getSubjectIDList() {
      let rst = await simple()
      // 把获得到的学科信息赋予给 subjectIDList 成员
      this.subjectIDList = rst.data
    }
  },
  created() {
    this.getSubjectIDList()
    this.getTagsList()
    this.getCreatorIDList()
    this.getCatalogIDList()
    this.getQuestionsList()
  }
}
</script>

<style scoped>
/* 使用elementui组件库的过程中，各个组件最终要变为具体的html标签,有一个特点：组件的名称,会变为 相关html标签的class属性值 */
/* 例如：
el-form  --> <form class="el-form">
el-input --> <div class="el-input">
el-row   --> <div class="el-row">
el-table --> <div class="el-table"> */
.el-row {
  margin-top: 10px;
}
.el-table {
  margin-top: 10px;
}
</style>
