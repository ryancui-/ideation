<template>
  <div>
    <category-container></category-container>
    <idea-container></idea-container>
  </div>
</template>

<script>
import CategoryContainer from './CategoryContainer'
import IdeaContainer from './IdeaContainer'

export default {
  components: {
    CategoryContainer,
    IdeaContainer
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