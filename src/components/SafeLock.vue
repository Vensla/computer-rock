<template>
  <div class="safe-lock rounded shadow">
    <LockScreen/>
    <LockDial/>
    <div class="serial-number">
      S/N: {{ sn }}
    </div>
  </div>
</template>

<script>
import LockScreen from '@/components/LockScreen'
import LockDial from '@/components/LockDial'
import { mapState } from 'vuex'

export default {
  name: 'SafeLock',
  computed: {
    ...mapState({
      sn: state => state.sn
    })
  },
  components: {
    LockScreen,
    LockDial
  }
}
</script>
