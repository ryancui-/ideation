<template>
  <div v-show="editingNewIdea">
    <div class="ideation-new__bg" @click.stop="endEditing"></div>
    <div class="ideation-new__tips" @click.stop v-show="!content">
      记录这一刻的想法
    </div>
    <textarea v-model="content"
              ref="contentTextarea"
              @keyup.esc="endEditing"
              class="ideation-new__textarea"></textarea>
  </div>
</template>

<script>
import bus from '@/bus'

export default {
  data() {
    return {
      editingNewIdea: false,
      content: ''
    }
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
      this.$nextTick(() => {
        this.$refs.contentTextarea.focus()
      })
      this.$emit('changeStatus', true)
    },
    endEditing() {
      this.editingNewIdea = false
      this.content = ''
      this.$emit('changeStatus', false)
    },
    createIdea() {
      // 如果第一行是 # 开头，将后面的内容变成 category
      const content = this.content.trim()
      if (!content) {
        return
      }

      const lines = content.split('\n')
      const idea = {}
      if (lines[0] && lines[0].trim().startsWith('#')) {
        idea.category = lines[0].trim().substring(1)

        // 寻找真正 content 的开始行
        let contentStart = 1
        while (contentStart < lines.length && !lines[contentStart].trim()) {
          contentStart++
        }

        if (contentStart === lines.length) {
          this.$notify({
            type: 'success',
            message: '内容为空'
          })
          return
        }

        idea.content = lines.slice(contentStart).join('\n')
      } else {
        idea.content = content
      }

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
  }

  .ideation-new__textarea {
    position: fixed;
    top: @text-top;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: @text-height;
    font-size: 14px;
    line-height: 30px;
    border-radius: 10px;
    z-index: @background-index + 1;
    resize: none;
    border: 1px solid rgba(0, 0, 0, 0.06);
    outline: 0;
    padding: 20px 15px;
    box-sizing: border-box;
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.1);
    opacity: 1;
    background-color: #fff;
  }
</style>