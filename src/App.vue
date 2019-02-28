<template>
  <v-app :dark="!isPrinting">
    <v-toolbar fixed clipped-left app v-if="!isPrinting">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span class="text-none">CMS Configurator v{{configuratorVersion}}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template #activator="data">
          <v-btn icon v-on="data.on" @click="onNew">
            <v-icon>fiber_new</v-icon>
          </v-btn>
        </template>
        <span>New Project</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="data">
          <v-btn icon v-on="data.on" @click="onOpen">
            <v-icon>unarchive</v-icon>
          </v-btn>
        </template>
        <span>Open Project</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="data">
          <v-btn icon v-on="data.on" :disabled="configError" @click="onSave">
            <v-icon :class="{'info--text': changed}">save</v-icon>
          </v-btn>
        </template>
        <span>Save Project</span>
      </v-tooltip>

      <v-badge right overlap :color="configError ? 'error' : ''" v-model='configError'>
        <span slot="badge">{{configErrorCount}}</span>
        <v-icon large :color="configError ? 'error' : ''" @click="$router.push('/errors')">
        notification_important
        </v-icon>
      </v-badge>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" temporary clipped-left app>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-tile
         v-for="item in navItems"
         :key="item.title"
         :to="item.to">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <router-view/>
    </v-content>

    <v-dialog v-model="discardChangeDialog.show" persistent max-width="50%">
      <v-card>
        <v-card-title class="headline">Changes are not saved!</v-card-title>
        <v-card-text>
          Changes are not saved. Do you wanna discard the changes?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="onDiscardConfirm">Discard</v-btn>
          <v-btn flat color="primary" @click="discardChangeDialog.show = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="progressIndicator.show" persistent max-width="400px">
      <v-card color="primary">
        <v-card-text> {{ progressIndicator.message }}
          <v-progress-linear
            indeterminate
            color="green"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'

export default {
  name: 'Configurator',
  computed: {
    ...mapGetters([
      'projectTitle',
      'configuratorVersion',
      'configError',
      'configErrorCount',
      'changed',
      'isPrinting'
    ])
  },
  components: {
  },
  methods: {
    showDiscardDialog (next) {
      this.discardChangeDialog.show = true
      this.discardChangeDialog.next = next
    },
    onDiscardConfirm () {
      this.discardChangeDialog.show = false
      this.discardChangeDialog.next()
    },
    doNewProject () {
      this.$store.dispatch('newProject')
    },
    onNew () {
      if (this.changed) {
        this.showDiscardDialog(this.doNewProject)
        return
      }
      this.doNewProject()
    },
    doOpenProject () {
      this.$store.dispatch('openProject', this)
    },
    onOpen () {
      if (this.changed) {
        this.showDiscardDialog(this.doOpenProject)
        return
      }
      this.doOpenProject()
    },
    onSave () {
      this.$store.dispatch('saveProject', this)
    },
    quit () {
      ipcRenderer.send('exit-app')
    }
  },
  mounted () {
    const self = this

    self.$on('saveStart', (msg) => {
      self.progressIndicator.message = msg
      self.progressIndicator.show = true
    })
    self.$on('saveEnd', () => {
      self.progressIndicator.show = false
    })
    self.$on('loadStart', (msg) => {
      self.progressIndicator.message = msg
      self.progressIndicator.show = true
    })
    self.$on('loadEnd', () => {
      self.progressIndicator.show = false
    })

    ipcRenderer.on('app-close', () => {
      if (self.changed) {
        self.showDiscardDialog(self.quit)
        return
      }
      self.quit()
    })
  },
  data () {
    return {
      drawer: false,
      navItems: [
        { icon: 'info', title: 'Project Info', to: '/project-info' },
        { icon: 'apps', title: 'IO', to: '/io' },
        { icon: 'apps', title: 'Tanks', to: '/tanks' },
        { icon: 'apps', title: 'Channel List', to: '/channel-list' },
        { icon: 'apps', title: 'Alarm List', to: '/alarm-list' },
        { icon: 'warning', title: 'Errors', to: '/errors' },
        { icon: 'help', title: 'About', to: '/about' }
      ],
      discardChangeDialog: {
        show: false,
        next: null
      },
      progressIndicator: {
        show: false,
        message: ''
      }
    }
  }
}
</script>

<style>
</style>
