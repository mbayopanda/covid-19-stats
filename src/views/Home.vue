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
          <router-link :to="'/details/' + item.countryRegion" class="item">
            <i :class="'flag-icon flag-icon-' + item.flag"></i> <small v-if="item.provinceState">{{ item.provinceState }}</small>
            <h3>{{ item.countryRegion }} : <span class="success">{{ item.confirmed }}</span> </h3>
            <span>{{ $t('recovery') }} : <b>{{ item.recovered }}</b></span> | 
            <span>{{ $t('deaths') }} : <b>{{ item.deaths }}</b></span><br>
          </router-link>
        </li>
      </ul>
      <div>
        <small>{{ $t('language') }}</small>:<br>
        <span class="language" @click="changeLocal('fr')">{{ $t('french') }}</span> | <span class="language" @click="changeLocal('en')">{{ $t('english') }}</span> | 
        <span class="language" @click="changeLocal('lg')">{{ $t('lingala') }}</span> | <span class="language" @click="changeLocal('sw')">{{ $t('swahili') }}</span>
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
  .home .content ul {
    height: calc(100vh - 100px);
    overflow: auto;
    margin-right: 10px;
  }
  .home .language {
    cursor: pointer;
    display: inline-block;
    border-bottom: 3px solid transparent;
  }
  .home .language:hover {
    border-bottom: 3px solid #9AC553;
  }
  .home hr {
    border: none;
    margin: 10px auto;
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
    return Axios.get('https://covid19.mathdro.id/api/confirmed')
      .then(res => {
        this.countries = res.data.map(i => {
          i.iso2 = i.countryRegion === 'Congo (Kinshasa)' ? 'cd' : i.iso2;
          i.flag = i.iso2 ? String(i.iso2).toLowerCase() : '';
          return i;
        });
        this.filteredList = this.countries;
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
          return item.countryRegion.toLowerCase().indexOf(v.toLowerCase()) > -1
        });
    },
    changeLocal : function (local) {
      i18n.locale = local;
    },
    sortByCases : function () {
      this.ascending = !this.ascending;
      const order = this.ascending ? 'asc' : 'desc';
      this.filteredList = _.orderBy(this.filteredList, 'confirmed', order);
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
