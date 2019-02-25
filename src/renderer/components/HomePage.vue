<template>
  <div>
    This is home page. Test for lowdb. Test it?
    <div>
      <button @click="save">Save something.</button>
      <button @click="load">Load something.</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ideas: []
    }
  },
  methods: {
    async save() {
      console.log('save')
      const result = await this.$send('test', {
        content: Math.random()
      })
      console.log('Finish', result)
    },
    load() {
      console.log('load')
    }
  }
}
</script>