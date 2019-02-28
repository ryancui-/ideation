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
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      categories: state => state.main.categories,
      currentCategory: state => state.main.currentCategory
    }),
    sortedCategories() {
      // TODO: 可以根据不同条件来排序分类
      return this.categories
    }
  },
  methods: {
    onCategorySelect(category) {
      this.$store.dispatch('changeCurrentCategory', category)
    }
  }
}
</script>

<style lang="less">
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
    height: 100%;
    overflow: auto;
  }

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
</style>