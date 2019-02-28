<template>
  <v-dialog v-if="slave !== null && serialCfg != null" :value="show" persistent max-width="85%">
    <v-card>
      <v-card-title class="headline">
        MODBUS Slave Configuration
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field label="Slave Address"
                        v-model.number="slaveAddress"
                        mask="###"
                        :rules="[rules.required, rules.slaveAddress]"
                        />
          <v-text-field label="Board Type"
                        v-model.number="slave.type" readonly />
        </v-form>

        <v-data-table
         :headers="slotHeaders"
         :rows-per-page-items="[20, 10, {text: 'All', value: -1}]"
         :items="slots">
         <template slot="items" slot-scope="props">
           <tr style="cursor: pointer;">
           <td> {{props.item.name}} </td>
           <td> {{props.item.desc}} </td>
           <td @click="onChannelClick(props.item.channel)">
            {{props.item.channel === -1 ? 'Unassigned' : props.item.channel}}
            </td>
           <td @click="onAlarmClick(props.item.alarm)">
            {{props.item.alarm === undefined ? '' : props.item.alarm}}
            </td>
            </tr>
         </template>
        </v-data-table>

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!valid" flat color="primary" @click="$emit('close')">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SerialSlaveConfigDialog',
  props: {
    show: { type: Boolean, default: false },
    slave: { type: Object, default: null },
    serialCfg: { type: Object, default: null }
  },
  computed: {
    ...mapGetters([
      'modbusAddressRange'
    ]),
    slots () {
      const keys = Object.keys(this.slave.slot)
      return keys.map((key) => {
        return {
          name: key,
          ...this.slave.slot[key]
        }
      })
    },
    slaveAddress: {
      get () {
        return this.slave.address
      },
      set (value) {
        this.$store.commit('UPDATE_SERIAL_SLAVE', {
          slave: this.slave,
          key: 'address',
          value
        })
      }
    }
  },
  methods: {
    dummyClick () {
    },
    onChannelClick (chnlNum) {
      if (chnlNum === -1) {
        return
      }

      this.$emit('chnlSelected', chnlNum)
    },
    onAlarmClick (alarmNum) {
      if (alarmNum === undefined || alarmNum === -1) return

      this.$emit('alarmSelected', alarmNum)
    }
  },
  data () {
    return {
      slotHeaders: [
        { text: 'Slot', value: 'name', width: '20%' },
        { text: 'Description', value: 'desc', width: '20%' },
        { text: 'Channel', value: 'channel' },
        { text: 'Alarm', value: 'alarm' }
      ],
      valid: true,
      rules: {
        required: value => (value === 0 || !!value) || 'Required.',
        slaveAddress: (value) => {
          if (value < this.modbusAddressRange.min || value > this.modbusAddressRange.max) {
            return 'Invalid MODBUS Address'
          }

          const self = this

          const ret = self.serialCfg.targets.filter((slave) => {
            if (slave !== self.slave && slave.address === value) {
              return true
            }
            return false
          })

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
    }
  }
}
</script>

<style scoped>
</style>
