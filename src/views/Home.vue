<template>
  <div class="home">
    <h1>{{ $t('covidStat') }}</h1> &nbsp;

    <input class="search" type="text" v-model="search" @keyup="filterData()" :placeholder="$t('country')"><br>

    <small>{{ today | date }}</small>

    <div v-if="loading" class="centerd">
      <LoadingIndicator />
    </div>

    <div class="content">
      <ul>
        <li v-for="(item, index) in filteredList" :key="index">
          <router-link :to="'/details/' + item.country" class="item">
            <h3>{{ item.country }} : <span class="success">{{ item.cases }}</span> </h3>
            <span>{{ $t('recovery') }} : <b>{{ item.recovered }}</b></span> | 
            <span>{{ $t('deaths') }} : <b>{{ item.deaths }}</b></span><br>
          </router-link>
        </li>
      </ul>
      <div>
        <small>{{ $t('language') }}</small>:<br>
        <span class="language" @click="changeLocal('fr')">{{ $t('french') }}</span> | <span class="language" @click="changeLocal('en')">{{ $t('English') }}</span>
        <hr>
        <a @click="sortByCases()">
          <span style="cursor:pointer">{{ $t('sortByCases')}}</span> &nbsp;
          <span v-if="ascending">&uarr;</span>
          <span v-if="!ascending">&darr;</span>
        </a><br>
        <a @click="sortByDeaths()">
          <span style="cursor:pointer">{{ $t('sortByDeaths')}}</span> &nbsp;
          <span v-if="ascending">&uarr;</span>
          <span v-if="!ascending">&darr;</span>
        </a><br>
        <a @click="sortByRecovered()">
          <span style="cursor:pointer">{{ $t('sortByRecovered')}}</span> &nbsp;
          <span v-if="ascending">&uarr;</span>
          <span v-if="!ascending">&darr;</span>
        </a><br>
      </div>
    </div>
  </div>
</template>

<style scope>
  .home {
    padding: 10px;
  }
  .home ul {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 5px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .home ul li a {
    display: inline-block;
    background-color: #C4EC88;
    width: 90%;
    padding: 10px;
    cursor: pointer;
  }
  .home ul li a:hover {
    background-color: #9AC553;
  }
  .home .centered {
    text-align: center;
  }
  .home > ul > li > .item > h3,
  .home > h1,
  .home > h2,
  .home > h3 {
    margin: 1px;
  }
  .home > h1 {
    display: inline-block;
  }
  .home .search {
    outline: none;
    border: none;
    border-bottom: 1px solid #9AC553;
    color: #9AC553;
    background-color: transparent;
  }
  .home a {
    text-decoration: none;
    color: #333;
  }
  .home .content {
    display: grid;
    grid-template-columns: 3fr 1fr;
  }
  .home .content ul {
    height: calc(100vh - 100px);
    overflow: auto;
    margin-right: 10px;
  }
  .home .language {
    cursor: pointer;
    display: inline-block;
    border-radius: 2px;
  }
  .home .language:hover {
    background-color: #9AC553;
  }
  .home hr {
    border: none;
    border-bottom: 1px solid #9AC553;
  }
</style>

<script>
import LoadingIndicator from "../components/LoadingIndicator";
import i18n from '../i18n';
import Axios from "axios";
import _ from 'lodash';

export default {
  name: 'Home',
  components: {
    LoadingIndicator,
  },
  data : function() {
    return {
      search : null,
      countries : [],
      today : new Date(),
      loading : false,
      filteredList : [],
      ascending : true,
    }
  },
  created() {
    this.loading = true;
    return Axios.get('https://corona.lmao.ninja/countries')
      .then(res => {
        this.countries = res.data;
        this.filteredList = res.data;
      })
      .catch(err => console.log(err))
      .finally(() => {
        this.loading = false;
      })
  },
  methods: {
    filterData : function (value) {
      const v = value || this.search;
      this.filteredList = this.countries.filter(item => {
          return item.country.toLowerCase().indexOf(v.toLowerCase()) > -1
        });
    },
    changeLocal : function (local) {
      i18n.locale = local;
    },
    sortByCases : function () {
      this.ascending = !this.ascending;
      const order = this.ascending ? 'asc' : 'desc';
      this.filteredList = _.orderBy(this.filteredList, 'cases', order);
    },
    sortByDeaths : function () {
      this.ascending = !this.ascending;
      const order = this.ascending ? 'asc' : 'desc';
      this.filteredList = _.orderBy(this.filteredList, 'deaths', order);
    },
    sortByRecovered : function () {
      this.ascending = !this.ascending;
      const order = this.ascending ? 'asc' : 'desc';
      this.filteredList = _.orderBy(this.filteredList, 'recovered', order);
    }
  }
}
</script>
