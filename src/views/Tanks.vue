<template>
  <v-container fluid grid-list-lg>
    <v-btn fab small color="cyan accent-2" bottom right fixed @click="showAddTankDialog()">
      <v-icon>add</v-icon>
    </v-btn>

    <v-layout row wrap>
      <v-flex xs12>
        <v-card class="elevation-12">
          <v-card-title primary-title>
            <div>
              <div class="headline primary--text">Number of Tanks - {{numTanks}}</div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

      <v-flex xs6 v-for="(tank,ndx) in tanks" :key="ndx">
        <TankView :tank="tank"
                  @delTank="onDelTank"
                  @moveTank="showTankMoveDialog"
                  @chnlClick="onChnlClick"
                  @alarmClick="onAlarmClick"
                  @delAlarmClick="onDelAlarmClick"
                  @addAlarmClick="onAddAlarmClick"
                  @addSensorClick="onAddSensorClick"
                  @delSensorClick="onDelSensorClick" />
      </v-flex>
    </v-layout>

    <v-dialog v-model="addTankDialog.show" persistent max-width="50%">
      <v-card>
        <v-card-title class="headline">Add New Tank</v-card-title>
        <v-card-text>
          <v-form v-model="addTankDialog.valid" ref="addTankForm">
            <v-text-field label="Tank Name"
                          v-model="addTankDialog.name"
                          :rules="[rules.required, rules.tankName]"></v-text-field>
            <v-text-field type="number"
                          class="inputHeight"
                          label="Height"
                          v-model.number="addTankDialog.height"
                          suffix="meter"
                          :rules="[rules.required, rules.height]"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="!addTankDialog.valid" flat color="primary" @click="onAddTank">Add</v-btn>
          <v-btn flat color="primary" @click="addTankDialog.show = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ChannelConfigDialog :show="chnlConfigDlg.show"
                         :chnlNum="chnlConfigDlg.chnlNum"
                         @close="closeChannelConfigDlg"/>
    <AlarmConfigDialog :show="alarmConfigDlg.show"
                       :alarmNum="alarmConfigDlg.alarmNum"
                       @close="closeAlarmConfigDlg"/>
    <ConfirmDialog :show="confirmDlg.show"
                   :msg="confirmDlg.msg"
                   @confirm="onConfirmDialogConfirm"
                   @cancel="onConfirmDialogCancel" />

    <AlarmAddDialog :show="addAlarmDlg.show"
                    :msg="addAlarmDlg.msg"
                    :alarmNum="addAlarmDlg.alarmNum"
                    :chnlNum="addAlarmDlg.chnlNum"
                    @confirm="onAddAlarmConfirm"
                    @cancel="onAddAlarmCancel"/>

    <TankMoveDialog :show="moveTankDlg.show"
                    :tank="moveTankDlg.tank"
                    @move="onMoveTank"
                    @close="moveTankDlg.show = false"/>

    <SensorAddDialog :show="sensorAddDlg.show"
                     :sensorType="sensorAddDlg.sensorType"
                     @addSensor="onAddSensor"
                     @cancel="sensorAddDlg.show = false"/>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import TankView from '@/components/TankView.vue'
import ChannelConfigDialog from '@/components/ChannelConfigDialog'
import AlarmConfigDialog from '@/components/AlarmConfigDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import AlarmAddDialog from '@/components/AlarmAddDialog'
import TankMoveDialog from '@/components/TankMoveDialog'
import SensorAddDialog from '@/components/SensorAddDialog'

const log = require('electron-log')

export default {
  name: 'Tanks',
  components: {
    TankView,
    ChannelConfigDialog,
    AlarmConfigDialog,
    ConfirmDialog,
    AlarmAddDialog,
    TankMoveDialog,
    SensorAddDialog
  },
  computed: {
    ...mapGetters([
      'numTanks',
      'tanks',
      'getTankByName',
      'getAlarmByNumber',
      'nextFreeAlarmNum'
    ])
  },
  methods: {
    //
    // channel
    //
    onChnlClick (chnlNum) {
      this.chnlConfigDlg.chnlNum = chnlNum
      this.chnlConfigDlg.show = true
    },
    closeChannelConfigDlg () {
      this.chnlConfigDlg.chnlNum = -1
      this.chnlConfigDlg.show = false
    },
    //
    // alarm
    //
    onAlarmClick (alarmNum) {
      this.alarmConfigDlg.alarmNum = alarmNum
      this.alarmConfigDlg.show = true
    },
    closeAlarmConfigDlg () {
      this.alarmConfigDlg.alarmNum = -1
      this.alarmConfigDlg.show = false
    },
    onDelAlarmClick (payload) {
      const alarmNum = payload.alarmNum
      const self = this

      const msg = `Do you wanna delete alarm ${alarmNum} - ${this.getAlarmByNumber(alarmNum).name}?`

      this.showConfirmDialog(msg,
        () => {
          self.$store.dispatch('delTankAlarm', payload)
        },
        () => {
        })
    },
    onAddAlarmClick (payload) {
      const tank = payload.tank
      const type = payload.type
      const alarmNum = this.nextFreeAlarmNum
      const chnlNum = tank[type].channel
      const self = this

      const msg = `${tank.name} ${type} alarm`

      self.showAddAlarmDialog(msg, alarmNum, chnlNum,
        (alarmCfg) => {
          alarmCfg.channel = chnlNum

          this.$store.dispatch('addTankAlarm', {
            tank,
            type,
            alarmNum,
            alarm: alarmCfg
          })
          this.addAlarmDlg.show = false
        },
        () => {
          // nothing to do
        })
    },
    //
    // tank add/delete
    //
    showAddTankDialog () {
      this.$refs.addTankForm.reset()
      this.addTankDialog.show = true
    },
    onAddTank () {
      log.debug(`adding tank ${this.addTankDialog.name} ${this.addTankDialog.height}`)
      this.addTankDialog.show = false

      this.$store.dispatch('addTank', {
        name: this.addTankDialog.name,
        height: this.addTankDialog.height
      })

      /* FIXME */
      window.scrollTo(0, document.body.scrollHeight)
    },
    onDelTank (tank) {
      const self = this
      this.showConfirmDialog(`Do you wanna delete tank ${tank.name}`,
        () => {
          log.debug(`deleting tank ${tank.name}`)
          self.$store.dispatch('delTank', tank)
        },
        () => {
        }
      )
    },
    //
    // confirm dialog
    //
    onConfirmDialogConfirm () {
      this.confirmDlg.show = false
      this.confirmDlg.confirm()
    },
    onConfirmDialogCancel () {
      this.confirmDlg.show = false
      this.confirmDlg.cancel()
    },
    showConfirmDialog (msg, confirm, cancel) {
      this.confirmDlg.msg = msg
      this.confirmDlg.confirm = confirm
      this.confirmDlg.cancel = cancel
      this.confirmDlg.show = true
    },
    //
    // add alarm dialog
    //
    onAddAlarmConfirm (alarmCfg) {
      this.addAlarmDlg.show = false
      this.addAlarmDlg.confirm(alarmCfg)
    },
    onAddAlarmCancel () {
      this.addAlarmDlg.show = false
      this.addAlarmDlg.cancel()
    },
    showAddAlarmDialog (msg, alarmNum, chnlNum, confirm, cancel) {
      this.addAlarmDlg.msg = msg
      this.addAlarmDlg.alarmNum = alarmNum
      this.addAlarmDlg.chnlNum = chnlNum
      this.addAlarmDlg.confirm = confirm
      this.addAlarmDlg.cancel = cancel

      this.addAlarmDlg.show = true
    },
    //
    // tank move
    //
    showTankMoveDialog (tank) {
      this.moveTankDlg.tank = tank
      this.moveTankDlg.show = true
    },
    onMoveTank (tankAfter) {
      this.moveTankDlg.show = false
      this.$store.dispatch('moveTank', {
        tank: this.moveTankDlg.tank,
        tankAfter: tankAfter
      })
    },
    //
    // add sensor
    //
    showAddSensorDialog (sensorType, tank) {
      this.sensorAddDlg.sensorType = sensorType
      this.sensorAddDlg.tank = tank
      this.sensorAddDlg.show = true
    },
    onAddSensorClick (payload) {
      this.showAddSensorDialog(payload.sensorType, payload.tank)
    },
    onDelSensorClick (payload) {
      this.$store.dispatch('delSensor', payload)
    },
    onAddSensor (payload) {
      this.sensorAddDlg.show = false
      this.$store.dispatch('addSensor', {
        tank: this.sensorAddDlg.tank,
        sensorType: this.sensorAddDlg.sensorType,
        sensor: payload.sensor,
        ioLoc: JSON.parse(JSON.stringify(payload.ioLoc))
      })
    }
  },
  data () {
    return {
      rules: {
        required: value => (value === 0 || !!value) || 'Required.',
        height: value => {
          if (this.addTankDialog.height < 1 || this.addTankDialog.height > 200) {
            return 'Invalid Height. Must be between 1 and 200 meters'
          }
          return true
        },
        tankName: value => {
          if (this.getTankByName(value) !== undefined) {
            return `${value} already exists!`
          }
          return true
        }
      },
      addTankDialog: {
        show: false,
        name: '',
        height: 40,
        valid: true
      },
      chnlConfigDlg: {
        show: false,
        chnlNum: -1
      },
      alarmConfigDlg: {
        show: false,
        alarmNum: -1
      },
      confirmDlg: {
        show: false,
        msg: '',
        confirm: null,
        cancel: null
      },
      addAlarmDlg: {
        show: false,
        confirm: null,
        cancel: null,
        alarmNum: -1,
        chnlNum: -1,
        msg: ''
      },
      moveTankDlg: {
        show: false,
        tank: null
      },
      sensorAddDlg: {
        show: false,
        tank: null,
        sensorType: ''
      }
    }
  }
}
</script>

<style>
</style>
