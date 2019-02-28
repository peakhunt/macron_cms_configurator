<template>
  <v-card>
    <v-list two-line>
      <v-list-tile @click="onClickDummy">
        <v-list-tile-action>I</v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{tank.height}} meter</v-list-tile-title>
          <v-list-tile-sub-title>Height</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>

      <!-- level channel -->
      <v-list-tile @click="onClickDummy">
        <v-list-tile-action>C</v-list-tile-action>
        <v-list-tile-content @click="$emit('chnlClick', tank.level.channel)">
          <v-list-tile-title>{{tank.level.channel}} - {{getChnlByNumber(tank.level.channel).name}}</v-list-tile-title>
          <v-list-tile-sub-title>
            Channel
          </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-tooltip bottom>
            <template #activator="data">
              <v-icon v-on="data.on" @click="$emit('addSensorClick')">add</v-icon>
            </template>
            <span>Add Level Sensor</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template #activator="data">
              <v-icon v-on="data.on" @click="$emit('addAlarmClick')">add_circle</v-icon>
            </template>
            <span>Add Level Alarm</span>
          </v-tooltip>
        </v-list-tile-action>
        <!-- level channel -->
      </v-list-tile>

      <!-- level sensor -->
      <v-list-tile v-for="(channel,ndx) in tank.level.sensors" :key="'c' + ndx" @click="onClickDummy">
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
              <v-icon v-on="data.on" @click="$emit('delSensorClick', { sensorType: 'level', channel })">remove</v-icon>
            </template>
            <span>Delete Sensor</span>
          </v-tooltip>
        </v-list-tile-action>
      </v-list-tile>

      <v-list-tile v-if="tank.level.sensors.length === 0">
        <v-list-tile-action>S</v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title class="error--text">No level sensor is assigned</v-list-tile-title>
          <v-list-tile-sub-title>
          </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
        </v-list-tile-action>
      </v-list-tile>

      <!-- level alarm -->
      <v-list-tile v-for="(alarm,ndx) in tank.level.alarms" :key="'a' + ndx" @click="onClickDummy">
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

      <v-list-tile v-if="tank.level.alarms.length === 0">
        <v-list-tile-action>A</v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title class="warning--text">No level alarms are assigned</v-list-tile-title>
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
  name: 'TankLevelView',
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
  data () {
    return {
    }
  },
  methods: {
    onClickDummy () {
    }
  }
}
</script>

<style>
</style>
