import uuidv1 from 'uuid/v1'

const state = {
  // 当前选择的分类，空为全部
  currentCategory: '',

  // ideas 核心数据
  ideas: []
}

const getters = {
  categories(state) {
    return [...new Set(state.ideas.map(idea => idea.category).filter(c => c))]
  },
  ideasByCategory(state) {
    return state.currentCategory
      ? state.ideas.filter(idea => idea.category === state.currentCategory)
      : state.ideas
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
    state.ideas.push(Object.assign({}, {
      id: uuidv1(),
      status: 1,
      category: state.currentCategory,
      parent_id: '',
      due_time: null,
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
  putIdeaIntoCategory(state, payload) {
    const idea = state.ideas.find(i => i.id === payload.id)
    if (idea) {
      idea.category = payload
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
