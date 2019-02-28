<template>
  <v-dialog v-if="chnlNum !== -1" :value="show" persistent scrollable max-width="50%" lazy>
    <v-card>
      <v-card-title class="headline">Channel Config</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field label="Channel Number" v-model="chnlNum" readonly />
          <v-text-field label="Channel Name" v-model="channel.name" :rules="[rules.required]" readonly />
          <v-text-field label="Direction" :value="channel.dir" readonly />
          <v-text-field label="Type" :value="channel.type" readonly />
          <!-- FIXME IO location for physical channels -->
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!valid" flat color="primary" @click="$emit('close')">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ChannelConfigDialog',
  props: {
    show: { type: Boolean, default: false },
    chnlNum: { type: Number }
  },
  computed: {
    ...mapGetters([
      'getChnlByNumber'
    ]),
    channel () {
      const c = this.getChnlByNumber(this.chnlNum)

      if (c === undefined) {
        return {
          name: '',
          dir: 'virtual',
          type: 'analog'
        }
      }
      return c
    }
  },
  methods: {
  },
  data () {
    return {
      valid: true,
      rules: {
        required: value => !!value || 'Required.'
      }
    }
  }
}
</script>

<style>
</style>
