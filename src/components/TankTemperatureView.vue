<template>
  <v-card>
    <v-list two-line>
      <!-- temperature channel -->
      <v-list-tile @click="onClickDummy">
        <v-list-tile-action>
          C
        </v-list-tile-action>
        <v-list-tile-content @click="$emit('chnlClick', tank.temperature.channel)">
          <v-list-tile-title>{{tank.temperature.channel}} - {{getChnlByNumber(tank.temperature.channel).name}}</v-list-tile-title>
          <v-list-tile-sub-title>
            Channel
          </v-list-tile-sub-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <v-tooltip bottom>
            <template #activator="data">
              <v-icon v-on="data.on" @click="$emit('addSensorClick')">add</v-icon>
            </template>
            <span>Add Temperature Sensor</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template #activator="data">
              <v-icon v-on="data.on" @click="$emit('addAlarmClick')">add_circle</v-icon>
            </template>
            <span>Add Temperature Alarm</span>
          </v-tooltip>
        </v-list-tile-action>
      </v-list-tile>

      <!-- temperature sensors -->
      <v-list-tile v-for="(channel,ndx) in tank.temperature.sensors" :key="'s' + ndx" @click="onClickDummy">
        <v-list-tile-action>{{ndx === 0 ? 'S' : ''}}</v-list-tile-action>
        <v-list-tile-content @click="$emit('chnlClick', channel)">
          <v-list-tile-title>sensor - {{getChnlByNumber(channel).name}}</v-list-tile-title>
          <v-list-tile-sub-title>
            {{channel}} - {{ioLOCStr(getChnlByNumber(channel).ioMap)}}
          </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-tooltip bottom>
            <template #activator="data">
              <v-icon v-on="data.on" @click="$emit('delSensorClick', { sensorType: 'temperature', channel })">remove</v-icon>
            </template>
            <span>Delete Sensor</span>
          </v-tooltip>
        </v-list-tile-action>
      </v-list-tile>

      <v-list-tile v-if="tank.temperature.sensors.length === 0">
        <v-list-tile-action>S</v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title class="error--text">No temperature sensor is assigned</v-list-tile-title>
          <v-list-tile-sub-title>
          </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
        </v-list-tile-action>
      </v-list-tile>

      <!-- temperature alarms -->
      <v-list-tile v-for="(alarm,ndx) in tank.temperature.alarms" :key="'a' + ndx" @click="onClickDummy">
        <v-list-tile-action>{{ndx === 0 ? 'A' : ''}}</v-list-tile-action>
        <v-list-tile-content @click="$emit('alarmClick', alarm)">
          <v-list-tile-title>alarm - {{getAlarmByNumber(alarm).name}}</v-list-tile-title>
          <v-list-tile-sub-title>
            {{alarm}}
            /
            {{getAlarmByNumber(alarm).type}}
            /
            {{getAlarmByNumber(alarm).severity}}
            /Set Point &nbsp;
            {{getAlarmByNumber(alarm).set}}
          </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-tooltip bottom>
            <template #activator="data">
              <v-icon v-on="data.on" @click="$emit('delAlarmClick', alarm)">remove_circle</v-icon>
            </template>
            <span>Delete Alarm</span>
          </v-tooltip>
        </v-list-tile-action>
      </v-list-tile>

      <v-list-tile v-if="tank.temperature.alarms.length === 0">
        <v-list-tile-action>A</v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title class="warning--text">No temperature alarms are assigned</v-list-tile-title>
          <v-list-tile-sub-title>
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TankTemperatureView',
  props: {
    tank: { type: Object, default: null }
  },
  computed: {
    ...mapGetters([
      'getAlarmByNumber',
      'getChnlByNumber',
      'ioLOCStr'
    ])
  },
  methods: {
    onClickDummy () {
    }
  }
}
</script>

<style>
</style>
