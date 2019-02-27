<template>
  <div class="ideation-category">
    <div class="ideation-category__container">
      <div class="ideation-category__item"
           @click="onCategorySelect('')"
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