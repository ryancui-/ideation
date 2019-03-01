<template>
  <div class="ideation-idea">
    <idea-new></idea-new>

    <div class="ideation-idea__tabs">
      <div class="ideation-idea__tab"
           :class="{ active: this.currentTab === 1 }"
           @click="currentTab = 1">Doing
      </div>
      <div class="ideation-idea__tab"
           :class="{ active: this.currentTab === 2 }"
           @click="currentTab = 2">Done
      </div>
    </div>

    <idea-doing v-show="currentTab === 1"></idea-doing>
    <idea-done v-show="currentTab === 2"></idea-done>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import IdeaDoing from './idea/IdeaDoing'
import IdeaNew from './idea/IdeaNew'
import IdeaDone from './idea/IdeaDone'

export default {
  components: {
    IdeaNew,
    IdeaDoing,
    IdeaDone
  },
  data() {
    return {
      currentTab: 1
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

  .ideation-idea__tabs {
    width: 100%;
    height: 35px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    .ideation-idea__tab {
      width: 90px;
      height: 100%;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-sizing: border-box;
      &.active {
        background-color: #48129e;
        color: #fff;
      }
    }
  }
</style>