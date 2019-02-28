<template>
  <v-card>
    <v-toolbar :color="serialConfigError ? 'error' : 'primary'">
      <v-toolbar-title>Serial {{serialCfg.port}} - {{serialCfg.protocol}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="onPanelMoreLess">
        <v-icon v-if="panel[0] === true">expand_less</v-icon>
        <v-icon v-if="panel[0] === false">expand_more</v-icon>
      </v-btn>
    </v-toolbar>

    <v-expansion-panel v-model="panel" expand>
      <v-expansion-panel-content>
        <v-container fluid grid-list-lg>
          <v-layout row wrap>
            <v-flex xs6>
              <v-text-field label="Device" v-model="serialCfg.device.name" readonly />
            </v-flex>
            <v-flex xs6>
              <v-select v-model.number="baudRate"
                        :items="serialBaudRates"
                        label="Baud rate" />
            </v-flex>
            <v-flex xs6>
              <v-select v-model="parity"
                        :items="serialParities"
                        label="Parity" />
            </v-flex>
            <v-flex xs6>
              <v-select v-model="stopBit"
                        :items="serialStopBits"
                        label="Stop Bit" />
            </v-flex>

            <v-flex xs12>
              <v-select v-model="protocol"
                        :items="serialProtocols"
                        label="Serial Protocol"
                        @change="onSerialProtocolChange"/>
            </v-flex>

            <!-- modbus slave options -->
            <v-flex xs12 v-if="serialCfg.protocol === 'MODBUS RTU Slave'">
              <v-form ref="optSlave">
                <v-text-field v-model.number="mbSlaveAddress"
                              label="Slave Address"
                              mask="####"
                              :rules="[rules.required, rules.addressRange]" />
              </v-form>
            </v-flex>

            <!-- modbus master options -->
            <v-flex xs12 v-if="serialCfg.protocol === 'MODBUS RTU Master'">
              <v-form ref="optMaster">
                <v-layout row wrap>
                  <v-flex xs6>
                    <v-text-field v-model.number="pollTimeout"
                                  label="Poll Timeout"
                                  mask="#####"
                                  :rules="[rules.required, rules.pollTimeout]" />
                  </v-flex>
                  <v-flex xs6 v-if="serialCfg.protocol === 'MODBUS RTU Master'">
                    <v-text-field v-model.number="pollInterval"
                                  label="Poll Interval"
                                  mask="####"
                                  :rules="[rules.required, rules.pollInterval]" />
                  </v-flex>
                </v-layout>
              </v-form>
            </v-flex>

            <v-flex xs 12 v-if="serialCfg.protocol === 'MODBUS RTU Master'">
              <v-layout row wrap>
                <v-flex xs11>
                  <span class="title">Slaves - {{serialCfg.targets.length}}</span>
                </v-flex>
                <v-flex xs1>
                  <v-tooltip bottom>
                    <template #activator="data">
                      <v-icon v-on="data.on" @click="$emit('addSerialSlave', serialCfg)">add</v-icon>
                    </template>
                    <span>Add Slave</span>
                  </v-tooltip>
                </v-flex>

                <v-flex xs12>
                  <v-divider/>
                </v-flex>

                <v-flex xs12 v-if="serialCfg.targets.length !== 0">
                  <v-list>
                    <v-list-tile v-for="(slave, ndx) in serialCfg.targets"
                                :key="ndx"
                                @click="dummyClick">
                      <v-list-tile-content @click="$emit('cfgSerialSlave', { serialCfg, slave })">
                        <v-list-tile-title>
                          <v-layout row wrap>
                            <v-flex xs4> {{slave.type}}</v-flex>
                            <v-flex xs8> Address: {{slave.address}}</v-flex>
                          </v-layout>
                        </v-list-tile-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-menu offset-y>
                          <v-icon slot="activator">more_vert</v-icon>
                          <v-list>
                            <v-list-tile @click="onDelSlave(slave)">
                              <v-list-tile-title>Delete</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile  v-if="ndx != 0" @click="onMoveSlave(slave, true)">
                              <v-list-tile-title>Move Up</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile v-if="ndx != (serialCfg.targets.length - 1)" @click="onMoveSlave(slave, false)">
                              <v-list-tile-title>Move Down</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list>
                </v-flex>
                <v-flex xs12 v-if="serialCfg.targets.length === 0">
                  <span class="error--text">No Slaves Configured</span>
                </v-flex>
              </v-layout>

            </v-flex>

          </v-layout>
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SerialConfigView',
  computed: {
    ...mapGetters([
      'serialProtocols',
      'serialBaudRates',
      'serialParities',
      'serialStopBits',
      'serialPollIntervalRange',
      'serialPollTimeoutRange',
      'modbusAddressRange'
    ]),
    baudRate: {
      get () {
        return this.serialCfg.device.options.baud
      },
      set (value) {
        this.$store.commit('UPDATE_SERIAL_DEVICE_OPTION', {
          serialCfg: this.serialCfg,
          key: 'baud',
          value
        })
      }
    },
    parity: {
      get () {
        return this.serialCfg.device.options.parity
      },
      set (value) {
        this.$store.commit('UPDATE_SERIAL_DEVICE_OPTION', {
          serialCfg: this.serialCfg,
          key: 'parity',
          value
        })
      }
    },
    stopBit: {
      get () {
        return this.serialCfg.device.options.stopb
      },
      set (value) {
        this.$store.commit('UPDATE_SERIAL_DEVICE_OPTION', {
          serialCfg: this.serialCfg,
          key: 'stopb',
          value
        })
      }
    },
    mbSlaveAddress: {
      get () {
        return this.serialCfg.option.address
      },
      set (value) {
        this.$store.commit('UPDATE_SERIAL_PROTOCOL_OPTION', {
          serialCfg: this.serialCfg,
          key: 'address',
          value
        })
      }
    },
    pollTimeout: {
      get () {
        return this.serialCfg.option.pollTimeout
      },
      set (value) {
        this.$store.commit('UPDATE_SERIAL_PROTOCOL_OPTION', {
          serialCfg: this.serialCfg,
          key: 'pollTimeout',
          value
        })
      }
    },
    pollInterval: {
      get () {
        return this.serialCfg.option.pollInterval
      },
      set (value) {
        this.$store.commit('UPDATE_SERIAL_PROTOCOL_OPTION', {
          serialCfg: this.serialCfg,
          key: 'pollInterval',
          value
        })
      }
    },
    serialConfigError () {
      if (this.serialCfg.protocol === 'MODBUS RTU Slave') {
        if (this.serialCfg.option.address === '') {
          return true
        }
        if (this.serialCfg.option.address < this.modbusAddressRange.min ||
            this.serialCfg.option.address > this.modbusAddressRange.max) {
          return true
        }
      } else if (this.serialCfg.protocol === 'MODBUS RTU Master') {
        if (this.serialCfg.option.pollInterval === '') {
          return true
        }
        if (this.serialCfg.option.pollInterval < this.serialPollIntervalRange.min ||
            this.serialCfg.option.pollInterval > this.serialPollIntervalRange.max) {
          return true
        }
        if (this.serialCfg.option.pollTimeout === '') {
          return true
        }
        if (this.serialCfg.option.pollTimeout < this.serialPollTimeoutRange.min ||
            this.serialCfg.option.pollTimeout > this.serialPollTimeoutRange.max) {
          return true
        }

        if (this.serialCfg.targets.length === 0) {
          return true
        }
      }
      return false
    }
  },
  components: {
  },
  props: {
    serialCfg: { type: Object, default: null }
  },
  data () {
    return {
      protocol: '',
      panel: [true],
      rules: {
        required: value => (value === 0 || !!value) || 'Required.',
        addressRange: (value) => {
          if (value < 1 || value > 247) {
            return 'Address should be betwwen 1 and 247'
          }
          return true
        },
        pollInterval: (value) => {
          if (value < this.serialPollIntervalRange.min ||
              value > this.serialPollIntervalRange.max) {
            return `Poll Interval should be betwwen ${this.serialPollIntervalRange.min} and ${this.serialPollIntervalRange.max}`
          }
          return true
        },
        pollTimeout: (value) => {
          if (value < this.serialPollTimeoutRange.min ||
              value > this.serialPollTimeoutRange.max) {
            return `Poll Interval should be betwwen ${this.serialPollTimeoutRange.min} and ${this.serialPollTimeoutRange.max}`
          }
          return true
        }
      }
    }
  },
  methods: {
    dummyClick () {
    },
    onPanelMoreLess () {
      console.log(`let's see how it works`)
      this.panel = [!this.panel[0]]
    },
    onSerialProtocolChange (value) {
      const self = this

      if (self.serialCfg.protocol !== 'none') {
        self.$emit('confirmRequest', {
          msg: 'All the I/O mappings will be deleted. Do you wanna proceed?',
          obj: self,
          confirm: () => {
            self.$store.dispatch('changeSerialProtocol', {
              serialCfg: self.serialCfg,
              protocol: value
            })
          },
          cancel: () => {
            self.protocol = self.serialCfg.protocol
          }
        })
      } else {
        self.$store.dispatch('changeSerialProtocol', {
          serialCfg: self.serialCfg,
          protocol: value
        })
      }
    },
    onDelSlave (slave) {
      const self = this
      self.$emit('confirmRequest', {
        msg: 'All the I/O mappings will be deleted. Do you wanna proceed?',
        obj: self,
        confirm: () => {
          self.$store.dispatch('delModbusSerialSlave', {
            serialCfg: self.serialCfg,
            slave
          })
        },
        cancel: () => {
        }
      })
    },
    onMoveSlave (slave, up) {
      // FIXME
    }
  },
  mounted () {
    this.protocol = this.serialCfg.protocol
    if (this.protocol === 'MODBUS RTU Master') {
      this.$refs.optMaster.validate()
    }
    if (this.protocol === 'MODBUS RTU Slave') {
      this.$refs.optSlave.validate()
    }
  }
}
</script>

<style>
</style>
