<template>
  <div class="lock-screen rounded" :class="[screenOn ? 'lock-screen-on' : 'lock-screen-off']">
    <div class="status">
      <span v-if="isLocked">Locked</span>
      <span v-else>Unlocked</span>
    </div>
    <div class="output">
      {{ input ? input : screenText }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LockScreen',
  computed: {
    ...mapState({
      isLocked: state => state.isLocked,
      screenOn: state => state.screenOn,
      screenText: state => state.screenText,
      input: state => state.input
    })
  }
}
</script>
