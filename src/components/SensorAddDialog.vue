<template>
  <v-dialog :value="show" persistent max-width="85%">
    <v-card>
      <v-card-title class="headline">
        Add {{sensorType}} sensor
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-form v-model="valid" ref="ioLocForm">
          <v-select v-model="ioLoc.root"
                    :items="ioRoots"
                    label="IO Top Level"
                    :rules="[rules.required]"
                    @change="resetSelection('subRoot')" />

          <v-select v-model="ioLoc.subRoot"
                    :items="ioSubRoots"
                    :item-text="subRootItemText"
                    item-value="port"
                    label="IO Sub Top Level"
                    :rules="[rules.required]"
                    @change="resetSelection('target')" />

          <v-select v-model="ioLoc.target"
                    :items="ioTargets"
                    :item-text="targetItemText"
                    item-value="address"
                    label="IO Target"
                    :rules="[rules.required]"
                    @change="testOut" />

          <v-select v-model="ioLoc.slot"
                    :items="ioSlots"
                    label="IO Slots"
                    :rules="[rules.required]" />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!valid" flat color="primary" @click="$emit('addSensor', { sensor, ioLoc })">Add</v-btn>
        <v-btn flat color="primary" @click="$emit('cancel')">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SensorAddDialog',
  computed: {
    ...mapGetters([
      'io',
      'ioRoots'
    ]),
    ioSubRoots () {
      console.log(`ioSubRoots ${this.ioLoc.root} ${typeof this.ioLoc.root}`)
      if (this.ioLoc.root === '') return []

      const ret = []
      for (let k in this.io[this.ioLoc.root]) {
        ret.push(this.io[this.ioLoc.root][k])
      }
      return ret
    },
    ioTargets () {
      console.log(`ioTargets ${this.ioLoc.subRoot} ${typeof this.ioLoc.subRoot}`)
      if (this.ioLoc.subRoot === '') return []

      return this.io[this.ioLoc.root][this.ioLoc.subRoot].targets
    },
    ioSlots () {
      console.log(`ioSlots ${this.ioLoc.target} ${typeof this.ioLoc.target}`)
      if (this.ioLoc.target === '') return []

      const targets = this.io[this.ioLoc.root][this.ioLoc.subRoot].targets

      for (let ndx = 0; ndx < targets.length; ndx += 1) {
        const target = targets[ndx]

        if (target.address === this.ioLoc.target) {
          const ret = []

          for (let k in target.slot) {
            if (target.slot[k].channel === -1) {
              ret.push(k)
            }
          }
          return ret
        }
      }
      return []
    }
  },
  props: {
    show: { type: Boolean, default: false },
    sensorType: { type: String, default: '' }
  },
  methods: {
    testOut (value) {
      console.log(`testOut ${value} ${this.ioLoc.target}`)
    },
    resetSelection (level) {
      const levelTag = {
        root: 0,
        subRoot: 1,
        target: 2,
        slot: 3
      }
      const l = levelTag[level]

      if (l <= 0) this.ioLoc.root = ''
      if (l <= 1) this.ioLoc.subRoot = ''
      if (l <= 2) this.ioLoc.target = ''
      if (l <= 3) this.ioLoc.slot = ''
    },
    subRootItemText (value) {
      return `${value.port} - ${value.protocol}`
    },
    targetItemText (value) {
      return `${value.type} - ${value.address}`
    }
  },
  data () {
    return {
      valid: true,
      sensor: '',
      ioLoc: {
        root: '',
        subRoot: '',
        target: '',
        slot: ''
      },
      rules: {
        required: value => (value === 0 || !!value) || 'Required.'
      }
    }
  },
  watch: {
    show (newVal) {
      if (newVal) {
        this.resetSelection('root')
        this.$refs.ioLocForm.resetValidation()
        this.sensor = this.sensorType
      }
    }
  }
}
</script>

<style>
</style>
