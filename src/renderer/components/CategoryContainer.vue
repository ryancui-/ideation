<template>
  <div class="ideation-category">
    <div class="ideation-category__container">
      <div class="ideation-category__item"
           @click="onCategorySelect(null)"
           :class="{ active: !currentCategory }">全部
      </div>
      <div class="ideation-category__item" v-for="category in sortedCategories"
           :key="category.id"
           @click="onCategorySelect(category)"
           :class="{ active: currentCategory && currentCategory.id === category.id }">
        {{ category.name }}
      </div>
    </div>
    <div class="ideation-capacity-info">
      <div>数据大小：{{ fileSizeHuman }}</div>
      <div>共生产了 {{ ideaSize }} 个想法。</div>
      <div></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { remote } from 'electron'
import path from 'path'
import fs from 'fs'
const app = remote.app
const dataFilePath = path.join(app.getPath('userData'), 'vuex.json')

export default {
  data() {
    return {
      intervalId: null,
      fileSize: 0
    }
  },
  computed: {
    ...mapState({
      updates: state => state.main.updates,
      ideasDoing: state => state.main.ideasDoing,
      ideasDone: state => state.main.ideasDone,
      categories: state => state.main.categories,
      currentCategory: state => state.main.currentCategory
    }),
    sortedCategories() {
      // TODO: 可以根据不同条件来排序分类
      return this.categories
    },
    ideaSize() {
      // FIXME: 这里有可能会有性能问题
      let result = this.ideasDoing.length
      for (let i = 0; i < this.ideasDone.length; i++) {
        result += this.ideasDone[i].data.length
      }
      for (let j in this.updates) {
        result += this.updates[j].length
      }
      return result
    },
    fileSizeHuman() {
      const kbSize = this.fileSize / 1024
      if (kbSize < 1024) {
        return `${kbSize.toFixed(2)} KB`
      }
      const mbSize = kbSize / 1024
      if (mbSize < 1024) {
        return `${mbSize.toFixed(2)} MB`
      }
      const gbSize = mbSize / 1024
      return `${gbSize.toFixed(2)} GB`
    }
  },
  created() {
    const fileStat = fs.statSync(dataFilePath)
    this.fileSize = fileStat.size

    // 每 20 秒读取一次文件大小
    this.intervalId = setInterval(() => {
      const fileStat = fs.statSync(dataFilePath)
      this.fileSize = fileStat.size
    }, 1000 * 20)
  },
  beforeDestroy() {
    clearInterval(this.intervalId)
  },
  methods: {
    onCategorySelect(category) {
      this.$store.dispatch('changeCurrentCategory', category)
    }
  }
}
</script>

<style lang="less">
  @info-height: 60px;

  .ideation-category {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 220px;
    background-color: #0b0a0c;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .ideation-category__container {
    height: calc(100% - @info-height);
    overflow: auto;

    .ideation-category__item {
      display: flex;
      align-items: center;
      padding-left: 20px;
      width: 100%;
      height: 56px;
      font-size: 15px;
      color: #eeeeee;
      cursor: pointer;
      box-sizing: border-box;
      background-color: #0b0a0c;
    }

    .ideation-category__item.active {
      background-color: #322165;
    }
  }

  .ideation-capacity-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 20px;
    height: @info-height;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #eeeeee;
    font-size: 10px;
    opacity: 0;
    transition: opacity 0.3s ease-out;
    &:hover {
      opacity: 1;
    }
  }
</style>