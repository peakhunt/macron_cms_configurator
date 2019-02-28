<template>
  <v-container fluid grid-list-lg>
    <v-layout justify-center row wrap>
      <v-flex xs12>

        <v-card class="elevation-12">
          <v-card-title primary-title>
            <div class="headline primary--text">Errors - ({{configErrorCount}})</div>
          </v-card-title>

          <v-card-text>
            <v-data-table
                :headers="headers"
                :items="configErrorData"
                class="elevation-1"
                hide-actions>
              <template slot="items" slot-scope="props">
                <td>{{ props.item.key }}</td>
                <td>{{ props.item.value }}</td>
              </template>
              <template slot="no-data">
                <v-alert :value="true" color="success" icon="warning">
                  No errors found
                </v-alert>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Errors',
  computed: {
    ...mapGetters([
      'configError',
      'configErrorCount',
      'configErrorData'
    ])
  },
  data () {
    return {
      headers: [
        {
          text: 'Key',
          align: 'left',
          sortable: false,
          value: 'key',
          width: '25%'
        },
        { text: 'Error',
          align: 'left',
          sortable: false,
          value: 'value'
        }
      ]
    }
  }
}

</script>

<style scoped>
</style>
