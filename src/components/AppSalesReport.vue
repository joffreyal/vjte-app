<template>
  <div class="container mt-3">

    <h2>RAPPORT DE VENTES
      <button class="btn btn-primary btn-sm round-button" type="button" data-bs-toggle="collapse" data-bs-target="#salesInfo" aria-expanded="false" aria-controls="salesInfo">
        <i class="bi bi-info-lg"></i>
      </button>
    </h2>
    <div class="card text-bg-primary collapse m-4" id="salesInfo">
      <div class="card-body">
          <p class="card-text">Permet d'afficher toutes les ventes pour chaque créateur dans la période selectionnée</p>
          <p class="card-text">Séléctionnez "sauvegarder en pdf" afin de génerer les rapports en PDF</p>
        </div>
    </div>

    <div class="row d-flex align-items-center">
      <div class="input-group col m-1">
        <span class="input-group-text">De</span>
        <input v-model="salesReportStart" type="date" class="form-control" :max="maxDate">
      </div>
      <div class="input-group col m-1">
        <span class="input-group-text">A</span>
        <input v-model="salesReportEnd" type="date" class="form-control" :max="maxDate">
      </div>
      <div class="col-auto m-1">
        <button class="btn btn-primary" @click="getSalesReport()">
          <span v-if="loadingReport" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{loadingReport ? '' : 'Génerer le rapport'}}
        </button>
      </div>
      <div class="col m-1">
        <div class="form-check">
          <input class="form-check-input" v-model="saveReport" type="checkbox" value="" id="flexCheckDefault" @change="!saveReport ? sendAllMail = false : ''">
          <label class="form-check-label" for="flexCheckDefault">
            sauvegarder en pdf
          </label>
        </div>
      </div>
      <div v-if="saveReport" class="col m-1">
        <div class="form-check">
          <input class="form-check-input" v-model="sendAllMail" type="checkbox" value="" id="flexCheckDefault2">
          <label class="form-check-label" for="flexCheckDefault2">
            envoyer les pdf par mail
          </label>
        </div>
      </div>
    </div>
    <div class="row">
      <div v-for='(creator, index) in salesReport' class="card" :key="removeSpace(index)+'sales'">
        <div class="card-body">
          <button class="btn btn-light me-1" type="button" data-bs-toggle="collapse" :data-bs-target="'#saleTable'+removeSpace(index)">{{index}}</button>
          <a v-if="creator.reportFile" class="me-1" :href="creator.reportFile.reportUrl" target="_blank">rapport PDF</a>
          <button v-if="creator.reportFile" class="btn me-1" :class="creator.reportFile.emailSend===true ? 'btn-outline-success' : 'btn-outline-info'" type="button" @click="sendSaleReport(index, creator.reportFile)" :disabled="creator.reportFile.emailSend">
            <span v-if="creator.reportFile.emailSend==='sending'" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <i v-if="creator.reportFile.emailSend===true" class="bi bi-check text-success"></i>
            {{creator.reportFile.emailSend===true ? 'mail envoyé' : 'envoyer par mail'}}
            
          </button>
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
  inject: ['toaster'],
  data() {
    return {
      appURL: this.$params.backUrl,
      salesReportStart: '',
      salesReportEnd: '',
      maxDate: '',
      salesReport: [],
      loadingReport: false,
      saveReport: false,
      sendAllMail: false
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
      fetch(this.appURL + "?q=salesreport&startDate=" +this.salesReportStart+ '&endDate='+this.salesReportEnd+ '&save='+this.saveReport+ '&sendMail='+this.sendAllMail, requestOptions)
      .then(async response => {
        

        if (!response.ok) {
          // get error message from body or default to response status
          const error = response.status;
          return Promise.reject(error);
        }

        const data = await response.json()
        this.salesReport = data.data;
        this.salesReport = Object.keys(data.data).sort().reduce(
          (obj, key) => {
            obj[key] = data.data[key];
            return obj
          },
          {}
        );
        
        Object.entries(this.salesReport).forEach(([key, creatorReport]) => {
          if (creatorReport.reportFile) {
            this.salesReport[key].reportFile.emailSend = false;
            if (this.sendAllMail) {
              this.salesReport[key].reportFile.emailSend = true;
            }
          }
        })
        
        this.loadingReport = false;
      })
      .catch(error => {
        this.loadingReport = false;
        this.errorMessage = error;
        this.toaster.add('Erreur', "Il semble qu'une erreur ait eu lieu lors de la récupération des rapports", '#dc3545');
        console.error('There was an error!', error);
      });
    },
    sendSaleReport(creator, reportFile) {
      const requestOptions = {
        redirect: "follow",
        method: 'GET',
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        }
      };
      reportFile.emailSend = 'sending';
      fetch(this.appURL + "?q=sendsalesreport&creator=" +encodeURI(creator)+ '&fileid='+reportFile.driveId, requestOptions)
      .then(async response => {
        
        if (!response.ok) {
          // get error message from body or default to response status
          const error = response.status;
          return Promise.reject(error);
        }
        reportFile.emailSend = true;
      })
      .catch(error => {
        this.loadingReport = false;
        this.errorMessage = error;
        this.toaster.add('Erreur', "Il semble qu'une erreur ait eu lieu lors de l'envoie du mail", '#dc3545');
        console.error('There was an error!', error);
        reportFile.emailSend = 'error';
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
  },
  mounted() {
    var date = new Date();
    var startDate = new Date();
    startDate.setDate(1);
    var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 )).toISOString();
    var startDateString = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000 )).toISOString();
    this.salesReportEnd = dateString.substring(0, 10);
    this.maxDate = dateString.substring(0, 10);
    this.salesReportStart = startDateString.substring(0, 10);
  }
}
</script>

<style>
</style>
