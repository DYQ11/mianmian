<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-form ref="addFormRef" :model="addForm" label-width="120px">
        <!--:model作用：可以使得el-form针对表单的全部信息进行收集，固定属性-->
        <el-form-item label="学科：">
          <el-select v-model="addForm.subjectID">
            <el-option
              v-for="item in subjectIDList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录：">
          <el-select v-model="addForm.catalogID">
            <el-option
              v-for="item in catalogIDList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业：">
          <el-select v-model="addForm.enterpriseID">
            <el-option v-for="item in enterpriseIDList" :key="item.id" :value="item.id" :label="item.company"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市：">
          <el-select v-model="addForm.province" @change="getCitys">
            <el-option v-for="item in provinces()" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-select v-model="addForm.city">
            <el-option v-for="item in cityList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="方向：">
          <el-select v-model="addForm.direction">
            <el-option v-for="item in directionList" :key="item" :value="item" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题型：">
          <!-- 单选按钮同构label属性定义本身起作用的value值 -->
          <el-radio-group v-model="addForm.questionType">
            <el-radio v-for="item in questionTypeList" :key="item.value" :label="item.value+''">
              {{item.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度：">
          <!-- 单选按钮同构label属性定义本身起作用的value值 -->
          <el-radio-group v-model="addForm.difficulty">
            <el-radio v-for="item in difficultyList" :key="item.value" :label="item.value+''">
              {{item.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="题干：">
          <el-input type="textarea" v-model="addForm.question"></el-input>
        </el-form-item>

        <el-form-item label="选项：" v-if="allShow">

          <template v-if="radioShow">
            <el-radio :label="0" v-model="singleSelect">
              A：<el-input type="text" v-model="addForm.options[0].title" />
            </el-radio><br />
            <el-radio :label="1" v-model="singleSelect">
              B：<el-input type="text" v-model="addForm.options[1].title" />
            </el-radio><br />
            <el-radio :label="2" v-model="singleSelect">
              C：<el-input type="text" v-model="addForm.options[2].title" />
            </el-radio><br />
            <el-radio :label="3" v-model="singleSelect">
              D：<el-input type="text" v-model="addForm.options[3].title" />
            </el-radio>
          </template>

          <template v-else>
            <el-checkbox v-model="addForm.options[0].isRight">
              A：<el-input type="text" v-model="addForm.options[0].title" />
            </el-checkbox><br />
            <el-checkbox v-model="addForm.options[1].isRight">
              B：<el-input type="text" v-model="addForm.options[1].title" />
            </el-checkbox><br />
            <el-checkbox v-model="addForm.options[2].isRight">
              C：<el-input type="text" v-model="addForm.options[2].title" />
            </el-checkbox><br />
            <el-checkbox v-model="addForm.options[3].isRight">
              D：<el-input type="text" v-model="addForm.options[3].title" />
            </el-checkbox><br />     
          </template>

        </el-form-item>
        <el-form-item label="答案：">
          <el-input type="textarea" v-model="addForm.answer"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="addForm.remarks"></el-input>
        </el-form-item>
        <el-form-item label="标签：">
          <el-input type="text" v-model="addForm.tags"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addQuesion()">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { simple as subjectsSimple } from '@/api/hmmm/subjects' // 获取标签信息方法导入
import { simple as directorysSimple } from '@/api/hmmm/directorys' // 获取二级目录信息方法导入
import { provinces, citys } from '@/api/hmmm/citys' // 获取 省份/城市 信息方法导入
import { list as companysList } from '@/api/hmmm/companys' // 获取 企业 信息方法导入
import { add } from '@/api/hmmm/questions' // 添加 试题 方法导入
import { 
  direction as directionList, 
  questionType as questionTypeList,
  difficulty as difficultyList 
  } 
  from '@/api/hmmm/constants' // 常量
export default {
  name: 'QuestionsNew',
  data() {
    return {
      subjectIDList: [], // 学科
      catalogIDList: [], // 二级目录
      cityList: [], // 区县信息
      directionList, // 方向(简易成员复制)
      enterpriseIDList: [], // 企业
      questionTypeList, // 试题类型(题型) ，简易成员赋值
      difficultyList, // 难度 ，简易成员赋值

      singleSelect: '', // 中间成员，用于感知选中的单选选项项目信息(该成员需要转变为isRight的信息)

      // 单选、多选、简答切换
      radioShow: true, // true:单选组显示   false:复选框组显示
      allShow: true, // true:单选或复选框显示一组  false:都不显示
      
      // 添加试题 表单数据对象
      addForm: {
        subjectID: '', // 学科
        catalogID: '', // 二级目录
        enterpriseID: '', // 企业
        city: '', // 区县
        province: '', // 城市
        direction: '', // 方向
        questionType: '1', // 题型(使得radio的label=1的项目被选中)
        difficulty: '1', // 难度(使得radio的label=1的项目被选中)
        question: '', // 题干
        answer: '', // 答案
        remarks: '', // 备注
        tags: '', // 标签
        videoURL: 'http://www.xxx.com', // 解析视频
        // 选项相关
        options: [
          {code: 'A', title: '', img: '', isRight: false},
          {code: 'B', title: '', img: '', isRight: false},
          {code: 'C', title: '', img: '', isRight: false},
          {code: 'D', title: '', img: '', isRight: false}
        ]
      }
    }
  },
  // 监听器
  watch: {
    // 针对 singleSelect成员进行监听
    singleSelect(newval) {
      // 根据newval使得isRight发生变化
      // 1. 使得全部的isRight为false
      for (var i = 0; i < 4; i++) {
        this.addForm.options[i].isRight = false
      }
      // 2. 当前被选中的项目的isRight为true
      this.addForm.options[newval].isRight = true
    },
    // 对题型进行监听
    'addForm.questionType': function(newval) {
      // console.log(newval)
      if (Number(newval) === 1) {
        // newval=1 单选
        this.radioShow = true
        this.allShow = true
      } else if (Number(newval) === 2) {
        // newval=2 多选
        this.radioShow = false
        this.allShow = true
      } else {
        // newval=3 简答
        this.allShow = false
      }
    }
  },
  created() {
    this.getSubjectIDList() // 获得学科
    this.getCatalogIDList() // // 获得 二级目录 信息
    this.getEnterpriseIDList() // 获得 企业
  },
  methods: {
    // 添加试题
    async addQuesion() {
      await add(this.addForm)
      this.$message.success('添加试题成功') // 提示
      this.$router.push('/questions/list') // 页面跳转
    },

    // 获得学科列表信息
    async getSubjectIDList() {
      var rst = await subjectsSimple()
      this.subjectIDList = rst.data
    },
    // 获得 录入人 列表数据
    async getCatalogIDList() {
      var rst = await directorysSimple()
      this.catalogIDList = rst.data
    },
    // 获得 省份 信息，简易成员赋值
    provinces, // provinces:provinces
    // 获得 城市 信息
    // getCitys方法在模板中声明的时候，没有设置()
    // 这个pname形参就代表被选中的省份信息
    getCitys(pname) {
      this.addForm.city = '' // 清除之前选取好的城市
      this.cityList = citys(pname)
    },
    // 获得企业
    async getEnterpriseIDList() {
      var rst = await companysList()
      // console.log(rst)
      this.enterpriseIDList = rst.data.items
    }
  }
}
</script>

<style scoped>
</style>
