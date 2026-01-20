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
  border: none;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
}

#solve:hover {
  background: DodgerBlue;
}
</style>
