<template>
  <v-card class="elevation-12">
    <v-toolbar :color="tankConfigErr ? 'error' : 'primary'">
      <v-toolbar-title>{{tank.name}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="$emit('moveTank', tank)">
        <v-icon>sort</v-icon>
      </v-btn>
      <v-btn icon @click="$emit('delTank', tank)">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-toolbar>

    <v-expansion-panel expand>
      <v-expansion-panel-content>
        <div slot="header" :class="{ 'error--text' : tank.level.sensors.length === 0 }" >Level</div>
        <TankLevelView :tank="tank"
                       @addAlarmClick="onAddLevelAlarmClick"
                       @chnlClick="onChannelClick"
                       @alarmClick="onAlarmClick"
                       @delAlarmClick="onLevelAlarmDelClick"
                       @addSensorClick="$emit('addSensorClick', { sensorType: 'level', tank })"
                       @delSensorClick="onDelSensorClick" />
      </v-expansion-panel-content>

      <v-expansion-panel-content>
        <div slot="header" :class="{ 'error--text' : tank.pressure.sensors.length === 0 }" >Pressure</div>
        <TankPressureView :tank="tank"
                          @chnlClick="onChannelClick"
                          @addAlarmClick="onAddPressureAlarmClick"
                          @alarmClick="onAlarmClick"
                          @delAlarmClick="onPressureAlarmDelClick"
                          @addSensorClick="$emit('addSensorClick', { sensorType: 'pressure', tank })"
                          @delSensorClick="onDelSensorClick" />
      </v-expansion-panel-content>

      <v-expansion-panel-content>
        <div slot="header" :class="{ 'error--text' : tank.temperature.sensors.length === 0 }" >Temperature</div>
        <TankTemperatureView :tank="tank"
                             @chnlClick="onChannelClick"
                             @addAlarmClick="onAddTemperatureAlarmClick"
                             @alarmClick="onAlarmClick"
                             @delAlarmClick="onTemperatureAlarmDelClick"
                             @addSensorClick="$emit('addSensorClick', { sensorType: 'temperature', tank })"
                             @delSensorClick="onDelSensorClick" />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import TankLevelView from '@/components/TankLevelView'
import TankPressureView from '@/components/TankPressureView'
import TankTemperatureView from '@/components/TankTemperatureView'

export default {
  name: 'TankView',
  components: {
    TankLevelView,
    TankPressureView,
    TankTemperatureView
  },
  props: {
    tank: { type: Object, default: null }
  },
  computed: {
    ...mapGetters([
      'getAlarmByNumber'
    ]),
    tankConfigErr () {
      if (this.tank.level.sensors.length === 0) {
        return true
      }
      if (this.tank.pressure.sensors.length === 0) {
        return true
      }
      if (this.tank.temperature.sensors.length === 0) {
        return true
      }
      return false
    }
  },
  methods: {
    onChannelClick (chnlNum) {
      this.$emit('chnlClick', chnlNum)
    },
    onAddLevelAlarmClick () {
      this.$emit('addAlarmClick', {
        tank: this.tank,
        type: 'level'
      })
    },
    onAddPressureAlarmClick () {
      this.$emit('addAlarmClick', {
        tank: this.tank,
        type: 'pressure'
      })
    },
    onAddTemperatureAlarmClick () {
      this.$emit('addAlarmClick', {
        tank: this.tank,
        type: 'temperature'
      })
    },
    onAlarmClick (alarmNum) {
      this.$emit('alarmClick', alarmNum)
    },
    onLevelAlarmDelClick (alarmNum) {
      this.$emit('delAlarmClick', {
        tank: this.tank,
        type: 'level',
        alarmNum
      })
    },
    onPressureAlarmDelClick (alarmNum) {
      this.$emit('delAlarmClick', {
        tank: this.tank,
        type: 'pressure',
        alarmNum
      })
    },
    onTemperatureAlarmDelClick (alarmNum) {
      this.$emit('delAlarmClick', {
        tank: this.tank,
        type: 'temperature',
        alarmNum
      })
    },
    onDelSensorClick (payload) {
      this.$emit('delSensorClick', {
        tank: this.tank,
        ...payload
      })
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>
</style>
