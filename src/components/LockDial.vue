<template>
  <div class="lock-dial">
    <button v-for="button in buttons" :key="button" class="lock-button rounded shadow" @click="buttonClick(button)">
      {{ button }}
    </button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'LockDial',
  data: () => ({
    buttons: ['7', '8', '9', '4', '5', '6', '1', '2', '3', '*', '0', 'L']
  }),
  computed: {
    ...mapState({
      isLocked: state => state.isLocked,
      serviceMode: state => state.serviceMode
    })
  },
  methods: {
    ...mapActions(['buttonPress', 'lockUnlockSafe']),
    buttonClick (input) {
      this.buttonPress(input)
    }
  }
}
</script>
