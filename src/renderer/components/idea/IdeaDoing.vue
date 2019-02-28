<template>
  <div class="ideation-doing-container">
    <div class="ideation-doing__item"
         v-for="(idea, index) in ideasDoingByCategory" :key="idea.id"
         @mouseenter="hoverItem = idea"
         @mouseleave="hoverItem = null">
      <div class="ideation-doing__item-content">
        <div v-html="formatLineBreak(idea.content)"></div>
        <div class="ideation-doing__item-operation"
             v-show="(!editingIdea || editingIdea.id !== idea.id) && hoverItem && hoverItem.id === idea.id">
          <i class="fas fa-check-circle"
             title="完成"
             @click="fulfillIdea(idea)"></i>
          <i class="fas fa-arrow-down"
             title="添加"
             @click="startEditing(idea, index)"></i>
          <i class="fas fa-trash-alt"
             title="废弃"
             @click="deprecateIdea(idea)"></i>
        </div>
      </div>

      <textarea class="ideation-doing__item-textarea"
                v-if="editingIdea && editingIdea.id === idea.id"
                ref="appendContentTextarea"
                @blur="endEditing"
                @keyup.alt.enter="appendUpdate(idea)"
                @keyup.esc="endEditing"
                v-model="appendContent">
      </textarea>

      <div class="ideation-doing__item-updates" v-if="updates[idea.id]">
        <div class="ideation-doing__item-update"
             v-for="(update, index) in updates[idea.id]"
             :key="index">
          <div class="ideation-doing__item-update-time">
            {{ formatTime(update.create_time) }}
          </div>
          <div class="ideation-doing__item-update-content" v-html="formatLineBreak(update.content)"></div>
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
      hoverItem: null,
      editingIdea: null,
      appendContent: ''
    }
  },
  computed: {
    ...mapState({
      updates: state => state.main.updates
    }),
    ...mapGetters(['ideasDoingByCategory'])
  },
  methods: {
    fulfillIdea(idea) {
      this.$store.dispatch('finishIdea', {
        id: idea.id,
        status: 2
      })
    },
    deprecateIdea(idea) {
      this.$store.dispatch('finishIdea', {
        id: idea.id,
        status: 3
      })
    },
    formatLineBreak(text) {
      return text.replace(/\r\n|\n|\r/gm, '<br/>')
    },
    appendUpdate(idea) {
      this.$store.dispatch('appendUpdate', {
        id: idea.id,
        content: this.appendContent
      })
      this.endEditing()
    },
    startEditing(idea, index) {
      this.appendContent = ''
      this.editingIdea = idea
      this.$nextTick(() => {
        this.$refs.appendContentTextarea[0].focus()
      })
    },
    endEditing() {
      this.editingIdea = null
    },
    formatTime(time) {
      return moment(time).format('MM-DD HH:mm')
    }
  }
}
</script>

<style lang="less">
  @main-font-size: 14px;

  .ideation-doing-container {
    flex: 1;
    overflow-y: auto;
    .ideation-doing__item {
      width: 100%;
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 5px;
      margin: 5px 0;
      box-sizing: border-box;
      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
      position: relative;
      .ideation-doing__item-content {
        width: 100%;
        font-size: @main-font-size;
        padding: 10px;
        box-sizing: border-box;
        position: relative;
      }

      .ideation-doing__item-updates {
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        padding: 10px;
        .ideation-doing__item-update {
          width: 100%;
          .ideation-doing__item-update-time {
            font-size: @main-font-size - 2px;
            color: #999999;
            margin: 3px 0;
          }
          .ideation-doing__item-update-content {
            flex: 1;
            font-size: @main-font-size;
          }
        }
      }

      .ideation-doing__item-textarea {
        height: 100px;
        font-size: @main-font-size;
        line-height: 22px;
        resize: none;
        background-color: #f7f7f7;
        border: 0;
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        outline: 0;
        padding: 10px;
        width: 100%;
        box-sizing: border-box;
        display: block;
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