<template>
  <div class="ideation-new">
    <div class="ideation-new__hints"
         @click="startEditing">
      <div>点击这儿记录想法</div>
    </div>
    <textarea v-if="editingNewIdea" v-model="content"
              ref="contentTextarea"
              @blur="endEditing"
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
    },
    endEditing() {
      this.editingNewIdea = false
      this.content = ''
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
  .ideation-new {
    position: relative;

    .ideation-new__hints {
      width: 100%;
      padding: 10px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 5px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      margin-bottom: 5px;
      div {
        width: 100%;
        font-size: 14px;
        text-align: center;
        color: #a6a6a6;
      }
    }

    .ideation-new__textarea {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 200000;
      height: 360px;
      font-size: 14px;
      line-height: 22px;
      resize: none;
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 5px;
      outline: 0;
      padding: 10px;
      box-sizing: border-box;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
  }
</style>