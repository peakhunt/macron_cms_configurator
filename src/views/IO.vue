<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card class="elevation-12">
          <v-card-title primary-title>
            <div>
              <div class="headline primary--text">IO Configuration</div>
            </div>
          </v-card-title>

          <v-layout justify-space-between pa-3>
            <v-flex xs5>
              <v-treeview open-on-click
                          activatable
                          transition
                          :items="configs"
                          >
                <template slot="prepend" slot-scope="{ item, active }">
                  <v-icon :color="active ? 'primary' : ''">
                    {{nodeIcon(item)}}
                  </v-icon>
                </template>
                <template slot="label" slot-scope="{ item }">
                  {{nodeName(item)}}
                </template>
              </v-treeview>
            </v-flex>

            <v-flex d-flex text-xs-center>
              <div class="blue">
                content
              </div>
            </v-flex>

          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

const idRange = {
  root: {
    start: 1,
    end: 1
  },
  serial: {
    start: 1000,
    end: 1000
  },
  serialPort: {
    start: 2000,
    end: 2999
  },
  serialTarget: {
    start: 5000,
    end: 5999
  },
  net: {
    start: 10000,
    end: 10000
  },
  netTarget: {
    start: 15000,
    end: 15999
  }
}

function checkIDRange (id) {
  const keys = Object.keys(idRange)

  for (let ndx = 0; ndx < keys.length; ndx += 1) {
    const l = idRange[keys[ndx]]
    if (id >= l.start && id <= l.end) {
      return keys[ndx]
    }
  }
  return 'unknown'
}

const serialIDRange = {
  root: { start: 1, end: 999 },
  port: { start: 1000, end: 1999 }
}

function checkSerialRange (id) {
  const keys = Object.keys(serialIDRange)

  for (let ndx = 0; ndx < keys.length; ndx += 1) {
    const l = serialIDRange[keys[ndx]]
    if (id >= l.start && id <= l.end) {
      return keys[ndx]
    }
  }
  return 'unknown'
}

export default {
  name: 'IO',
  computed: {
    ...mapGetters([
      'serialIO',
      'netIO'
    ])
  },
  methods: {
    nodeIcon (item) {
      const range = checkIDRange(item.id)
      switch (range) {
        case 'root':
        case 'serial':
        case 'net':
          return item.icon

        case 'serialPort':
          return 'mdi-serial-port'

        case 'netTarget':
          return 'mdi-face'
      }
      return 'mdi-error'
    },
    nodeName (item) {
      const range = checkIDRange(item.id)
      switch (range) {
        case 'root':
        case 'serial':
        case 'net':
          return item.name

        case 'serialPort':
          if (item.value.protocol === 'none') {
            return `${item.value.port} - Not Used`
          }
          return `${item.value.port} - ${item.value.protocol}`

        case 'netTarget':
          return item.value.protocol
      }
      return 'Error'
    },
    onSerialClick (item) {
      const range = checkSerialRange(item.id)

      switch (range) {
        case 'root':
          return item.name

        case 'port':
          return item.name
      }
    }
  },
  data () {
    return {
      configs: [
        {
          id: idRange.root.start,
          name: 'IO Configurations',
          icon: 'mdi-network-online',
          children: [
            {
              id: idRange.serial.start,
              name: 'Serial IO',
              icon: 'mdi-lan-connect',
              children: []
            },
            {
              id: idRange.net.start,
              name: 'Network IO',
              children: [],
              icon: 'mdi-lan'
            }
          ]
        }
      ]
    }
  },
  mounted () {
    const self = this
    let id

    id = idRange.serialPort.start
    self.$store.getters.serialIO.forEach((v, n) => {
      self.configs[0].children[0].children.push({
        id: id,
        action: 'add',
        value: v
      })
      id += 1
    })

    id = idRange.netTarget.start
    this.$store.getters.netIO.forEach((v, n) => {
      self.configs[0].children[1].children.push({
        id: id,
        value: v
      })
      id += 1
    })
    /*
    id = serialIDRange.port.start
    self.$store.getters.serialIO.forEach((v, n) => {
      self.serial.serialConfigs[0].children.push({
        id: id,
        action: 'add',
        value: v
      })
      id += 1
    })

    id = 1000
    this.$store.getters.netIO.forEach((v, n) => {
      self.net.netConfigs[0].children.push({
        id: id,
        value: v
      })
      id += 1
    })
    */
  },
  watch: {
  }
}
</script>

<style scoped>
</style>
