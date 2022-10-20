<template>
  <div class="hello">
    <h1>Bienvenue</h1>
    <p>
      Il est fortement conseillé de garder un cahier de compte sous la main en cas de bug.
    </p>
    <div class="container">
      <h3>Les fonctionnalités</h3>
      <div class="row m-3">
        <div class="col-4">
          <b>Ventes :</b>
        </div>
        <div class="col-8">
          Interface permettant de sauvegarder les ventes effectuées
        </div>
      </div>
      <div class="row m-3">
        <div class="col-4">
          <b>Opérations de caisse :</b>
        </div>
        <div class="col-8">
          Permet de récupérer une liste des opérations de caisses pour une date donnée
        </div>
      </div>
      <div class="row m-3">
        <div class="col-4">
          <b>Rapport de ventes :</b>
        </div>
        <div class="col-8">
          Permet d'afficher la liste des ventes par créateur sur une période donnée
        </div>
      </div>
    </div>

    <h3>Liens Utiles</h3>
    <ul>
      <li><a href="https://docs.google.com/spreadsheets/d/11XmS1Ne_31lKCDSYpWY22u41s4P9qCje7Ebvuk5KU0Q/edit?usp=sharing" target="_blank">Feuille de calcul google</a> (Toutes les données sont récupées et sauvegardées ici)</li>
    </ul>
    <div class='fixed-bottom'>
      <p>
        Version : {{appVersion}}
      </p>
    </div>
  </div>
</template>

<script>
import { version } from "../../package.json"

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
    return {
      appVersion: version
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
    text-align: center;
}

.row {
  text-align: left;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  /* display: inline-block; */
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
