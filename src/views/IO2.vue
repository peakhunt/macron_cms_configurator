<template>
  <v-container fluid grid-list-lg>
    <v-layout justify-center row wrap>
      <v-flex xs6 v-for="(serialCfg, ndx) in serialIO" :key="ndx">
        <SerialConfigView :serialCfg="serialCfg"
                          @addSerialSlave="onAddSerialSlaveClick"
                          @cfgSerialSlave="onCfgSerialSlaveClick"
                          @confirmRequest="onConfirmDialogRequested" />
      </v-flex>

      <SerialSlaveAddDialog :show="addSerialSlaveDlg.show"
                            :serialCfg="addSerialSlaveDlg.serialCfg"
                            @confirm="onAddSerialSlaveConfirm"
                            @cancel="onAddSerialSlaveCancel"/>

      <SerialSlaveConfigDialog :show="cfgSerialSlaveDlg.show"
                               :slave="cfgSerialSlaveDlg.slave"
                               :serialCfg="cfgSerialSlaveDlg.serialCfg"
                               @close="onCfgSerialSlaveClose"
                               @chnlSelected="onShowChnlCfgDlg"
                               @alarmSelected="onAlarmCfgDlg" />

      <ConfirmDialog :show="confirmDlg.show"
                     :msg="confirmDlg.msg"
                     @confirm="onConfirmDialogConfirm"
                     @cancel="onConfirmDialogCancel" />
      <ChannelConfigDialog :show="chnlCfgDlg.show"
                           :chnlNum="chnlCfgDlg.chnlNum"
                           @close="chnlCfgDlg.show = false" />
      <AlarmConfigDialog :show="almCfgDlg.show"
                         :alarmNum="almCfgDlg.alarmNum"
                         @close="almCfgDlg.show = false" />
    </v-layout>

  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import SerialConfigView from '@/components/SerialConfigView'
import SerialSlaveAddDialog from '@/components/SerialSlaveAddDialog'
import SerialSlaveConfigDialog from '@/components/SerialSlaveConfigDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import ChannelConfigDialog from '@/components/ChannelConfigDialog'
import AlarmConfigDialog from '@/components/AlarmConfigDialog'

export default {
  name: 'IO2',
  computed: {
    ...mapGetters([
      'serialIO',
      'netIO'
    ])
  },
  components: {
    SerialConfigView,
    SerialSlaveAddDialog,
    SerialSlaveConfigDialog,
    ConfirmDialog,
    ChannelConfigDialog,
    AlarmConfigDialog
  },
  methods: {
    //
    // slave add for serial modbus master
    //
    onAddSerialSlaveClick (serialCfg) {
      this.addSerialSlaveDlg.show = true
      this.addSerialSlaveDlg.serialCfg = serialCfg
    },
    onAddSerialSlaveCancel () {
      this.addSerialSlaveDlg.serialCfg = null
      this.addSerialSlaveDlg.show = false
    },
    onAddSerialSlaveConfirm (target) {
      this.addSerialSlaveDlg.show = false
      this.$store.dispatch('addModbusSerialSlave', {
        serialCfg: this.addSerialSlaveDlg.serialCfg,
        slave: target
      })
      this.addSerialSlaveDlg.serialCfg = null
    },
    //
    // serial slave config
    //
    onCfgSerialSlaveClick (payload) {
      this.cfgSerialSlaveDlg.slave = payload.slave
      this.cfgSerialSlaveDlg.serialCfg = payload.serialCfg
      this.cfgSerialSlaveDlg.show = true
    },
    onCfgSerialSlaveClose () {
      this.cfgSerialSlaveDlg.show = false
      this.cfgSerialSlaveDlg.serialCfg = null
      this.cfgSerialSlaveDlg.slave = null
    },
    //
    // confirm dialog
    //
    onConfirmDialogRequested (payload) {
      this.confirmDlg.msg = payload.msg
      this.confirmDlg.obj = payload.obj
      this.confirmDlg.confirm = payload.confirm
      this.confirmDlg.cancel = payload.cancel

      this.confirmDlg.show = true
    },
    onConfirmDialogConfirm () {
      this.confirmDlg.confirm()
      this.confirmDlg.show = false
    },
    onConfirmDialogCancel () {
      this.confirmDlg.cancel()
      this.confirmDlg.show = false
    },
    //
    // channel config dialog
    //
    onShowChnlCfgDlg (chnlNum) {
      this.chnlCfgDlg.chnlNum = chnlNum
      this.chnlCfgDlg.show = true
    },
    onAlarmCfgDlg (alarmNum) {
      this.almCfgDlg.alarmNum = alarmNum
      this.almCfgDlg.show = true
    }
  },
  data () {
    return {
      addSerialSlaveDlg: {
        show: false,
        serialCfg: null
      },
      cfgSerialSlaveDlg: {
        show: false,
        serialCfg: null,
        slave: null
      },
      confirmDlg: {
        show: false,
        msg: '',
        obj: null,
        confirm: null,
        cancel: null
      },
      chnlCfgDlg: {
        show: false,
        chnlNum: -1
      },
      almCfgDlg: {
        show: false,
        alarmNum: -1
      }
    }
  }
}
</script>

<style>
</style>
