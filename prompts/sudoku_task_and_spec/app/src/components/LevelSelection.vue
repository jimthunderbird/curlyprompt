<template>
  <div class="level-selection-container">
    <label style="font-weight: bold; font-size: 16px;">Pick a Difficulty Level</label>
    <select id="level-selection" @change="handleChange" v-model="selectedLevel">
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
      <option value="superhard">Super Hard</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'LevelSelection',
  data() {
    return {
      selectedLevel: 'superhard'
    }
  },
  methods: {
    handleChange() {
      this.$emit('difficulty-changed', this.selectedLevel)
    }
  }
}
</script>

<style scoped>
.level-selection-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

#level-selection {
  width: 150px;
  height: 40px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  background: white;
  border: 2px silver solid;
  cursor: pointer;
  padding: 5px;
}
</style>
