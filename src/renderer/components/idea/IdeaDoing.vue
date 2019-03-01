<template>
  <div class="ideation-doing-container">
    <div class="ideation-doing__item"
         v-for="(idea, index) in ideasDoingByCategory" :key="idea.id"
         :class="{
           'high': idea.priority > 50,
           'low': idea.priority < 50
         }"
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
import bus from '@/bus'

export default {
  data() {
    return {
      hoverItem: null,
      editingIdea: null,
      appendContent: ''
    }
  },
  created() {
    bus.$on('ElectronShortcuts_Cmd+Enter', this.handleConfirmUpdate)
  },
  beforeDestroy() {
    bus.$off('ElectronShortcuts_Cmd+Enter', this.handleConfirmUpdate)
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
    },
    handleConfirmUpdate() {
      if (this.editingIdea) {
        this.appendUpdate(this.editingIdea)
      }
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
      border: 1px solid rgba(0, 0, 0, 0.1);
      margin: 15px 0;
      box-sizing: border-box;
      position: relative;
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.05);

      border-left: 3px solid #e1ba45;

      &.high {
        border-left: 3px solid red;
      }

      &.low {
        border-left: 3px solid #1780c2;
      }

      .ideation-doing__item-content {
        width: 100%;
        font-size: @main-font-size;
        padding: 10px;
        box-sizing: border-box;
        position: relative;
        line-height: 30px;
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
            line-height: 30px;
          }
        }
      }

      .ideation-doing__item-textarea {
        height: 100px;
        font-size: @main-font-size;
        line-height: 30px;
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
        background-color: #fff;
        box-shadow: -10px 0 20px rgba(255,255,255,.7);
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