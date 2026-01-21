<template>
  <button id="control" @click="handleClick">Brand New Game</button>
</template>

<script>
export default {
  name: 'Control',
  methods: {
    handleClick() {
      this.$emit('new-game')
    }
  }
}
</script>

<style scoped>
#control {
  width: 200px;
  height: 50px;
  background: OliveDrab;
  color: white;
  border: 2px outset #6B8E23;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 1px;
  box-shadow: 
    inset -2px -2px 3px rgba(0, 0, 0, 0.3),
    inset 2px 2px 3px rgba(255, 255, 255, 0.3),
    3px 3px 8px rgba(0, 0, 0, 0.4);
  text-shadow: 
    1px 1px 3px rgba(0, 0, 0, 0.7), 
    0 0 1px rgba(0, 0, 0, 0.5),
    2px 2px 5px rgba(0, 0, 0, 0.8),
    -1px -1px 2px rgba(0, 0, 0, 0.6);
  -webkit-text-stroke: 0.5px rgba(0, 0, 0, 0.3);
}

#control:hover {
  background: DodgerBlue;
  border: 2px outset #1E90FF;
  box-shadow: 
    inset -2px -2px 3px rgba(0, 0, 0, 0.3),
    inset 2px 2px 3px rgba(255, 255, 255, 0.3),
    3px 3px 8px rgba(0, 0, 0, 0.4);
}

#control:active {
  border: 2px inset #6B8E23;
  box-shadow: 
    inset 2px 2px 4px rgba(0, 0, 0, 0.4),
    inset -2px -2px 2px rgba(255, 255, 255, 0.2);
}
</style>
