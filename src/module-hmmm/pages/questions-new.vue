<template>
  <div class="dashboard-container">
    <div class="app-container">题库添加</div>
    <el-button type="primary" @click="addQuestion()">提交</el-button>
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
          <el-option
            v-for="item in enterpriseIDList"
            :key="item.id"
            :label="item.company"
            :value="item.id"
          ></el-option>
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
        <el-radio-group v-model="addForm.questionType">
          <el-radio
            v-for="item in questionTypeList"
            :key="item.value"
            :label="item.value+''"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="难度：">
        <el-radio-group v-model="addForm.difficulty">
          <el-radio
            v-for="item in difficultyList"
            :key="item.value"
            :label="item.value+''"
          >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="题干：">
        <el-input type="textarea" v-model="addForm.question"></el-input>
      </el-form-item>
      <el-input label="选项：" v-if="allShow">
        <template v-if="radioShow">
          <el-radio v-model="singleSelect" :label="0">
            A:
            <el-input type="text" v-model="addForm.options[0]['title']"></el-input>
          </el-radio>
          <br />
          <el-radio v-model="singleSelect" :label="1">
            B:
            <el-input type="text" v-model="addForm.options[1]['title']"></el-input>
          </el-radio>
          <br />
          <el-radio v-model="singleSelect" :label="2">
            C:
            <el-input type="text" v-model="addForm.options[2]['title']"></el-input>
          </el-radio>
          <br />
          <el-radio v-model="singleSelect" :label="3">
            D:
            <el-input type="text" v-model="addForm.options[3]['title']"></el-input>
          </el-radio>
        </template>
        <template v-else>
          <el-checkbox v-model="addForm.options[0]['isRight']">
            A:
            <el-input type="text" v-model="addForm.options[0]['title']"></el-input>
          </el-checkbox>
          <br />
          <el-checkbox v-model="addForm.options[1]['isRight']">
            B:
            <el-input type="text" v-model="addForm.options[1]['title']"></el-input>
          </el-checkbox>
          <br />
          <el-checkbox v-model="addForm.options[2]['isRight']">
            C:
            <el-input type="text" v-model="addForm.options[2]['title']"></el-input>
          </el-checkbox>
          <br />
          <el-checkbox v-model="addForm.options[3]['isRight']">
            D:
            <el-input type="text" v-model="addForm.options[3]['title']"></el-input>
          </el-checkbox>
        </template>
      </el-input>
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
        <el-button type="primary">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { add } from '@/api/hmmm/questions'
// 企业
import { list as companysList } from '@/api/hmmm/companys'
// 获取 省份/城市 信息方法导入
import { provinces, citys } from '@/api/hmmm/citys'
// 获取方向导入
import {
  direction as directionList,
  questionType as questionTypeList,
  difficulty as difficultyList
} from '@/api/hmmm/constants'
// 获取二级目录信息方法导入
import { simple as directorysSimple } from '@/api/hmmm/directorys'
// 获取标签信息方法导入
import { simple as subjectsSimple } from '@/api/hmmm/subjects'
export default {
  name: 'QuestionsNew',
  data() {
    return {
      radioShow: true, // 默认显示单选项目
      allShow: true, // 单选或多选默认显示一个
      // 感知被被选中的项目的值，是中间成员，需要通过watch转变为isRight
      singleSelect: '',
      difficultyList, // 难度 简易成员赋值
      questionTypeList, // 题型 简易成员赋值
      enterpriseIDList: [], // 企业
      cityList: [], // 区县信息
      directionList, // 方向(简易成员复制)
      catalogIDList: [], // 二级目录
      subjectIDList: [], // 学科
      // 添加试题 表单数据对象
      addForm: {
        // 选项表单数据对象部分
        options: [
          { code: 'A', title: '', img: '', isRight: false },
          { code: 'B', title: '', img: '', isRight: false },
          { code: 'C', title: '', img: '', isRight: false },
          { code: 'D', title: '', img: '', isRight: false }
        ],
        question: '', // 题干
        answer: '', // 答案
        remarks: '', // 备注
        tags: '', // 标签
        videoURL: 'http://www.xxx.com', // 解析视频
        difficulty: '1', // 默认 难度 第一个项目被选中(要求是字符串)
        questionType: '1', // 默认“单选” 题型 项目被选中(要求是字符串)
        subjectID: '', // 学科
        catalogID: '', // 二级目录
        enterpriseID: '', // 企业
        city: '', // 区县
        province: '', // 城市
        direction: '' // 方向
      }
    }
  },
  methods: {
    // 根据选中的题型，判断单选、多选表单域组是否显示
    controlShow(type) {
      if (type === '1') {
        // 单选
        this.allShow = true
        this.radioShow = true
      } else if (type === '2') {
        // 多选
        this.allShow = true
        this.radioShow = false
      } else {
        // 简答(没有单选或多选了)
        this.allShow = false
      }
    },
    // 收集表单数据，完成添加操作
    async addQuestion() {
      // 注意：要使得数据完成添加后，再做列表页面重定向操作
      await add(this.addForm) // 添加数据
      this.$message.success('添加数据成功')
      this.$router.push('/questions/list') // 路由重定向跳转
    },
    // 获得 企业 列表信息
    async getEnterpriseIDList() {
      var rst = await companysList()
      this.enterpriseIDList = rst.data.items
    },
    // 获得 城市 信息
    // getCitys方法在模板中声明的时候，没有设置()
    // 这个pname形参就代表被选中的省份信息
    getCitys(pname) {
      this.addForm.city = '' // 清除之前选取好的城市
      this.cityList = citys(pname)
    },
    // 获得 省份 信息，简易成员赋值
    provinces, // provinces:provinces
    // 获得 录入人 列表数据
    async getCatalogIDList() {
      var rst = await directorysSimple()
      this.catalogIDList = rst.data
    },
    // 获得学科列表信息
    async getSubjectIDList() {
      var rst = await subjectsSimple()
      this.subjectIDList = rst.data
    }
  },
  created() {
    this.getEnterpriseIDList() // 获得企业
    this.getSubjectIDList() // 获得学科
    this.getCatalogIDList() // 获得 二级目录 信息
  },
  // watch监听器
  watch: {
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
  }
}
</script>

<style scoped>
</style>
