<template>
  <v-dialog v-if="serialCfg !== null" :value="show" persistent max-width="55%">
    <v-card>
      <v-card-title class="headline">
        Add MODBUS Slave
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field label="Slave Address"
                        v-model.number="board.address"
                        mask="###"
                        :rules="[rules.required, rules.slaveAddress]"
                        />
          <v-select v-model="board.type"
                    :items="serialBoards"/>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!valid" flat color="primary" @click="$emit('confirm', { address: board.address, type: board.type })">Add</v-btn>
        <v-btn flat color="primary" @click="$emit('cancel')">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SerialSlaveAddDialog',
  props: {
    show: { type: Boolean, default: false },
    serialCfg: { type: Object, default: null }
  },
  computed: {
    ...mapGetters([
      'serialBoards',
      'modbusAddressRange'
    ])
  },
  data () {
    return {
      valid: true,
      board: {
        address: '',
        type: ''
      },
      rules: {
        required: value => (value === 0 || !!value) || 'Required.',
        slaveAddress: (value) => {
          if (value < this.modbusAddressRange.min || value > this.modbusAddressRange.max) {
            return 'Invalid MODBUS Address'
          }

          const ret = this.serialCfg.targets.filter(slave => slave.address === value)

          if (ret.length === 0) {
            return true
          }
          return `Address ${value} is already in use`
        }
      }
    }
  },
  watch: {
    show (newValue) {
      if (newValue) {
        this.board.address = ''
        this.board.type = this.serialBoards[0]
      }
    }
  }
}
</script>

<style scoped>
</style>
