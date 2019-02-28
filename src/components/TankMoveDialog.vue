<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title>
        Move {{tank === null ? '' : tank.name}} After
      </v-card-title>
      <v-card-text>
        <v-select :items="items"
                  item-text="name"
                  item-value="value"
                  v-model="selected"
                  label="Select a tank to move the tank after">
        </v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="selected === null" color="primary" flat @click="$emit('move', selected)">Move</v-btn>
        <v-btn color="primary" flat @click="$emit('close')">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TankMoveDialog',
  computed: {
    ...mapGetters([
      'tanks',
      'numTanks',
      'getTankByNdx'
    ])
  },
  props: {
    show: { type: Boolean, default: false },
    tank: { type: Object, default: null }
  },
  data () {
    return {
      items: [],
      selected: null
    }
  },
  methods: {
  },
  watch: {
    show (newVal, oldVal) {
      if (newVal) {
        // populate items
        this.items = []
        this.tanks.forEach(t => {
          if (t.name !== this.tank.name) {
            this.items.push({
              name: t.name,
              value: t
            })
          }
        })
        this.selected = null
      } else {
        this.items = []
      }
    }
  }
}
</script>

<style scoped>
</style>
