<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-form>
      <!-- 顶部按钮 -->
      <el-row style="margin-bottom:10px;margin-left:20px" >
        <el-col :span="2">
          <el-button  type="info">
            新增试题
          </el-button>
        </el-col>
        <el-col :span="3" style="margin-left:20px">
          <el-button type="info">
            批量导入
          </el-button>
        </el-col>
      </el-row>
      <!-- 搜索框 1 -->
      <el-row  style="margin-bottom:10px">
          <el-col :span="6" >
          学科：
            <el-select style="width:180px" v-model="serchForm.subjectID" >
              <el-option v-for="item in subjectIDList" :key="item.value" :value="item.value" :label="item.label">
              </el-option>
            </el-select>
        </el-col>
        <el-col :span="6">
          难度：
          <el-select style="width:180px" v-model="serchForm.difficulty" >
              <el-option v-for="item in difficultyList" :key="item.value" :value="item.value" :label="item.label">
              </el-option>
            </el-select>
        </el-col>
        <el-col :span="6">
          试题类型：
          <el-select style="width:180px" v-model="serchForm.questionType" >
              <el-option v-for="item in questionTypeList" :key="item.value" :value="item.value" :label="item.label">
              </el-option>
            </el-select>
        </el-col>
        <el-col :span="6">
          标签：<el-select style="width:180px"></el-select>
        </el-col>
      </el-row>
      <!-- 搜索框 2 -->
      <el-row  style="margin-bottom:10px">
        <el-col :span="12">
          城市：
          <el-select style="width:180px" v-model="serchForm.province" @change="getCityList()">
              <el-option v-for="(item, index) in provinceList" :key="index" :value="item" :label="item">
              </el-option>
          </el-select>
          <el-select style="width:180px" v-model="serchForm.city" >
              <el-option v-for="(item, index) in cityList" :key="index" :value="item" :label="item">
              </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          关键字：<el-select style="width:180px"></el-select>
        </el-col>
        <el-col :span="6">
          题目备注：<el-select style="width:180px"></el-select>
        </el-col>
      </el-row>
      <!-- 搜索框 3 -->
      <el-row  style="margin-bottom:10px">
          <el-col :span="6">
          企业简称：
            <el-select style="width:180px" >
            </el-select>
        </el-col>
        <el-col :span="6">
          方向：
          <el-select style="width:180px" v-model="serchForm.direction" >
              <el-option v-for="(item, index) in directionList" :key="index" :value="item" :label="item">
              </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          录入人：<el-select style="width:180px"></el-select>
        </el-col>
        <el-col :span="6">
          二级目录：<el-select style="width:180px"></el-select>
        </el-col>
      </el-row> 
      <!-- 重置 搜索按钮 -->
      <el-row type="flex" justify="end" style="margin-right:60px"> 
        <el-col :span="2">
          <el-button type="info">重置</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary">搜索</el-button>
        </el-col>
      </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
// 科目分类
import { simple } from '@/api/hmmm/subjects'
// 难度 类型 方向
import { difficulty as difficultyList,
questionType as questionTypeList,
direction as directionList } 
from '@/api/hmmm/constants'  
// 城市
import { provinces, citys } from '@/api/hmmm/citys'
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
        keywordList: [],
        remarksList: [],
        shortNameList: [],
        directionList,
        creatorIDList: [],
        catalogIDList: [],
      // 搜索表单各项
      serchForm: {
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
      }
    }
  },
  methods: {
    // 获取简易学科信息
    async getSubjectIDList () {
      let res = await simple()
      this.subjectIDList = res.data
    },
    // 获取省份和城市
    getProvinceList () {
      let res = provinces()
      this.provinceList = res
      
    },
    // 获取城市
    getCityList () {
      let ret = citys(this.serchForm.province)
      this.cityList = ret
    }

  },
  created () {
    this.getSubjectIDList()
    this.getProvinceList()
  }

}
</script>

<style scoped>
</style>
