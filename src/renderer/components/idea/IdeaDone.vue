<template>
  <div class="ideation-done">
    <div class="ideation-done__day-container"
         v-for="group in groupedByDay" :key="group.day">
      <div class="ideation-done__day-label">{{ group.day }}</div>
      <div class="ideation-done__idea-container"
           v-for="idea in group.ideas" :key="idea.id">
        <div class="ideation-done__idea-time">
          {{ idea.status === 2 ? formatTime(idea.fulfill_time) : formatTime(idea.deprecate_time) }}
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
  data() {
    return {
      hoverItem: null
    }
  },
  computed: {
    ...mapGetters(['doneIdeas']),
    groupedByDay() {
      const result = []
      this.doneIdeas.forEach(idea => {
        const day = moment(idea.status === 2 ? idea.fulfill_time : idea.deprecate_time).format('YYYY-MM-DD')

        const group = result.find(g => g.day === day)
        if (!group) {
          result.push({
            day,
            ideas: [idea]
          })
        } else {
          group.ideas.push(idea)
        }
      })

      // 对所有东西做一个排序
      result.sort((groupA, groupB) => {
        return new Date(groupB.day).getTime() - new Date(groupA.day).getTime()
      })
      result.forEach(group => {
        group.ideas.sort((ideaA, ideaB) => {
          return (ideaA.status === 2 ? ideaA.fulfill_time : ideaA.deprecate_time) -
            (ideaB.status === 2 ? ideaB.fulfill_time : ideaB.deprecate_time)
        })
      })

      return result
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