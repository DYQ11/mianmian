<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- <el-form ref="searchFormRef" :model="searchForm"></el-form> 
            ref：用于获取当前的el-form元素
            :model: 是el-form的固定属性，用于获取整个form表单的各项表单域信息
      -->
      <el-row>
        <el-col>
          <el-button type="primary" size="mini" @click="$router.push('/questions/new')">
            {{ $t('question.xinzeng') }}
          </el-button>
          <el-button type="danger" size="mini">
            {{ $t('question.pidao') }}
          </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          学科：
          <el-select placeholder="请选择" v-model="searchForm.subjectID" clearable>
            <el-option v-for="item in subjectIDList" :key="item.value" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          难度：
          <el-select placeholder="请选择" v-model="searchForm.difficulty" clearable>
            <el-option v-for="item in difficultyList" :key="item.value" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          试题类型：
          <el-select placeholder="请选择" v-model="searchForm.questionType" style="width:140px;" clearable>
            <el-option v-for="item in questionTypeList" :key="item.value" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="6">标签:
          <el-select placeholder="请选择" v-model="searchForm.tags" style="width:135px" clearable>
            <el-option v-for="item in tagsList" :key="item.value" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">城市：
          <el-select placeholder="城市" @change="getCitys" v-model="searchForm.province" style="width:102px" clearable>
            <el-option v-for="item in provinces()" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-select placeholder="区县" v-model="searchForm.city" style="width:102px" clearable>
            <el-option v-for="item in cityList" :key="item" :label="item" :value="item"></el-option>
          </el-select>

        </el-col>
        <el-col :span="6">关键字：
          <el-input type="text" placeholder="请输入关键字" v-model="searchForm.keyword" style="width:190px"></el-input>
        </el-col>
        <el-col :span="6">题目备注：
          <el-input type="text" placeholder="请输入备注" v-model="searchForm.remarks" style="width:190px"></el-input>
        </el-col>
        <el-col :span="6">企业简称：
          <el-input type="text" placeholder="请输入简称" v-model="searchForm.shortName" style="width:190px"></el-input>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">方向：
          <el-select placeholder="请选择" v-model="searchForm.direction" style="width:135px" clearable>
            <el-option v-for="item in directionList" :key="item" :value="item" :label="item">
            </el-option>  
          </el-select>
        </el-col>
        <el-col :span="6">录入人：
          <el-select placeholder="请选择" v-model="searchForm.creatorID" style="width:135px" clearable>
            <el-option v-for="item in creatorIDList" :key="item.id" :value="item.id" :label="item.username">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">二级目录：
          <el-select placeholder="请选择" v-model="searchForm.catalogID" style="width:135px" clearable>
            <el-option v-for="item in catalogIDList" :key="item.value" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button size="mini">清除</el-button>
          <el-button type="primary" size="mini" @click="getQuestionsList">搜索</el-button>
        </el-col>
      </el-row>

      <!-- 基础题库列表展示 -->
      <el-table :data="questionsList" border>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="试题编号" prop="number"></el-table-column>
        <el-table-column label="学科" prop="subject"></el-table-column>
        <el-table-column label="题型" prop="questionType" :formatter="questionTypeFMT"></el-table-column>
        <el-table-column label="题干" prop="question"></el-table-column>

        <el-table-column label="录入时间">
          <!-- 作用域插槽方式获得需要的列的信息 -->
          <span slot-scope="stData">{{stData.row.addDate | parseTimeByString('{m}-{y}-{d}')}}</span>
        </el-table-column>

        <el-table-column label="难度" prop="difficulty" :formatter="difficultyFMT"></el-table-column>

        <el-table-column label="录入人" prop="creator"></el-table-column>
        <el-table-column label="操作" width="200">
          <!-- 因为当前内容区域有多个html标签需要使用记录信息，所以在外部通过template统一设置slot-scope -->
          <template slot-scope="stData">
            <a href="#">预览</a>
            <a href="#">修改</a>
            <!-- prevent:阻止浏览器默认动作
                 a有默认动作、form有默认动作
            要阻止a标签的默认跳转动作 -->
            <a href="#" @click.prevent="del(stData.row)">删除</a>
            <a href="#">加入精选</a>        
          </template>

        </el-table-column>
      </el-table>
      <!-- 分页效果 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-sizes="[4, 10, 15, 20]"
        :page-size="searchForm.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot">
      </el-pagination>

    </div>
  </div>
</template>

<script>
// 把api数据接口相关方法导入进来
import { simple } from '@/api/hmmm/subjects' // 学科
import { simple as tagsSimple } from '@/api/hmmm/tags' // 标签
import { simple as usersSimple } from '@/api/base/users' // 录入人
import { simple as directorysSimple } from '@/api/hmmm/directorys' // 二级目录
import { provinces, citys } from '@/api/hmmm/citys' // 城市、区县
import { list, remove } from '@/api/hmmm/questions' // 基础题库
// as给导入的成员设置别名
import {
  difficulty as difficultyList, 
  questionType as questionTypeList,
  direction as directionList
  } 
  from '@/api/hmmm/constants' // 常量数据

export default {
  name: 'QuestionsList',
  data() {
    return {
      // 定义各个搜索表单域的数据展示成员
      subjectIDList: [],
      difficultyList, // 简易成员赋值(difficultyList:difficultyList)
      questionTypeList,
      directionList,
      tagsList: [], // 标签列表
      creatorIDList: [], // 录入人
      catalogIDList: [], // 二级目录
      cityList: [], // 区县
      questionsList: [], // 基础题库

      tot: 0, // 总的记录条数

      // 定义搜索数据对象
      searchForm: {
        page: 1, // 默认获取第1页信息
        pagesize: 4, // 每页显示4条记录
        subjectID: '', // 学科
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
  created() {
    // 学科
    this.getSubjectIDList()
    // 标签
    this.getTagsList()
    // 录入人
    this.getCreatorIDList()
    // 二级目录
    this.getCatalogIDList()
    // 基础题库
    this.getQuestionsList()
  },

  methods: {
    // 每页条数变化的回调处理
    handleSizeChange(newsize) {
      this.searchForm.pagesize = newsize
      this.getQuestionsList()
    },
    // 当前页码变化的回调处理
    handleCurrentChange(newpage) {
      this.searchForm.page = newpage
      this.getQuestionsList()
    },

    // 实现题库删除
    del(info) {
      // 确认框提示
      this.$confirm('确认要删除该题库么?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除动作
          remove(info)
          // 刷新数据
          // this:VueComponent --》 Vue
          this.getQuestionsList()
        }).catch(() => {})
    },

    // 针对 试题类型 做信息转换
    // row:代表一行记录信息
    // column: 代表列的信息
    // cellValue: 当前正要处理的域的信息
    questionTypeFMT(row, column, cellValue) {
      // console.log(cellValue)
      return this.questionTypeList[cellValue - 1]['label']
    },
    // 针对 难度 做信息转换
    difficultyFMT(row, column, cellValue) {
      return this.difficultyList[cellValue - 1]['label']
    },
    // 获得 学科 下拉列表数据
    async getSubjectIDList() {
      var rst = await simple()
      // console.log(rst)
      // 把获得到的学科信息赋予给 subjectIDList 成员
      this.subjectIDList = rst.data
    },
    // 获得 标签 列表信息
    async getTagsList() {
      var rst = await tagsSimple()
      this.tagsList = rst.data
    },
    // 录入人 列表
    async getCreatorIDList() {
      var rst = await usersSimple()
      this.creatorIDList = rst.data
    },
    // 二级目录 列表
    async getCatalogIDList() {
      var rst = await directorysSimple()
      this.catalogIDList = rst.data
    },
    // 城市，方法简易成员赋值(provinces:provinces)
    provinces,
    // 根据 城市 获得 区县
    // pname:代表当前选中的"城市"信息
    getCitys(pname) {
      // console.log(pname)
      this.searchForm.city = '' // 清除之前选择的区县
      // 根据pname把对应的区间信息获得到
      this.cityList = citys(pname)
    },
    // 基础题库 列表
    async getQuestionsList() {
      var rst = await list(this.searchForm)
      console.log(rst)
      // 把获得好的题库数据列表 赋予给questionsList
      this.questionsList = rst.data.items
      // 获取中记录条数
      this.tot = rst.data.counts
    }
  }
}
</script>

<style scoped>
.el-row{margin-top:10px;}
.el-table{margin-top:10px;}
</style>
