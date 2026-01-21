<template>
  <div class="level-selection-container">
    <label style="font-weight: bold; font-size: 16px;">Pick a Difficulty Level</label>
    <div class="custom-select" @click="toggleDropdown" ref="selectContainer">
      <div id="level-selection" class="select-selected">{{ getDisplayText(selectedLevel) }}</div>
      <div v-if="isOpen" class="select-items">
        <div 
          v-for="option in options" 
          :key="option.value"
          :class="{ 'same-as-selected': option.value === selectedLevel }"
          @click="selectOption(option.value)"
        >
          {{ option.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LevelSelection',
  data() {
    return {
      selectedLevel: 'superhard',
      isOpen: false,
      options: [
        { value: 'easy', text: 'Easy' },
        { value: 'medium', text: 'Medium' },
        { value: 'hard', text: 'Hard' },
        { value: 'superhard', text: 'Super Hard' },
        { value: 'crazyhard', text: 'Crazy Hard' }
      ]
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    selectOption(value) {
      this.selectedLevel = value
      this.isOpen = false
      this.$emit('difficulty-changed', this.selectedLevel)
    },
    getDisplayText(value) {
      const option = this.options.find(opt => opt.value === value)
      return option ? option.text : ''
    },
    handleClickOutside(event) {
      if (this.$refs.selectContainer && !this.$refs.selectContainer.contains(event.target)) {
        this.isOpen = false
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
.level-selection-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.custom-select {
  position: relative;
  width: 150px;
  user-select: none;
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
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

#level-selection:active {
  border: 2px inset silver;
  box-shadow: 
    inset 2px 2px 4px rgba(0, 0, 0, 0.4),
    inset -1px -1px 2px rgba(255, 255, 255, 0.5);
}

.select-items {
  position: absolute;
  background-color: #8B4513;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 99;
  border: 2px outset silver;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-top: 2px;
}

.select-items div {
  color: white;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  padding: 8px 5px;
  cursor: pointer;
  background-color: #8B4513;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.select-items div:last-child {
  border-bottom: none;
}

.select-items div:hover {
  background-color: #A0522D;
}

.select-items div.same-as-selected {
  background-color: #704214;
}
</style>
