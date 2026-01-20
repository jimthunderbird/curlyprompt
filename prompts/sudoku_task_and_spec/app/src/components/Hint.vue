<template>
  <button id="hint" @click="handleClick">Hint</button>
</template>

<script>
export default {
  name: 'Hint',
  methods: {
    handleClick() {
      this.$emit('hint-requested')
    }
  }
}
</script>

<style scoped>
#hint {
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

#hint:hover {
  background: DodgerBlue;
}
</style>
