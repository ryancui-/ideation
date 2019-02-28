<template>
  <div class="ideation-done">
    <div class="ideation-done__day-container"
         v-for="group in showIdeasDone" :key="group.day">
      <div class="ideation-done__day-label">{{ group.day }}</div>
      <div class="ideation-done__idea-container"
           v-for="idea in group.data" :key="idea.id">
        <div class="ideation-done__idea-time">
          {{ formatTime(idea.done_time) }}
        </div>
        <div class="ideation-done__idea-content"
             :style="contentStyle(idea)"
             v-html="formatContent(idea.content)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  computed: {
    ...mapGetters(['ideasDoneByCategory']),
    showIdeasDone() {
      return this.ideasDoneByCategory(0, 10)
    }
  },
  methods: {
    formatTime(time) {
      return moment(time).format('HH:mm')
    },
    formatContent(content) {
      return content.replace(/\n/g, '<br />')
    },
    contentStyle(idea) {
      return {
        'text-decoration-line': idea.status === 3 ? 'line-through' : ''
      }
    }
  }
}
</script>

<style lang="less">
  .ideation-done {
    flex: 1;
    overflow-y: auto;
    .ideation-done__day-container {
      .ideation-done__day-label {
        font-size: 15px;
        margin-bottom: 12px;
      }
      .ideation-done__idea-container {
        display: flex;
        align-items: center;
        margin: 5px 0;
        .ideation-done__idea-time {
          flex-basis: max-content;
          font-size: 12px;
          color: #999999;
        }
        .ideation-done__idea-content {
          flex: 1;
          margin-left: 10px;
          font-size: 13px;
          border-radius: 5px;
          padding: 10px;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }
      }
    }
  }
</style>