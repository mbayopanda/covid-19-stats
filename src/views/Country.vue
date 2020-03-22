<template>
  <div class="country">
    <router-link to="/">&larr; Retour</router-link><br>

    <small>{{ today | date }}</small>

    <div v-if="loading" class="centerd">
      <LoadingIndicator />
    </div>

    <div class="card" v-if="!loading">
      <h3>{{ country.country }}</h3>

      <div class="rate">
        <div>
          <h2>{{ country.cases }}</h2>
          <span>{{ $t('cases') }}</span>
        </div>
        <div>
          <h2>{{ country.todayCases }}</h2>
          <span>{{ $t('todayCases') }}</span>
        </div>
        <div>
          <h2>{{ country.deaths }}</h2>
          <span>{{ $t('deaths') }}</span>
        </div>
        <div>
          <h2>{{ country.todayDeaths }}</h2>
          <span>{{ $t('todayDeaths') }}</span>
        </div>
        <div>
          <h2>{{ country.recovered }}</h2>
          <span>{{ $t('recovery') }}</span>
        </div>
        <div>
          <h2>{{ country.active }}</h2>
          <span>{{ $t('active') }}</span>
        </div>
        <div>
          <h2>{{ country.critical }}</h2>
          <span>{{ $t('critical') }}</span>
        </div>
        <div>
          <h2>{{ country.casesPerOneMillion }}</h2>
          <span>{{ $t('casesPerOneMillion') }}</span>
        </div>
      </div>

      <div class="rate2">
        <div class="bg-danger">
          <h2>{{ country.percentageDeaths }}%</h2>
          <span>{{ $t('deathsPercentage') }}</span>
        </div>
        <div class="bg-warning">
          <h2>{{ country.percentageActive }}%</h2>
          <span>{{ $t('activePercentage') }}</span>
        </div>
        <div class="bg-success">
          <h2>{{ country.percentageRecovered }}%</h2>
          <span>{{ $t('recoveredPercentage') }}</span>
        </div>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
  .country > .card {
    padding: 10px;
    margin: 10px auto;
    border: 1px solid #C4EC88;
  }

  .card > .rate {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-flow: row;
  }
  .card > .rate > div {
    text-align: center;
    padding: 10px;
    border-bottom: 1px solid #C4EC88;
  }
  .card > .rate2 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-flow: row;
  }
  .card > .rate2 > div {
    text-align: center;
    padding: 10px;
  }
  .card > h3 {
    font-size: 3em;
    text-align: center;
  }
</style>

<script>
import Axios from 'axios'
import LoadingIndicator from '../components/LoadingIndicator'

export default {
  name: 'Country',
  components: {
    LoadingIndicator
  },
  data: function () {
    return {
      country : {},
      loading : false,
      today : new Date()
    }
  },
  created() {
    this.loading = true;
    return Axios.get('https://corona.lmao.ninja/countries')
      .then(res => {
        [this.country] = res.data.filter(item => {
          return item.country.toLowerCase().indexOf(this.$route.params.country.toLowerCase()) > -1
        });

        this.country.percentageDeaths = Number((this.country.deaths / this.country.cases) * 100, 2).toFixed(2);
        this.country.percentageRecovered = Number((this.country.recovered / this.country.cases) * 100, 2).toFixed(2);
        this.country.percentageActive = Number((this.country.active / this.country.cases) * 100, 2).toFixed(2);
      })
      .catch(err => console.log(err))
      .finally(() => {
        this.loading = false;
      })
  },
}
</script>