<template>
  <v-container fluid grid-list-lg>
    <v-layout justify-center row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title class="headline">
            Channel List
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
                          :items="channels">
              <template slot="items" slot-scope="props">
                <tr @click="showChannelDialog(parseInt(props.item.number))">
                  <td> {{props.item.number}} </td>
                  <td> {{props.item.channel.type}} </td>
                  <td> {{props.item.channel.dir}} </td>
                  <td> {{props.item.channel.sensor}} </td>
                  <td> {{ioLOCStr(props.item.channel.ioMap)}} </td>
                  <td> {{props.item.channel.name}} </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>

      <ChannelConfigDialog :show="chnlConfigDlg.show"
                         :chnlNum="chnlConfigDlg.chnlNum"
                         @close="chnlConfigDlg.show = false"/>

    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import ChannelConfigDialog from '@/components/ChannelConfigDialog'
import { ipcRenderer } from 'electron'

const dialog = require('electron').remote.dialog

export default {
  name: 'ChannelList',
  components: {
    ChannelConfigDialog
  },
  computed: {
    ...mapGetters([
      'projectTitle',
      'channelsObj',
      'getChnlByNumber',
      'isPrinting',
      'ioLOCStr'
    ]),
    channels () {
      const ret = []

      for (let k in this.channelsObj) {
        ret.push({
          number: k,
          channel: this.getChnlByNumber(k)
        })
      }
      return ret
    }
  },
  methods: {
    showChannelDialog (chnlNum) {
      this.chnlConfigDlg.chnlNum = chnlNum
      this.chnlConfigDlg.show = true
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
        { text: 'Channel', value: 'number', width: '3%' },
        { text: 'Type', value: 'channel.type', width: '3%' },
        { text: 'Dir', value: 'channel.dir', width: '3%' },
        { text: 'Sensor', value: 'channel.dir', width: '3%' },
        { text: 'I/O', value: 'channel.ioMap', width: '23%' },
        { text: 'Name', value: 'channel.name' }
      ],
      chnlConfigDlg: {
        show: false,
        chnlNum: -1
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
