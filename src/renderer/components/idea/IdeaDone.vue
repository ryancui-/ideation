<template>
  <div class="ideation-done">
    <div class="ideation-done__btn-panel">
      <input id="showDeprecate" type="checkbox" v-model="showDeprecate">
      <label for="showDeprecate">显示废弃</label>
    </div>
    <div class="ideation-done__container">
      <div class="ideation-done__day-container"
           v-for="group in showIdeasDone" :key="group.day">
        <div class="ideation-done__day-label">{{ group.day }}</div>
        <div class="ideation-done__idea-container"
             v-for="idea in group.data" :key="idea.id"
             v-show="showDeprecate || idea.status === 2">
          <div class="ideation-done__idea-time">
            {{ formatTime(idea.done_time) }}
          </div>
          <div class="ideation-done__idea-content"
               :class="contentClass(idea)"
               v-html="formatContent(idea.content)"></div>
        </div>
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
      showDeprecate: true
    }
  },
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
    contentClass(idea) {
      return {
        'deprecate': idea.status === 3
      }
    }
  }
}
</script>

<style lang="less">
  .ideation-done {
    flex: 1;
    display: flex;
    flex-direction: column;

    .ideation-done__btn-panel {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 5px 0;
      label {
        font-size: 13px;
      }
    }

    .ideation-done__container {
      overflow-y: auto;
      flex: 1;
    }

    .ideation-done__day-container {
      .ideation-done__day-label {
        font-size: 15px;
        margin: 15px 0;
      }
      .ideation-done__idea-container {
        display: flex;
        align-items: center;
        margin: 15px 0;
        .ideation-done__idea-time {
          flex-basis: max-content;
          font-size: 12px;
          color: #999999;
        }
        .ideation-done__idea-content {
          flex: 1;
          margin-left: 10px;
          font-size: 14px;
          padding: 10px;
          border: 1px solid rgba(0, 0, 0, 0.06);
          &.deprecate {
            color: #999999;
          }
        }
      }
    }
  }
</style>