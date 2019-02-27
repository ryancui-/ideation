import uuidv1 from 'uuid/v1'

const state = {
  // 当前选择的分类，空为全部
  currentCategory: '',

  // ideas 核心数据
  ideas: [],

  // ideas 的后续更新
  updates: {}
}

const getters = {
  categories(state) {
    return [...new Set(state.ideas.map(idea => idea.category).filter(c => c))]
  },
  ideasByCategory(state) {
    const ideas = state.currentCategory
      ? state.ideas.filter(idea => idea.category === state.currentCategory)
      : state.ideas

    // ideas.sort((ideaA, ideaB) => {
    //   return ideaB.create_time - ideaA.create_time
    // })

    return ideas
  },
  doingIdeas(state, getters) {
    return getters.ideasByCategory.filter(idea => idea.status === 1)
  },
  doneIdeas(state, getters) {
    return getters.ideasByCategory.filter(idea => idea.status !== 1)
  }
}

const mutations = {
  changeCurrentCategory(state, payload) {
    state.currentCategory = payload
  },
  addIdea(state, payload) {
    // 加上动态生成的 ID
    state.ideas.unshift(Object.assign({}, {
      id: uuidv1(),
      status: 1,
      category: state.currentCategory,
      due_time: 0,
      priority: 10,
      create_time: Date.now()
    }, payload))
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
  },
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
