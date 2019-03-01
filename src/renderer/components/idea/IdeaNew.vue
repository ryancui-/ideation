<template>
  <div v-show="editingNewIdea">
    <div class="ideation-new__bg" @click.stop="endEditing"></div>
    <div class="ideation-new__tips" @click.stop v-show="!content">
      记录这一刻的想法
    </div>
    <div class="ideation-new__container">
      <div class="ideation-new__meta-container">
        <div class="ideation-new__meta-item"
             v-for="(meta, index) in metaGroup" :key="meta.name"
             @click.stop="metaGroup.splice(index, 1)">
          {{ formatMetaLabel(meta.name) }}：{{ meta.value }}
        </div>
        <input v-model="meta"
               ref="metaTextarea"
               placeholder="想法的标题"
               @keyup.esc="endEditing"
               @keyup.space="handleMetaConfirm"
               @keyup.enter="handleMetaConfirm"
               @keyup.tab="handleMetaConfirm"
               @keyup.backspace="handleMetaDelete"
               class="ideation-new__meta-text">
      </div>
      <textarea v-model="content"
                ref="contentTextarea"
                @keyup.esc="endEditing"
                class="ideation-new__content-text">
      </textarea>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import bus from '@/bus'

export default {
  data() {
    return {
      editingNewIdea: false,
      meta: '',
      content: '',
      metaGroup: []
    }
  },
  computed: {
    ...mapState({
      currentCategory: state => state.main.currentCategory
    })
  },
  created() {
    bus.$on('ElectronShortcuts_Cmd+Enter', this.handleConfirmIdea)
    bus.$on('ElectronShortcuts_Cmd+N', this.handleNewIdea)
  },
  beforeDestroy() {
    bus.$off('ElectronShortcuts_Cmd+Enter', this.handleConfirmIdea)
    bus.$off('ElectronShortcuts_Cmd+N', this.handleNewIdea)
  },
  methods: {
    startEditing() {
      this.editingNewIdea = true
      this.content = ''
      this.metaGroup = []

      // 默认设置当前分类
      if (this.currentCategory) {
        this.metaGroup.push({
          name: 'category',
          value: this.currentCategory.name
        })
      }

      this.$nextTick(() => {
        this.$refs.metaTextarea.focus()
      })
      this.$emit('changeStatus', true)
    },
    endEditing() {
      this.editingNewIdea = false
      this.content = ''
      this.$emit('changeStatus', false)
    },
    // 新建一个 idea
    createIdea() {
      const content = this.content.trim()
      if (!content) {
        // TODO: 全局提示内容为空
        return
      }

      const idea = {}
      idea.content = content

      this.metaGroup.forEach(group => {
        idea[group.name] = group.value
      })

      this.$store.dispatch('addIdea', idea)
      this.endEditing()
    },
    handleNewIdea() {
      if (!this.editingNewIdea) {
        this.startEditing()
      }
    },
    handleConfirmIdea() {
      if (this.editingNewIdea) {
        this.createIdea()
      }
    },
    handleMetaConfirm() {
      const content = this.meta.trim()
      // TODO: 根据输入的不同进行转换,value存的是实际放到数据库的值
      if (!content) {
        this.$refs.contentTextarea.focus()
      } else if (content.startsWith('@')) {
        const category = this.metaGroup.find(g => g.name === 'category')
        if (category) {
          category.value = content.substring(1)
        } else {
          this.metaGroup.push({
            name: 'category',
            value: content.substring(1)
          })
        }
        this.meta = ''
      } else if (content.startsWith('#')) {
        const due = this.metaGroup.find(g => g.name === 'due_time')
        if (due) {
          due.value = content.substring(1)
        } else {
          this.metaGroup.push({
            name: 'due_time',
            value: content.substring(1)
          })
        }
        this.meta = ''
      } else if (content.startsWith('=')) {
        const priority = this.metaGroup.find(g => g.name === 'priority')
        if (priority) {
          priority.value = content.substring(1)
        } else {
          this.metaGroup.push({
            name: 'priority',
            value: +content.substring(1)
          })
        }
        this.meta = ''
      }
    },
    handleMetaDelete() {
      if (!this.meta && this.metaGroup.length > 0) {
        this.metaGroup.pop()
      }
    },
    formatMetaLabel(key) {
      return {
        category: '分类',
        due_time: '到期日',
        priority: '优先级'
      }[key]
    }
  }
}
</script>

<style lang="less">
  @background-index: 200000;
  @text-top: 50px;
  @text-height: 60%;

  .ideation-new__bg {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: @background-index;
    background-color: #000;
    opacity: 0.3;
  }

  .ideation-new__tips {
    position: fixed;
    top: calc(@text-top + @text-height / 2 - 12px);
    left: 50%;
    transform: translateX(-50%);
    opacity: 0.1;
    color: #000;
    font-size: 24px;
    z-index: @background-index + 2;
    user-select: none;
    cursor: default;
  }

  .ideation-new__container {
    position: fixed;
    top: @text-top;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: @text-height;
    border-radius: 3px;
    z-index: @background-index + 1;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    display: flex;
    flex-direction: column;

    .ideation-new__meta-container {
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      height: 55px;
      padding: 0 15px;
      .ideation-new__meta-item {
        width: max-content;
        border: 1px solid rgba(0, 0, 0, 0.1);
        background-color: #eeeeee;
        display: flex;
        align-items: center;
        font-size: 13px;
        margin-right: 15px;
        border-radius: 3px;
        padding: 5px 10px;
        box-sizing: border-box;
        i:first-child {
          margin-right: 5px;
          color: #999999;
        }
        &:hover {
          background-color: #e3e3e3;
          cursor: pointer;
        }
        i.fa-times {
          margin-left: 5px;
          cursor: pointer;
          color: #999999;
        }
      }
    }

    .ideation-new__meta-text {
      flex: 1;
      display: block;
      resize: none;
      outline: 0;
      border: 0;
      font-size: 14px;
    }

    .ideation-new__content-text {
      flex: 1;
      width: 100%;
      display: block;
      font-size: 14px;
      line-height: 30px;
      resize: none;
      outline: 0;
      border: 0;
      padding: 15px;
      box-sizing: border-box;
    }
  }
</style>