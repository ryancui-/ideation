import uuidv1 from 'uuid/v1'

const state = {
  // 当前选择的分类，空为全部
  currentCategory: '',

  // ideas 核心数据
  ideas: [{
    id: 1,
    category: '123123',
    content: 'lahahahha',
    status: 1
  }]
}

const getters = {
  categories(state) {
    return [...new Set(state.ideas.map(idea => idea.category))]
  }
}

const mutations = {
  changeCurrentCategory(state, payload) {
    state.currentCategory = payload
  },
  addIdea(state, payload) {
    // 加上动态生成的 ID
    state.ideas.push(Object.assign({}, payload, { id: uuidv1() }))
  },
  fulfillIdea(state, payload) {
    const idea = state.ideas.find(i => i.id === payload.id)
    if (idea) {
      idea.status = 2
      idea.fulfill_time = Date.now()
    }
  },
  deprecateIdea(state, payload) {
    const idea = state.ideas.find(i => i.id === payload.id)
    if (idea) {
      idea.status = 3
      idea.deprecate_time = Date.now()
    }
  }
}

const actions = {
  changeCurrentCategory({ commit }, payload) {
    commit('changeCurrentCategory', payload)
  },
  addIdea({ commit }, payload) {
    commit('addIdea', payload)
  },
  fulfillIdea({ commit }, payload) {
    commit('fulfillIdea', payload)
  },
  deprecateIdea({ commit }, payload) {
    commit('deprecateIdea', payload)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
