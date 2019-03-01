import uuidv1 from 'uuid/v1'
import moment from 'moment'

const state = {
  // 当前选择的分类，null为全部
  currentCategory: null,

  // 分类列表
  categories: [],

  // 当前进行中的 ideas
  ideasDoing: [],

  // 已经完成的 ideas
  ideasDone: [],

  // ideas 的后续更新
  updates: {}
}

const getters = {
  ideasDoingByCategory(state) {
    const result =  state.currentCategory
      ? state.ideasDoing.filter(idea => idea.category_id === state.currentCategory.id)
      : state.ideasDoing.slice()

    result.sort((a, b) => b.priority - a.priority)
    return result
  },
  ideasDoneByCategory: state => (start, end, search) => {
    // TODO: 考虑搜索的功能
    const result = []

    state.ideasDone.slice(start, end).forEach(group => {
      const currentData = state.currentCategory
        ? group.data.filter(idea => idea.category_id === state.currentCategory.id)
        : group.data

      if (currentData.length > 0) {
        result.push({
          day: group.day,
          data: currentData
        })
      }
    })

    return result
  }
}

const mutations = {
  // 改变当前选择分类
  changeCurrentCategory(state, payload) {
    state.currentCategory = payload
  },
  // 增加分类
  addCategory(state, payload) {
    state.categories.unshift(Object.assign({}, {
      id: uuidv1(),
      create_time: Date.now()
    }, payload))
  },
  // 增加doing的idea
  addIdea(state, payload) {
    // 如果 payload.category 有值
    let category_id
    if (payload.category) {
      // 先寻找 category 当前是否已经有值
      const hasCategory = state.categories.find(category => category.name === payload.category)
      if (hasCategory) {
        category_id = hasCategory.id
      } else {
        category_id = uuidv1()
        state.categories.unshift({
          id: category_id,
          name: payload.category,
          create_time: Date.now()
        })
      }
    }

    // 加上动态生成的 ID
    state.ideasDoing.unshift({
      id: uuidv1(),
      category_id,
      content: payload.content,
      due_time: payload.due_time || 0,
      priority: payload.priority || 50,
      create_time: Date.now()
    })
  },
  // 结束一个 idea，将其丢到 ideasDone 队列中
  finishIdea(state, payload) {
    const ideaIndex = state.ideasDoing.findIndex(i => i.id === payload.id)
    if (ideaIndex !== -1) {
      const idea = state.ideasDoing[ideaIndex]
      state.ideasDoing.splice(ideaIndex, 1)

      // 没有数据或最新的 group 日期不对应
      const today = moment().format('YYYY-MM-DD')
      idea.status = payload.status
      idea.done_time = Date.now()

      if (state.ideasDone.length === 0 || state.ideasDone[0].day !== today) {
        state.ideasDone.unshift({
          day: today,
          data: [idea]
        })
      } else {
        state.ideasDone[0].data.unshift(idea)
      }
    }
  },
  // 为 doing 的 idea 添加一个 update
  appendUpdate(state, payload) {
    const idea = state.ideasDoing.find(i => i.id === payload.id)
    if (idea) {
      if (!state.updates[idea.id]) {
        this._vm.$set(state.updates, idea.id, [])
      }

      state.updates[idea.id].unshift({
        content: payload.content,
        create_time: Date.now()
      })
    }
  }
}

const actions = {
  changeCurrentCategory({ commit }, payload) {
    commit('changeCurrentCategory', payload)
  },
  addCategory({ commit }, payload) {
    commit('addCategory', payload)
  },
  addIdea({ commit }, payload) {
    commit('addIdea', payload)
  },
  finishIdea({ commit }, payload) {
    commit('finishIdea', payload)
  },
  appendUpdate({ commit }, payload) {
    commit('appendUpdate', payload)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
