<template>
  <div class="container">
    <div class="row">
      <div class="input-group col">
        <span class="input-group-text">De</span>
        <input v-model="salesReportStart" type="date" class="form-control">
      </div>
      <div class="input-group col">
        <span class="input-group-text">A</span>
        <input v-model="salesReportEnd" type="date" class="form-control">
      </div>
      <div class="col">
        <button class="btn btn-primary" @click="getSalesReport()">
          <span v-if="loadingReport" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{loadingReport ? '' : 'Génerer le rapport'}}
        </button>
      </div>
    </div>
    <div class="row">
      <div v-for='(sales, index) in salesReport' class="card" :key="index+'sales'">
        <div class="card-body">
          <button class="btn btn-light" type="button" data-bs-toggle="collapse" :data-bs-target="'#saleTable'+index">{{index}}</button>
          <div class="collapse" :id="'saleTable'+index">
            <table class="table">
              <thead class="table-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">date</th>
                  <th scope="col">produit</th>
                  <th scope="col">prix</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(sale, saleIndex) in sales" :key="saleIndex+'sale'">
                  <th scope="row">{{ saleIndex +1  }}</th>
                  <th scope="row">{{ sale.date }}</th>
                  <th scope="row">{{ sale.product }}</th>
                  <th scope="row">{{ sale.price }}</th>
                </tr>
              </tbody>
              <tfoot class="table-light">
                <tr>
                  <th></th>
                  <th></th>
                  <th>TOTAL</th>
                  <th>{{totalOfSales(sales, true)}}</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import currency from "currency.js"
const EURO = value => currency(value, { symbol: '€', decimal: ',', separator: '.' });
export default {
  data() {
    return {
      appURL: this.$params.backUrl,
      salesReportStart: '',
      salesReportEnd: '',
      salesReport: [],
      loadingReport: false,
    }
  },
  methods: {
    getSalesReport() {
      const requestOptions = {
        redirect: "follow",
        method: 'GET',
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        }
      };
      this.loadingReport = true;
      fetch(this.appURL + "?q=salesreport&startDate=" +this.salesReportStart+ '&endDate='+this.salesReportEnd, requestOptions)
      .then(response => response.json())
      .then(data => {
        this.salesReport = data.data;
        this.loadingReport = false;
      });
    },
    totalOfSales(sales, formatted = false) {
      var total = 0;
      sales.forEach(sale => {
        total = currency(sale.price.replace(',', '.')).add(total);
      });
      if (formatted) {
        return EURO(total).format();
      }
      return (total);
    },
  }
}
</script>

<style>
</style>
