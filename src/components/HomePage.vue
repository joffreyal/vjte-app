<template>
  <div class="hello mt-2">
    <h1>Bienvenue</h1>
    <p>
      Il est fortement conseillé de garder un cahier de compte sous la main en cas de bug.
    </p>
  </div>
  <div class="row row-cols-2 row-cols-md-4 g-4 m-5">
    <div class="col">
      <div class="card h-100">
        <div class="card-header text-center">
          <i class="bi bi-receipt-cutoff" style="font-size: 5rem; color: cornflowerblue;"></i>
        </div>
        <div class="card-body">
          <h5 class="card-title">Ventes</h5>
          <p class="card-text">Interface permettant de sauvegarder les ventes effectuées.</p>
        </div>
        <div class="card-footer text-muted">
          <a href="#" class="btn btn-primary stretched-link" @click="changeView('AppSale')">
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card h-100">
        <div class="card-header text-center">
          <i class="bi bi-cash-coin" style="font-size: 5rem; color: cornflowerblue;"></i>
        </div>
        <div class="card-body">
          <h5 class="card-title">Opérations de caisse</h5>
          <p class="card-text">Permet de récupérer une liste des opérations de caisses pour une date donnée</p>
        </div>
        <div class="card-footer text-muted">
          <a href="#" class="btn btn-primary stretched-link" @click="changeView('AppRegisterOperations')">
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card h-100">
        <div class="card-header text-center">
          <i class="bi bi-graph-up" style="font-size: 5rem; color: cornflowerblue;"></i>
        </div>
        <div class="card-body">
          <h5 class="card-title">Rapport de vente</h5>
          <p class="card-text">Permet d'afficher la liste des ventes par créateur sur une période donnée</p>
        </div>
        <div class="card-footer text-muted">
          <a href="#" class="btn btn-primary stretched-link" @click="changeView('AppSalesReport')">
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card h-100">
        <div class="card-header text-center">
          <i class="bi bi-file-spreadsheet" style="font-size: 5rem; color: #2A8947;"></i>
        </div>
        <div class="card-body">
          <h5 class="card-title">Feuille de calcul Google</h5>
          <p class="card-text">Toutes les données sont récupérées et sauvegardées ici</p>
        </div>
        <div class="card-footer text-muted">
          <a href="https://docs.google.com/spreadsheets/d/11XmS1Ne_31lKCDSYpWY22u41s4P9qCje7Ebvuk5KU0Q/edit?usp=sharing" target="_blank" class="btn btn-success stretched-link">
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card h-100">
        <div class="card-header text-center">
          <i class="bi bi-folder" style="font-size: 5rem; color: #2A8947;"></i>
        </div>
        <div class="card-body">
          <h5 class="card-title">Dossier Google Drive</h5>
          <p class="card-text">Le dossier google drive regroupant les feuilles de calculs, les rapports et les factures</p>
        </div>
        <div class="card-footer text-muted">
          <a href="https://drive.google.com/drive/folders/1Nnz58hbbwaVjXCEtZM3vBN4NJJUmAVd3?usp=sharing" target="_blank" class="btn btn-success stretched-link">
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
  <div class="text-center">Version : {{appVersion}}</div>
</template>

<script>

export default {
  inject: ['currentView'],
  data () {
    return {
      appVersion: this.$params.version
    }
  },
  methods: {
    changeView(page) {
      this.currentView.change(page)
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
