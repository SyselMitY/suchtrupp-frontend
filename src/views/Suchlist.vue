<template>
  <div class="suchen">
    <b-card class="sucheCard" v-for="suche in suchen" :key="suche.id" :title="suche.name"
            @click="$router.push('/sucheDetail/'+suche.id)">
      <b-card-text>Suche im bereich {{ suche.bereich }}</b-card-text>
    </b-card>

    <b-card class="sucheCard" title="Neue Suche">
      <b-card-text>Neuen Einsatz erstellen</b-card-text>
      <b-form-group label="Bezeichnung" label-for="formname">
        <b-form-input id="formname" v-model="newSearch.name"></b-form-input>
      </b-form-group>
      <b-form-group label="Ortsbezeichnung" label-for="formarea">
        <b-form-input id="formarea" v-model="newSearch.area"></b-form-input>
      </b-form-group>
      <b-button @click="postNewSearch()" variant="success">Absenden</b-button>
    </b-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      suchen: undefined,
      newSearch: {name: "", area: ""}
    }
  },
  async mounted() {
    let response = await fetch("http://" + window.location.hostname + "/api/suchen")
    this.suchen = await response.json();
  },
  methods: {
    async postNewSearch() {
      let messageBody = {
        name: this.newSearch.name,
        bereich: this.newSearch.area
      }
      await fetch("http://" + window.location.hostname + "/api/suchen", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(messageBody)
      });
      window.location.reload()
    }
  }
}
</script>

<style scoped>
.sucheCard {
  width: 80vw;
  margin: 4rem 10vw;
  box-shadow: 3px 3px 10px;
  cursor: pointer;
}
</style>