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
  font-weight: bold;
  color: white;
  background: #8B4513;
  border: 2px outset silver;
  cursor: pointer;
  padding: 5px;
  box-shadow: 
    inset -1px -1px 2px rgba(0, 0, 0, 0.3),
    inset 1px 1px 2px rgba(255, 255, 255, 0.8),
    2px 2px 4px rgba(0, 0, 0, 0.3);
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.8);
}

#level-selection:active {
  border: 2px inset silver;
  box-shadow: 
    inset 2px 2px 4px rgba(0, 0, 0, 0.4),
    inset -1px -1px 2px rgba(255, 255, 255, 0.5);
}
</style>
