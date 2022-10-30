<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#" @click="currentView.change('HomePage')">Menu</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" @click="currentView.change('HomePage')" href="#">Accueil</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" @click="currentView.change('AppSale')" href="#">Ventes</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" @click="currentView.change('AppRegisterOperations')" href="#">Opérations de caisse</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" @click="currentView.change('AppSalesReport')" href="#">Rapports de ventes</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" @click="$token.reConnectGoogle()" href="#">Se reconnecter</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <KeepAlive>
    <component :is="currentView.value" />
  </KeepAlive>

<!-- TOAST -->
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <div v-for="(toast, index) in toaster.toasts" class="toast show" role="alert" aria-live="assertive" aria-atomic="true" :key="index+'toast'">
      <div class="toast-header">
        <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false">
        <rect width="100%" height="100%" :fill="toast.color"></rect>
      </svg>
      <strong class="me-auto">{{toast.title}}</strong>
      <small class="text-muted">{{toast.time}}</small>
      <button type="button" class="btn-close" @click="toaster.delete(toast)" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      <a v-if="toast.link" :href="toast.link" target="_blank">{{toast.message}}</a>
      <div v-if="!toast.link">{{toast.message}}</div>
    </div>
  </div>
</div>

</template>

<script>
import HomePage from './components/HomePage.vue'
import AppSale from './components/AppSale.vue'
import AppRegisterOperations from './components/AppRegisterOperations.vue'
import AppSalesReport from './components/AppSalesReport.vue'

import { computed } from 'vue'

export default {
  name: 'App',
  components: {
    HomePage,
    AppSale,
    AppRegisterOperations,
    AppSalesReport
  },
  data() {
    return {
      currentView: {
        value : 'HomePage',
        change: function(newPage) {
          this.value = newPage;
        }
      },
      toasts: [],
      toaster: {
        toasts: [],
        add: function(title, message, color='#007aff', link=null) {
            var date = new Date();
            var toast = {
              title: title,
              time: date.getHours()+":"+date.getMinutes(),
              message: message,
              color: color,
              link: link
            }
            this.toasts.push(toast);
        },
        delete: function(toastToDelete) {
            this.toasts = this.toasts.filter(toast => toast != toastToDelete);
        }
      }
    }
  },
  methods: {},
  provide() {
    return {
      toaster: computed(() => this.toaster),
      currentView: computed(() => this.currentView),
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50;
  margin-top: 60px; */
}

.round-button {
  border-radius: 50% !important;
}
</style>
