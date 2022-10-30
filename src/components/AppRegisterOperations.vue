<template>
  <div class="container mt-3">

    <h2>OPERATIONS DE CAISSE
      <button class="btn btn-primary btn-sm round-button" type="button" data-bs-toggle="collapse" data-bs-target="#salesInfo" aria-expanded="false" aria-controls="salesInfo">
        <i class="bi bi-info-lg"></i>
      </button>
    </h2>
    <div class="card text-bg-primary collapse m-4" id="salesInfo">
      <div class="card-body">
          <p class="card-text">Permet de visualiser toutes les opérations de caisse pour le jour choisie.</p>
          <p class="card-text">Sélectionnez "Mois complet" si vous souhaitez afficher toutes les opérations du mois.</p>
        </div>
    </div>

    <div class="row mb-2">
      <div class="col-auto">
        <input v-show="fullmonth" v-model="registerOperationsMonth" type="month" class="form-control" @change="onMonthChange()">
        <input v-show="!fullmonth" v-model="registerOperationsDate" type="date" class="form-control" @change="onDateChange()">
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" @click="getRegisterOperations(registerOperationsDate)">
          <span v-if="loadingOperations" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{loadingOperations ? '' : 'liste des opérations'}}
        </button>
      </div>
      <div class="col-auto d-flex align-items-center">
        <div class="form-check">
          <input class="form-check-input" v-model="fullmonth" type="checkbox" value="" id="flexCheckDefault">
          <label class="form-check-label" for="flexCheckDefault">
            Mois complet
          </label>
        </div>
      </div>
    </div>
    <div class="row">
      <table class="table">
        <thead class="table-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">
              <select class="form-select form-select-sm" v-model='registerOperationsListFilter'>
                <option value="all" selected>Filtre : Tous</option>
                <option :value="paymentOption.value" v-for="(paymentOption, optionId) in paymentOptions" :key="optionId+'option'">Filtre : {{ paymentOption.label }}</option>
              </select>
            </th>
            <th scope="col">Montant</th>
          </tr>
        </thead>
        <tbody>
          <template v-for='(operation, index) in registerOperationsList' :key="index+'operation'">
            <tr v-if="operation[0] === registerOperationsListFilter || registerOperationsListFilter === 'all'">
              <th scope="row">{{index +1 }}</th>
              <th scope="row">{{operation[0]}}</th>
              <th scope="row">{{displayCurrency(operation[1])}}</th>
            </tr>
          </template>
        </tbody>
        <tfoot class="table-light">
          <tr>
            <th></th>
            <th>TOTAL</th>
            <th>{{totalOperations}}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import currency from "currency.js"

export default {
  inject: ['toaster'],
  data() {
    return {
      appURL: this.$params.backUrl,
      registerOperationsDate: '',
      registerOperationsMonth: '',
      loadingOperations: false,
      registerOperationsList: [],
      registerOperationsListFilter: "all",
      fullmonth: false,
      paymentOptions: [
        {'label': 'CB', 'value': 'CB'},
        {'label': 'Espece', 'value': 'Espece'},
        {'label': 'Chéque', 'value': 'Chéque'},
        {'label': 'Carte cadeau', 'value': 'Carte cadeau'},
      ],
    }
  },
  methods: {
    getRegisterOperations(date) {
      const requestOptions = {
        redirect: "follow",
        method: 'GET',
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        }
      };
      this.loadingOperations = true
      fetch(this.appURL + "?q=registeroperations&date=" +date+ "&fullmonth="+this.fullmonth, requestOptions)
      .then(async response => {
        
        if (!response.ok) {
          const error = response.status;
          return Promise.reject(error);
        }
        const data = await response.json();

        this.registerOperationsList = data.data;
        this.loadingOperations = false;
      })
      .catch(error => {
        this.loadingOperations = false;
        this.errorMessage = error;
        this.toaster.add('Erreur', "Il semble qu'une erreur ait eu lieu lors de la récupération des opérations", '#dc3545');
        console.error('There was an error!', error);
      });
    },
    onDateChange() {
      this.registerOperationsMonth = this.registerOperationsDate.substring(0,7)
    },
    onMonthChange() {
      this.registerOperationsDate = this.registerOperationsMonth + '-' + this.registerOperationsDate.split('-')[2]
    },
    displayCurrency(value) {
      return currency(value);
    }
  },
  computed: {
    totalOperations() {
      var result = 0;

      this.registerOperationsList.forEach(operation => {
        if (operation[0] === this.registerOperationsListFilter || this.registerOperationsListFilter === 'all') {
          result = currency(operation[1]).add(result);
        }
      });
      return result;
    },
  },
  mounted() {
    var date = new Date();
    var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 )).toISOString();
    this.registerOperationsDate = dateString.substring(0, 10);
    this.registerOperationsMonth = dateString.substring(0, 7);
  }
}
</script>

<style>
</style>
