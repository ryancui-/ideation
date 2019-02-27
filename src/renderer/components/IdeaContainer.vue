<template>
  <div class="ideation-idea">
    <div class="ideation-idea__item ideation-idea__item-add"
         v-if="!editingNewIdea"
         @click="startEditing">
      <div class="ideation-idea__item-add-label">点击这儿记录想法</div>
    </div>
    <textarea v-if="editingNewIdea" v-model="content"
              ref="contentTextarea"
              @blur="endEditing"
              @keyup.alt.enter="createIdea"
              class="ideation-idea__item-add-textarea"></textarea>

    <div class="ideation-idea__tabs">
      <div class="ideation-idea__tab"
           :class="{ active: this.currentTab === 1 }"
           @click="currentTab = 1">还在搞
      </div>
      <div class="ideation-idea__tab"
           :class="{ active: this.currentTab === 2 }"
           @click="currentTab = 2">搞完了
      </div>
    </div>

    <div class="ideation-idea__working-container">
      <div class="ideation-idea__item"
           v-for="idea in filteredIdeas" :key="idea.id"
           @mouseenter="hoverItem = idea"
           @mouseleave="hoverItem = null">
        <div class="ideation-idea__item-content" v-html="formatLineBreak(idea.content)"></div>
        <div class="ideation-idea__item-operation"
             v-show="idea.status === 1 && hoverItem && hoverItem.id === idea.id">
          <i class="fas fa-check-circle" @click="fulfillIdea(idea)"></i>
          <i class="fas fa-trash-alt" @click="deprecateIdea(idea)"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      editingNewIdea: false,
      currentTab: 1,
      content: '',
      hoverItem: null
    }
  },
  computed: {
    ...mapGetters({
      ideas: 'ideasByCategory'
    }),
    filteredIdeas() {
      switch (this.currentTab) {
        case 1:
          return this.ideas.filter(idea => idea.status === 1)
        case 2:
          return this.ideas.filter(idea => idea.status !== 1)
      }
    }
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
      const lines = this.content.split('\n')
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
        idea.content = this.content
      }

      this.$store.dispatch('addIdea', idea)
      this.endEditing()
    },
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
  .ideation-idea {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 220px;
    right: 0;
    padding: 20px 10px;
    display: flex;
    flex-direction: column;
  }

  .ideation-idea__item {
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
    .ideation-idea__item-content {
      font-size: 13px;
      flex: 1;
    }
    .ideation-idea__item-operation {
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

  .ideation-idea__item-add {
    cursor: pointer;
  }

  .ideation-idea__item-add-label {
    width: 100%;
    font-size: 14px;
    text-align: center;
    color: #a6a6a6;
  }

  .ideation-idea__item-add-container {
    width: 100%;
  }

  .ideation-idea__item-add-textarea {
    width: 100%;
    height: 120px;
    font-size: 14px;
    line-height: 22px;
    resize: none;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 5px;
    outline: 0;
    padding: 10px;
    box-sizing: border-box;
    margin: 5px 0;
  }

  .ideation-idea__tabs {
    width: 100%;
    height: 35px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .ideation-idea__tab {
      width: 90px;
      height: 100%;
      font-size: 14px;
      display: flex;
      align-items: center;
      margin-right: 10px;
      cursor: pointer;
      padding-left: 10px;
      box-sizing: border-box;
      &.active {
        background-color: #4941e3;
        color: #fff;
      }
    }
  }

  .ideation-idea__working-container {
    flex: 1;
    overflow-y: auto;
  }
</style>