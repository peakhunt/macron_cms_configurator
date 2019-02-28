<template>
  <v-dialog :value="show" persistent max-width="55%" lazy>
    <v-card>
      <v-card-title class="headline">Please Confirm</v-card-title>
      <v-card-text>
        {{ msg }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="$emit('confirm')">Confirm</v-btn>
        <v-btn flat color="primary" @click="$emit('cancel')">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    show: { type: Boolean, default: false },
    msg: { type: String, defualt: '' }
  }
}
</script>

<style scoped>
</style>
