<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-flex xs12>
        <v-img :src="require('../assets/logo.svg')" class="my-3" contain height="200"></v-img>
      </v-flex>

      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          Macron CMS Project Configurator
        </h1>
        <p class="subheading font-weight-regular">
          &copy; Scanjet Macron All Rights Reserved 2019
        </p>
      </v-flex>

      <v-flex mb-5 xs12>
        <h2 class="headline font-weight-bold mb-3">Credits</h2>
        <v-layout justify-center row wrap>
          <v-flex xs12 v-for="(credit) in credits" :key="credit">
            <span class="font-italic"> {{ credit }} </span>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12 mb-5>
        <h2 class="headline font-weight-bold mb-3">Revision History</h2>
        <v-layout justify-center>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {
      credits: [
        'Hawk Hyouck \'The Bokdol\' Kim, main programmer, Scanjet Macron',
        'Evan You, The Vue genius & magician',
        'Awesome Vuetify team',
        'Many thanks to our devoted opensource developers'
      ]
    }
  }
}
</script>

<style>
</style>
