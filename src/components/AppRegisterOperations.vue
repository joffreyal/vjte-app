<template>
  <div class="container">
    <div class="row">
      <div class="col-auto">
        <input v-model="registerOperationsDate" type="date" class="form-control">
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" @click="getRegisterOperations(registerOperationsDate)">
          <span v-if="loadingOperations" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{loadingOperations ? '' : 'liste des opérations'}}
        </button>
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
              <th scope="row">{{operation[1]}}</th>
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
  data() {
    return {
      appURL: this.$params.backUrl,
      registerOperationsDate: '',
      loadingOperations: false,
      registerOperationsList: [],
      registerOperationsListFilter: "all",
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
      fetch(this.appURL + "?q=registeroperations&date=" +date, requestOptions)
      .then(response => response.json())
      .then(data => {
        this.registerOperationsList = data.data;
        this.loadingOperations = false;
      });
    },
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
    }
  }
}
</script>

<style>
</style>
