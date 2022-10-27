<template>
  <div class="container mt-3">

    <h2>RAPPORT DE VENTES
      <button class="btn btn-primary btn-sm round-button" type="button" data-bs-toggle="collapse" data-bs-target="#salesInfo" aria-expanded="false" aria-controls="salesInfo">
        <i class="bi bi-info-lg"></i>
      </button>
    </h2>
    <div class="collapse" id="salesInfo">
      <div class="card card-body">
        WIP
      </div>
    </div>

    <div class="row">
      <div class="input-group col">
        <span class="input-group-text">De</span>
        <input v-model="salesReportStart" type="date" class="form-control">
      </div>
      <div class="input-group col">
        <span class="input-group-text">A</span>
        <input v-model="salesReportEnd" type="date" class="form-control">
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" @click="getSalesReport()">
          <span v-if="loadingReport" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{loadingReport ? '' : 'Génerer le rapport'}}
        </button>
      </div>
      <div class="col">
        <div class="form-check">
          <input class="form-check-input" v-model="saveReport" type="checkbox" value="" id="flexCheckDefault">
          <label class="form-check-label" for="flexCheckDefault">
            sauvegarder en pdf
          </label>
        </div>
      </div>
    </div>
    <div class="row">
      <div v-for='(creator, index) in salesReport' class="card" :key="removeSpace(index)+'sales'">
        <div class="card-body">
          <button class="btn btn-light" type="button" data-bs-toggle="collapse" :data-bs-target="'#saleTable'+removeSpace(index)">{{index}}</button>
          <a v-if="creator.reportUrl" :href="creator.reportUrl" target="_blank">rapport PDF</a>
          <div class="collapse" :id="'saleTable'+removeSpace(index)">
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
                <tr v-for="(sale, saleIndex) in creator.sales" :key="saleIndex+'sale'">
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
                  <th>{{totalOfSales(creator.sales, true)}}</th>
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
      saveReport: false
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
      fetch(this.appURL + "?q=salesreport&startDate=" +this.salesReportStart+ '&endDate='+this.salesReportEnd+ '&save='+this.saveReport, requestOptions)
      .then(response => response.json())
      .then(data => {
        this.salesReport = data.data;
        this.salesReport = Object.keys(data.data).sort().reduce(
          (obj, key) => {
            obj[key] = data.data[key];
            return obj
          },
          {}
        );
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
    removeSpace(string) {
      return string.replace(/\s+/g, '');
    }
  }
}
</script>

<style>
</style>
