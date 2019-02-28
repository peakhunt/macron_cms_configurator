<template>
  <v-dialog v-if="alarmNum !== -1" :value="show" persistent scrollable max-width="55%" lazy>
    <v-card>
      <v-card-title class="headline">Alarm Config</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form v-model="valid">
          <v-container grid-list-md text-xs-center>
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field label="Alarm Number" v-model="alarmNum" readonly />
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Alarm Name" v-model="alarmName" :rules="[rules.required]" />
            </v-flex>

            <v-flex xs6>
              <v-select v-if="channelType === 'analog' && alarm.type !== 'sensorFault'"
                        v-model="alarmType"
                        :items="alarmAnalogTypes"
                        label="Alarm Type" />
              <v-text-field v-else v-model="alarmType"
                            label="Alarm Type"
                            readonly />
            </v-flex>
            <v-flex xs6>
              <v-select v-model="alarmSeverity"
                        :items="alarmSeverities"
                        label="Alarm Severity" />
            </v-flex>

            <v-flex xs6>
              <v-text-field v-if="channelType === 'analog' && alarm.type !== 'sensorFault'"
                            label="Alarm Setpoint"
                            type="number"
                            v-model.number="alarmSetPoint"
                            :rules="[rules.required]" />
              <v-select v-else
                        v-model="alarmSetPoint"
                        label="Alarm Setpoint"
                        :items="[true, false]" />

            </v-flex>
            <v-flex xs6>
              <v-text-field mask="#####"
                            label="Alarm Delay"
                            v-model.number="alarmDelay"
                            suffix="ms"
                            :rules="[rules.required, rules.delay]" />
            </v-flex>

            <v-flex xs6>
              <v-text-field label="Alarm Channel" :value="alarm.channel" readonly />
            </v-flex>
          </v-layout>
          </v-container>
        </v-form>
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
  name: 'AlarmConfigDialog',
  props: {
    show: { type: Boolean, default: false },
    alarmNum: { type: Number }
  },
  computed: {
    ...mapGetters([
      'getAlarmByNumber',
      'alarmSeverities',
      'alarmAnalogTypes',
      'getChnlByNumber'
    ]),
    alarm () {
      const a = this.getAlarmByNumber(this.alarmNum)

      if (a === undefined) {
        return {
          name: '',
          severity: 'minor',
          type: 'analog',
          channel: -1,
          delay: 0,
          set: 0
        }
      }
      return a
    },
    alarmName: {
      get () {
        return this.alarm.name
      },
      set (value) {
        this.$store.commit('UPDATE_ALARM_CFG', {
          alarm: this.alarm,
          key: 'name',
          value
        })
      }
    },
    alarmType: {
      get () {
        return this.alarm.type
      },
      set (value) {
        this.$store.commit('UPDATE_ALARM_CFG', {
          alarm: this.alarm,
          key: 'type',
          value
        })
      }
    },
    alarmSeverity: {
      get () {
        return this.alarm.severity
      },
      set (value) {
        this.$store.commit('UPDATE_ALARM_CFG', {
          alarm: this.alarm,
          key: 'severity',
          value
        })
      }
    },
    alarmSetPoint: {
      get () {
        return this.alarm.set
      },
      set (value) {
        this.$store.commit('UPDATE_ALARM_CFG', {
          alarm: this.alarm,
          key: 'set',
          value
        })
      }
    },
    alarmDelay: {
      get () {
        return this.alarm.delay
      },
      set (value) {
        this.$store.commit('UPDATE_ALARM_CFG', {
          alarm: this.alarm,
          key: 'delay',
          value
        })
      }
    },
    channelType () {
      const chnlNum = this.alarm.channel
      const channel = this.getChnlByNumber(chnlNum)

      return channel.type
    }
  },
  methods: {
  },
  data () {
    return {
      valid: true,
      rules: {
        required: value => (value === 0 || !!value) || 'Required.',
        delay: (value) => {
          if (value < 0 || value > 10000) {
            return 'Invalid delay. Must be between 0 and 10000 milliseconds'
          }
          return true
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
