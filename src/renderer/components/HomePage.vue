<template>
  <div>
    <div :class="{ 'blur': opening }">
      <category-container></category-container>
      <idea-container></idea-container>
    </div>
    <idea-new @changeStatus="handleStatusChange"></idea-new>
  </div>
</template>

<script>
import CategoryContainer from './CategoryContainer'
import IdeaContainer from './IdeaContainer'
import IdeaNew from './idea/IdeaNew'

export default {
  components: {
    CategoryContainer,
    IdeaContainer,
    IdeaNew
  },
  data() {
    return {
      opening: false
    }
  },
  methods: {
    handleStatusChange(status) {
      this.opening = status
    }
  }
}
</script>

<style>
  html, body {
    padding: 0;
    margin: 0;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
</style>