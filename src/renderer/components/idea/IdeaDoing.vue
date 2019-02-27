<template>
  <div class="ideation-doing-container">
    <div class="ideation-doing__item"
         v-for="idea in doingIdeas" :key="idea.id"
         @mouseenter="hoverItem = idea"
         @mouseleave="hoverItem = null">
      <div class="ideation-doing__item-content" v-html="formatLineBreak(idea.content)"></div>
      <div class="ideation-doing__item-operation"
           v-show="idea.status === 1 && hoverItem && hoverItem.id === idea.id">
        <i class="fas fa-check-circle"
           title="完成"
           @click="fulfillIdea(idea)"></i>
        <i class="fas fa-trash-alt"
           title="废弃"
           @click="deprecateIdea(idea)"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      hoverItem: null
    }
  },
  computed: {
    ...mapGetters(['doingIdeas'])
  },
  methods: {
    fulfillIdea(idea) {
      this.$store.dispatch('fulfillIdea', { id: idea.id })
    },
    deprecateIdea(idea) {
      this.$store.dispatch('deprecateIdea', { id: idea.id })
    },
    formatLineBreak(text) {
      return text.replace(/\r\n|\n|\r/gm, '<br/>')
    }
  }
}
</script>

<style lang="less">
  .ideation-doing-container {
    flex: 1;
    overflow-y: auto;
    .ideation-doing__item {
      width: 100%;
      padding: 10px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 5px;
      margin: 5px 0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      .ideation-doing__item-content {
        font-size: 13px;
        flex: 1;
      }
      .ideation-doing__item-operation {
        position: absolute;
        right: 20px;
        top: 0;
        bottom: 0;
        width: max-content;
        display: flex;
        align-items: center;
        i.fas {
          color: #666666;
          cursor: pointer;
          font-size: 15px;
          margin-left: 15px;
        }
      }
    }
  }
</style>