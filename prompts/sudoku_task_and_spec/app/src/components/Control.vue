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
  border: none;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
}

#control:hover {
  background: DodgerBlue;
}
</style>
