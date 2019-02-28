<template>
  <v-container fluid grid-list-lg>
    <v-layout justify-center row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title class="headline">
            Alarm List
            <span v-if="isPrinting">- {{projectTitle}}</span>
            <v-btn v-if="!isPrinting" @click="onWriteToPDF" class="primary">Write to PDF</v-btn>
            <v-spacer></v-spacer>
            <v-text-field v-if="!isPrinting" v-model="search"
                          append-icon="search"
                          label="Search"
                          single-line
                          hide-details/>
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="headers"
                          :rows-per-page-items="[20, 10, {text: 'All', value: -1}]"
                          :hide-actions="isPrinting"
                          :pagination.sync="pageSetup"
                          :search="search"
                          :items="alarms">
              <template slot="items" slot-scope="props">
                <tr @click="showAlarmDialog(parseInt(props.item.number))">
                  <td> {{props.item.number}} </td>
                  <td > {{props.item.alarm.type}} </td>
                  <td > {{props.item.alarm.severity}} </td>
                  <td> {{props.item.alarm.set}} </td>
                  <td> {{props.item.alarm.delay}} </td>
                  <td> {{props.item.alarm.channel}} </td>
                  <td> {{props.item.alarm.name}} </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
      <AlarmConfigDialog :show="alarmConfigDlg.show"
                       :alarmNum="alarmConfigDlg.alarmNum"
                       @close="alarmConfigDlg.show = false"/>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import AlarmConfigDialog from '@/components/AlarmConfigDialog'
import { ipcRenderer } from 'electron'

const dialog = require('electron').remote.dialog

export default {
  name: 'AlarmList',
  components: {
    AlarmConfigDialog
  },
  computed: {
    ...mapGetters([
      'projectTitle',
      'isPrinting',
      'setPrinting',
      'alarmsObj',
      'getAlarmByNumber'
    ]),
    alarms () {
      const ret = []

      for (let k in this.alarmsObj) {
        ret.push({
          number: k,
          alarm: this.getAlarmByNumber(k)
        })
      }
      return ret
    }
  },
  methods: {
    showAlarmDialog (alarmNum) {
      this.alarmConfigDlg.alarmNum = alarmNum
      this.alarmConfigDlg.show = true
    },
    onWriteToPDF () {
      const self = this

      dialog.showSaveDialog({
        title: 'Save Current Project',
        filters: [
          { name: 'PDF', extensions: ['pdf'] }
        ]
      }, (filename) => {
        if (filename === undefined) {
          return
        }
        self.pageSetup.rowsPerPage = -1
        self.$store.commit('setPrinting', true)

        ipcRenderer.send('write-to-pdf', filename)
      })
    }
  },
  data () {
    return {
      search: '',
      headers: [
        { text: 'Alarm Number', value: 'number', width: '5%' },
        { text: 'Type', value: 'alarm.type', width: '5%' },
        { text: 'Severity', value: 'alarm.severity', width: '5%' },
        { text: 'Set', value: 'alarm.set', width: '5%' },
        { text: 'Delay', value: 'alarm.delay', width: '5%' },
        { text: 'Channel', value: 'alarm.channel', width: '5%' },
        { text: 'Name', value: 'alarm.name' }
      ],
      alarmConfigDlg: {
        show: false,
        alarmNum: -1
      },
      pageSetup: {
        rowsPerPage: 20
      }
    }
  },
  mounted () {
    const self = this
    ipcRenderer.on('write-to-pdf-done', () => {
      self.$store.commit('setPrinting', false)
      self.pageSetup.rowsPerPage = -1
    })
  }
}
</script>

<style>
@media print {
  body {
    overflow: auto;
    height: auto;
  }
}
</style>
