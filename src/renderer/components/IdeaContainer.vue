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
      <div class="ideation-idea__tab"
           :class="{ active: this.currentTab === 3 }"
           @click="currentTab = 3">Deprecated
      </div>
    </div>

    <idea-doing v-show="currentTab === 1"></idea-doing>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import IdeaDoing from './idea/IdeaDoing'
import IdeaNew from './idea/IdeaNew'

export default {
  components: {
    IdeaNew,
    IdeaDoing
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
    margin-bottom: 10px;
    .ideation-idea__tab {
      width: 90px;
      height: 100%;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      cursor: pointer;
      box-sizing: border-box;
      border-radius: 5px;
      &.active {
        background-color: #48129e;
        color: #fff;
      }
    }
  }
</style>