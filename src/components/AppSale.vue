<template>
  <div class="container mt-3">
    <h2>VENTES
      <button class="btn btn-primary btn-sm round-button" type="button" data-bs-toggle="collapse" data-bs-target="#salesInfo" aria-expanded="false" aria-controls="salesInfo">
        <i class="bi bi-info-lg"></i>
      </button>
    </h2>
    <div class="card text-bg-primary collapse m-4" id="salesInfo">
      <div class="card-body">
          <p class="card-text">Permet d'enregistrer les ventes dans la feuille de calcul google.</p>
          <p class="card-text">Séléctionnez "générer une facture" afin de récuperer une facture en PDF</p>
        </div>
    </div>

    <div class="row mb-3 d-flex align-items-center">
      <div class="form-group col-auto">
        <label for="inputDate" >Date</label>
        <input v-model="date" type="date" class="form-control" id="inputDate">
      </div>
      <div class="form-group col-auto">
        <label for="inputHour" >Heure</label>
        <div class="input-group">
          <input v-model="hour" type="time" class="form-control" id="inputHour" :disabled="lockedTime">
          <span class="input-group-text">
            <button class='btn btn-primary btn-sm' @click="lockedTime = !lockedTime; updateTime()">
              <i class="bi" :class="lockedTime ? 'bi-lock' : 'bi-unlock'"></i>
            </button>
          </span>
        </div>
      </div>
    </div>

    <hr>

    <h3>Produits</h3>
    <div class="row mb-3" v-for="(sale, saleIndex) in sales" :key="saleIndex+'sale'">
      <div class="col">
        <select class="form-select" id="inputCreator" v-model='sale.creator'>
          <option value="" disabled selected>Créateur</option>
          <option :value="creator.value" v-for="(creator, creatorId) in creatorList" :key="creatorId+'creator'">{{ creator.label }}</option>
        </select>
        <div v-if="!sale.validation.creator" class="text-danger">
          Veuillez choisir un créateur
        </div>
      </div>
      <div class="col">
        <label for="inputProduct" class="visually-hidden">Produit</label>
        <div class="dropdown">
          <input autocomplete="off" v-model="sale.product" type="text" class="form-control" id="inputProduct" placeholder="Description du produit"
          @keyup.enter="enter(saleIndex)"
          @keyup.down="down()"
          @keyup.up="up()"
          @input="change(saleIndex)"
          @focus="updateSuggestions(saleIndex)"
          >
          <div v-if="!sale.validation.product" class="text-danger">
            Veuillez décrir le produit
          </div>
          <ul class="dropdown-menu" v-bind:class="{'show':openSuggestion(saleIndex)}">
            <li v-for="(suggestion, index) in matches(saleIndex)" :key="index+'suggestion'">
              <a @click="suggestionClick(index, saleIndex)" class="dropdown-item" v-bind:class="{'active': isActive(index)}" href="#">{{ suggestion }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="col">
        <div class="input-group col">
          <input v-model="sale.price" type="number" step="0.01" class="form-control" id="inputPrice" placeholder="prix">
          <span class="input-group-text">€</span>
        </div>
        <div v-if="!sale.validation.price" class="text-danger">
          Veuillez définir un prix
        </div>
      </div>
      <div class="col">
        <button class="btn btn-danger me-3" @click="deleteSaleRow(sale)">X</button>
        <button class="btn btn-success" @click="duplicateSaleRow(sale)"><i class="bi bi-clipboard-plus"></i></button>
      </div>
    </div>
    <div class="row mb-3">
      <div class="input-group col">
        <button class="btn btn-success" @click="addSaleRow()">Ajouter un produit</button>
      </div>
    </div>
    <div class="row mb-3">
      <div class="input-group col-sm-6">
        <span class="input-group-text">TOTAL</span>
        <input v-model="totalSalesCurrency" type="number" step="any" class="form-control" placeholder="total" disabled>
        <span class="input-group-text">€</span>
      </div>
    </div>

    <hr>

    <div class="row">
      <h3>Paiements</h3>
    </div>
    <div class="row mb-3" v-for="(payment, paymentId) in payments" :key="paymentId+'payment'">
      <div class="col">
        <select class="form-select" v-model='payment.mode'>
          <option value="" disabled selected>Moyen de paiement</option>
          <option :value="paymentOption.value" v-for="(paymentOption, optionId) in paymentOptions" :key="optionId+'option'">{{ paymentOption.label }}</option>
        </select>
        <div v-if="!payment.validation.mode" class="text-danger">
          Veuillez choisir un moyen de paiement
        </div>
      </div>
      <div class="col">
        <div class="input-group col">
          <input v-model="payment.amount" class="form-control" type="number" step="0.01" placeholder="montant">
          <span class="input-group-text">€</span>
        </div>
        <div v-if="!payment.validation.amount" class="text-danger">
          Veuillez choisir un montant
        </div>
      </div>
      <div class="col">
        <button class="btn btn-danger" @click="deletePaymentRow(payment)">X</button>
      </div>
      <div class="col">
        <button v-if="payment.mode == 'Espece' & paymentReste < 0" class="btn btn-danger" @click="solveChange(payment)">Rendu monnaie = {{ formatToEuro(-paymentReste) }}</button>
      </div>
    </div>
    <div class="row mb-3">
      <div class="input-group col">
        <button class="btn btn-success" @click="addPaymentRow()">Ajouter un payment</button>
      </div>
    </div>
    <div class="row mb-3">
      <div v-if="totalSales > 0" :class="['alert', paymentReste > 0 ? 'alert-warning' : 'alert-success']">
        <button class="btn btn-primary" @click="addLeftToLastPayment()"><i class="bi bi-arrow-up-circle"></i> Reste : {{formatToEuro(paymentReste)}} </button>
      </div>
    </div>
    <div class="collapse mb-3" :class="billInfo.generateBill ? 'show' : ''" id="collapseBillInfo">
      <div class="card card-body">
        <h3>Informations de facturation</h3>
        <input v-model="billInfo.name" type="text" class="form-control mb-1" placeholder="Nom">
        <input v-model="billInfo.adress" type="text" class="form-control mb-1" placeholder="N° et rue">
        <input v-model="billInfo.cityCode" type="text" class="form-control mb-1" placeholder="Code Postal">
        <input v-model="billInfo.city" type="text" class="form-control mb-1" placeholder="Ville">
      </div>
    </div>
    <div class="row mb-3">
      <div class="d-grid gap-2 col-8">
        <button class="btn btn-primary" @click="onSubmit()">
          <span v-if="sendingSale" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{sendingSale ? '' : 'Valider'}}
        </button>
      </div>
      <div class="col-auto d-flex align-items-center">
        <div class="form-check">
          <input class="form-check-input" v-model="billInfo.generateBill" type="checkbox" value="" id="flexCheckDefault">
          <label class="form-check-label" for="flexCheckDefault">
            génerer une facture
          </label>
        </div>
      </div>
    </div>
  </div>

  
  
</template>

<script>
import currency from "currency.js"
import Sale from "../models/Sale.js"
import Payment from "../models/Payment.js"

const EURO = value => currency(value, { symbol: '€', decimal: ',', separator: '.' });

export default {
  inject: ['toaster'],
  data() {
    return {
      appURL: this.$params.backUrl,
      date: '',
      hour: '',
      lockedTime: true,
      sales: [new Sale()],
      payments: [new Payment()],
      paymentOptions: [
        {'label': 'CB', 'value': 'CB'},
        {'label': 'Espece', 'value': 'Espece'},
        {'label': 'Chéque', 'value': 'Chéque'},
        {'label': 'Carte cadeau', 'value': 'Carte cadeau'},
      ],
      suggestions: [],
      creatorList: [],
      sendingSale: false,
      current: 0,
      open: false,
      hasFormError: false,
      timer: "",
      billInfo: {
        generateBill: false,
        name: "",
        adress: "",
        cityCode: "",
        city: "",
      }
    }
  },
  created() {
    this.timer = setInterval(this.updateTime, 60000);
  },
  methods: {
    addSaleRow() {
      this.sales.push(new Sale())
    },
    addPaymentRow() {
      this.payments.push(new Payment())
    },
    deleteSaleRow(saleToDelete) {
      //this.sales.$remove(sale);
      this.sales = this.sales.filter(sale => sale != saleToDelete);
    },
    duplicateSaleRow(sale)  {
      let newSale = Object.assign({}, sale);
      this.sales.push(newSale);
    },
    deletePaymentRow(paymentToDelete) {
      //this.payments.$remove(payment);
      this.payments = this.payments.filter(payment => payment != paymentToDelete);
    },
    updateTime() {
      if (this.lockedTime) {
        var date = new Date();
        var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 )).toISOString();

        this.hour = dateString.substring(11, 16);
      }
    },
    //When enter pressed on the input
    enter(saleIndex) {
      this.sales[saleIndex].product = this.matches(saleIndex)[this.current];
      this.open = false;
    },

    //When up pressed while suggestions are open
    up() {
      if(this.current > 0)
      this.current--;
    },

    //When up pressed while suggestions are open
    down() {
      if(this.current < this.suggestions.length - 1)
      this.current++;
    },

    //For highlighting element
    isActive(index) {
      return index === this.current;
    },

    //When the user changes input
    change() {
      if (this.open == false) {
        this.open = true;
        this.current = 0;
      }
    },

    //When one of the suggestion is clicked
    suggestionClick(index, saleIndex) {
      this.sales[saleIndex].product = this.matches(saleIndex)[index];
      this.open = false;
    },

    updateSuggestions(saleIndex) {
      var creator = this.sales[saleIndex].creator;
      if (creator) {
        this.getSuggestionFromSheet(creator);
      }
    },
    getSuggestionFromSheet(creator) {
      const requestOptions = {
        redirect: "follow",
        method: 'GET',
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        }
      };
      fetch(this.appURL + "?q=suggestion&creator=" +creator, requestOptions)
      .then(response => response.json())
      .then(data => {
        this.suggestions = data.data.map(String);
      });
    },
    openSuggestion(saleIndex) {
      return this.sales[saleIndex].product !== "" &&
      this.matches(saleIndex).length != 0 &&
      this.open === true;
    },
    matches(saleIndex) {
      return this.suggestions.filter((str) => {
        return str.indexOf(this.sales[saleIndex].product) >= 0;
      });
    },
    formatToEuro(number) {
      return EURO(number).format();
    },
    solveChange(payment) {
      payment.amount = currency(payment.amount).add(this.paymentReste).value;
    },
    addLeftToLastPayment() {
      var leftToPay = this.paymentReste;
      var lastPayment = this.payments.pop();
      lastPayment.amount = currency(lastPayment.amount).add(leftToPay).value;
      this.payments.push(lastPayment);
    },
    resetForm() {
      this.sales = [new Sale()];
      this.payments = [new Payment()];
      this.billInfo = {generateBill: false, name: "", adress: "", cityCode: "", city: ""};
    },
    onSubmit() {
      this.hasFormError = false;
      //check validation
      this.sales.forEach(sale => {
        if(!sale.checkValidation()) {
          this.hasFormError = true;
        }
      });

      this.payments.forEach(payment => {
        if(!payment.checkValidation()) {
          this.hasFormError = true;
        }
      });

      if (this.hasFormError) {
        this.toaster.add('Erreur', "Il semble qu'il y ait une erreur", '#dc3545');
        return;
      }

      this.sendingSale = true;
      var formattedData = {
        date : this.date,
        hour : this.hour,
        sales: this.sales,
        payments: this.payments,
        billInfo: this.billInfo
      };
      // POST request using fetch with error handling
      const requestOptions = {
        redirect: "follow",
        method: 'POST',
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(formattedData)
      };
      fetch(this.appURL, requestOptions)
      .then(async response => {
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = response.status;
          return Promise.reject(error);
        }
        const data = await response.json();
        this.sendingSale = false;
        this.resetForm();
        this.postId = data.id;
        this.toaster.add('Succés', 'La vente a bien été ajoutée', '#198754');
        if(data.data) {
          this.toaster.add('Facture', 'Lien vers la facture', '#198754', data.data);
        }
      })
      .catch(error => {
        this.sendingSale = false;
        this.errorMessage = error;
        this.toaster.add('Erreur', "Il semble qu'une erreur ait eu lieu lors de l'envoie de la vente", '#dc3545');
        console.error('There was an error!', error);
      });
    },
  },
  computed: {
    totalSales() {
      const result = this.sales.reduce((accumulator, obj) => {
        return currency(accumulator).add(obj.price);
      }, 0);
      return result.value;
    },
    totalSalesCurrency() {
      const result = this.sales.reduce((accumulator, obj) => {
        return currency(accumulator).add(obj.price);
      }, 0);
      return result;
    },
    paymentReste() {
      const totalPayment = this.payments.reduce((accumulator, payment) => {
        return currency(payment.amount).add(accumulator);
      }, 0)
      return currency(this.totalSales).subtract(totalPayment).value;
    },
  },
  mounted() {
    var date = new Date();
    var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 )).toISOString();
    
    this.date = dateString.substring(0, 10);
    this.hour = dateString.substring(11, 16);

    const requestOptions = {
          redirect: "follow",
          method: 'GET',
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          muteHttpExceptions: true,
        };
        fetch(this.appURL + "?q=listCreator", requestOptions)
        .then(response => response.json())
        .then(data => {
          this.creatorList = [];
          data.data.forEach(item => {
            this.creatorList.push({'label': item, 'value': item})
          });
          
          this.creatorList.sort((a, b) => a.label.localeCompare(b.label))
        });
    
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
}
</script>

<style>

</style>
