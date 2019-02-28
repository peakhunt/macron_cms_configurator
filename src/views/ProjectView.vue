<template>
  <v-container fluid grid-list-lg>
    <v-layout justify-center row wrap>
      <v-flex xs12>
        <v-card class="elevation-12">
          <v-card-title primary-title>
            <div>
              <div class="headline primary--text">Project Info</div>
            </div>
          </v-card-title>
          <v-card-text>
            <v-text-field label="Project Title"
                          v-model="title"
                          :rules="[rules.required]"
                          />
            <v-text-field label="Vessel"
                          v-model="vessel"
                          :rules="[rules.required]"
                          />
            <v-text-field label="Revision"
                          :value="projectRevision"
                          append-icon="add"
                          @click:append="incRevision"
                          readonly
                          />
            <v-text-field label="Last Update"
                          readonly
                          :value="projectLastUpdate"/>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProjectView',
  computed: {
    ...mapGetters([
      'projectTitle',
      'projectVessel',
      'projectRevision',
      'projectLastUpdate'
    ]),
    title: {
      get () {
        return this.projectTitle
      },
      set (value) {
        this.$store.dispatch(`change_PROJECT_TITLE`, value)
      }
    },
    vessel: {
      get () {
        return this.projectVessel
      },
      set (value) {
        this.$store.dispatch(`change_PROJECT_VESSEL`, value)
      }
    }
  },
  methods: {
    incRevision () {
      this.$store.dispatch(`incRevision`)
    }
  },
  data () {
    return {
      rules: {
        required: value => !!value || 'Required.'
      }
    }
  }
}

</script>

<style scoped>
</style>
