<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-row>
        <el-col :span="6">
          学科：
          <el-select style="width:160px" v-model="searchForm.subjectID">
            <el-option v-for="item in subjectIDList" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          难度：
          <el-select style="width:160px" v-model="searchForm.difficulty">
            <el-option v-for="item in difficultyList" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          试题类型：
          <el-select style="width:140px" v-model="searchForm.questionType">
            <el-option v-for="item in questionTypeList" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// 把api数据接口相关方法导入进来
import { simple } from '@/api/hmmm/subjects'
// as给导入的成员设置别名
import {
  difficulty as difficultyList,
  questionType as questionTypeList
} from '@/api/hmmm/constants'
export default {
  name: 'QuestionsList',
  data() {
    return {
      subjectIDList: [],
      // difficultyList: difficultyList,简易成员赋值
      difficultyList,
      // questionTypeList: questionTypeList,简易成员赋值
      questionTypeList,
      searchForm: {
        subjectID: '',
        difficulty: '',
        questionType: ''
      }
    }
  },
  methods: {
    async getSubjectIDList() {
      let rst = await simple()
      // 把获得到的学科信息赋予给 subjectIDList 成员
      this.subjectIDList = rst.data
    }
  },
  created() {
    this.getSubjectIDList()
  }
}
</script>

<style scoped>
</style>
