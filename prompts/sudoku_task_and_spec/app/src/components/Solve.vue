<template>
  <button id="solve" @click="handleClick">Solve this puzzle</button>
</template>

<script>
export default {
  name: 'Solve',
  methods: {
    handleClick() {
      this.$emit('solve-requested')
    }
  }
}
</script>

<style scoped>
#solve {
  width: 200px;
  height: 50px;
  background: OliveDrab;
  color: white;
  border: 2px outset #6B8E23;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 
    inset -2px -2px 3px rgba(0, 0, 0, 0.3),
    inset 2px 2px 3px rgba(255, 255, 255, 0.3),
    3px 3px 8px rgba(0, 0, 0, 0.4);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

#solve:hover {
  background: DodgerBlue;
  border: 2px outset #1E90FF;
  box-shadow: 
    inset -2px -2px 3px rgba(0, 0, 0, 0.3),
    inset 2px 2px 3px rgba(255, 255, 255, 0.3),
    3px 3px 8px rgba(0, 0, 0, 0.4);
}

#solve:active {
  border: 2px inset #6B8E23;
  box-shadow: 
    inset 2px 2px 4px rgba(0, 0, 0, 0.4),
    inset -2px -2px 2px rgba(255, 255, 255, 0.2);
}
</style>
