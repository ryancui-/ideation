<template>
  <div class="ideation-category">
    <div class="ideation-category__header">Category</div>
    <div class="ideation-category__container">
      <div class="ideation-category__item"
           @click="onCategorySelect(null)"
           :class="{ active: !currentCategory }">全部
      </div>
      <div class="ideation-category__item" v-for="category in categories"
           :key="category"
           @click="onCategorySelect(category)"
           :class="{ active: currentCategory && currentCategory === category }">
        {{ category }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState({
      currentCategory: state => state.main.currentCategory
    }),
    ...mapGetters(['categories'])
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
    background-color: #26252c;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .ideation-category__header {
    width: 100%;
    height: 80px;
    padding: 10px;
    font-size: 20px;
    color: #fff;
    box-sizing: border-box;
  }

  .ideation-category__container {
    height: calc(100% - 80px);
    overflow: auto;
  }

  .ideation-category__item {
    display: flex;
    align-items: center;
    padding: 0 10px;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    width: 100%;
    height: 46px;
    font-size: 14px;
    color: #eeeeee;
    cursor: pointer;
    box-sizing: border-box;
    background-color: #383543;
  }

  .ideation-category__item.active {
    background-color: #635d76;
  }
</style>