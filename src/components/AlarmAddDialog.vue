<template>
  <v-dialog :value="show" persistent scrollable max-width="55%">
    <v-card>
      <v-card-title class="headline">
        Add Alarm -&nbsp;
        <span class="subheading">{{msg}}</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form v-model="valid" ref="alarmForm">
          <v-container grid-list-md text-xs-center>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field label="Alarm Number" v-model="alarmNum" readonly />
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Alarm Name" v-model="alarm.name" :rules="[rules.required]" />
              </v-flex>

              <v-flex xs6>
                <v-select v-model="alarm.type"
                          :items="alarmAnalogTypes"
                          label="Alarm Type">
                </v-select>
              </v-flex>
              <v-flex xs6>
                <v-select v-model="alarm.severity"
                          :items="alarmSeverities"
                          label="Alarm Severity"
                          >
                </v-select>
              </v-flex>

              <v-flex xs6>
                <v-text-field type="number" label="Alarm Setpoint" v-model.number="alarm.set"
                              :rules="[rules.required]"/>
              </v-flex>
              <v-flex xs6>
                <v-text-field mask="#####" label="Alarm Delay" v-model.number="alarm.delay" suffix="ms"
                              :rules="[rules.required, rules.delay]"/>
              </v-flex>

              <v-flex xs6>
                <v-text-field label="Alarm Channel" :value="chnlNum" readonly />
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!valid" flat color="primary" @click="$emit('confirm', alarm)">Add</v-btn>
        <v-btn flat color="primary" @click="$emit('cancel')">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AlarmAddDialog',
  props: {
    msg: { type: String, defualt: '' },
    show: { type: Boolean, default: false },
    alarmNum: { type: Number },
    chnlNum: { type: Number }
  },
  computed: {
    ...mapGetters([
      'alarmSeverities',
      'alarmAnalogTypes'
    ])
  },
  methods: {
  },
  mounted () {
  },
  data () {
    return {
      valid: true,
      alarm: {
        name: '',
        type: this.$store.getters.alarmAnalogTypes[0],
        severity: this.$store.getters.alarmSeverities[0],
        set: 0,
        delay: 0
      },
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
  },
  watch: {
    show (newVal, oldVal) {
      if (newVal === true) {
        // reset
        this.alarm.name = ''
        this.alarm.type = this.$store.getters.alarmAnalogTypes[0]
        this.alarm.severity = this.$store.getters.alarmSeverities[0]
        this.alarm.set = 0
        this.alarm.delay = 0
        this.$refs.alarmForm.resetValidation()
      }
    }
  }
}
</script>

<style scoped>
</style>
