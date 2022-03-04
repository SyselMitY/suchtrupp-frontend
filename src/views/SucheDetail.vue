<template>
  <div class="sucheDetail" v-if="suche">
    <h2>{{ suche.name }}</h2>
    <h3>Ortsbezeichnung: {{ suche.bereich }}</h3>

    <div class="suchgruppen">
      <!-- <b-jumbotron v-for="suchtrupp in suche.suchtruppList"
                   :key="suchtrupp.id"
                   header-level=4
                   :header="'Suchtrupp '+suchtrupp.leiter"
                   :lead="'Suchtrupp bestehend aus '+suchtrupp.anzahlPersonen+' Personen'">
        <div v-for="meldung in suchtrupp.meldungen" :key="meldung.id">
          <hr>
          <h4>Meldung</h4>
          <p>Tags: {{ meldung.tags }}</p>
          <p>Zeitpunkt: {{ meldung.timestamp }}</p>
          <p>{{ meldung.beschreibung }}</p>
        </div>

        <div class="meldungform">
          <hr>
          <h4>Meldung hinzufügen</h4>
          <b-form-group label="Tags" :label-for="'formtags'+suchtrupp.id">
            <b-form-input :id="'formtags'+suchtrupp.id" v-model="newMeldung[suchtrupp.id].tags"></b-form-input>
          </b-form-group>
          <b-form-group label="Beschreibung" :label-for="'formdesc'+suchtrupp.id">
            <b-form-input :id="'formtags'+suchtrupp.id" v-model="newMeldung[suchtrupp.id].description"></b-form-input>
          </b-form-group>
          <b-button @click="postNewMessage(suchtrupp.id)" variant="success">Absenden</b-button>
        </div>
      </b-jumbotron> -->

<b-form-group label="Anfangszeit" label-for="anfangszeit">
          <b-form-input
            id="anfangszeit"
            v-model="anfangszeit"
            type="datetime-local"
          ></b-form-input>
        </b-form-group>
<b-form-group label="Endzeit" label-for="endzeit">
          <b-form-input
            id="endzeit"
            v-model="endzeit"
            type="datetime-local"
          ></b-form-input>
        </b-form-group>

        <b-button @click="clearAnfangAndEndzeit()" variant="success">Bereich zurücksetzen</b-button>
        

      <div
        class="suchtrupp-container"
        :style="`grid-template-rows: repeat(${
          suche.suchtruppList.length + 1
        },6rem)`"
      >
        <div class="time-divisions">
          <span
            v-for="(timeDivision, index) in timeDivisions"
            :key="'d' + index"
            :style="`left: ${timeDivision.fraction * 90}%`"
          >
            {{ new Date(timeDivision.timestamp).toLocaleTimeString() }}</span
          >
        </div>
        <div
          class="suchtrupp-name"
          v-for="(suchtrupp, index) in suche.suchtruppList"
          :key="'n' + index"
          :style="`grid-column: 1; grid-row: ${index + 2};`"
          @click="openSuchtruppModal(suchtrupp)"
        >
          <h4>{{ suchtrupp.leiter }} [{{ suchtrupp.anzahlPersonen }}]</h4>
        </div>

        <div
          class="suchtrupp-content"
          v-for="(suchtrupp, index) in suche.suchtruppList"
          :key="'c' + index"
          :style="`grid-column: 2; grid-row: ${index + 2};`"
        >
          <div
            class="such-meldung"
            v-for="meldung in suchtrupp.meldungen"
            :key="'m' + meldung.id"
            :style="`left:${
              getTimestampLocation(new Date(meldung.timestamp).getTime()) * 90
            }%`"
            @click="openMeldungModal(meldung)"
          >
            {{ meldung.tags }}
          </div>
        </div>
        <div
          class="suchtrupp-add-meldung-button"
          v-for="(suchtrupp, index) in suche.suchtruppList"
          :key="'addmeldung' + index"
          :style="`grid-row: ${index + 2};`"
          @click="openAddMeldungModal(suchtrupp)"
        >
          <b-button variant="success">Neue Meldung</b-button>
        </div>
      </div>
    </div>

    <b-jumbotron
      header-level="4"
      header="Neue Meldung"
      lead="Neue Meldung eintragen"
    >
      <b-form @submit.prevent="postNewMessage()">
        <b-form-group label="Mannschaft/Ressource" label-for="formsuchtrupp">
          <b-form-select
            v-model="newMeldung.suchtrupp"
            :options="suchtruppsWithId"
            id="formsuchtrupp"
            required
          />
        </b-form-group>
        <b-form-group label="Schlagwort" label-for="formtags">
          <b-form-input
            required
            id="formtags"
            v-model="newMeldung.tags"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Beschreibung" label-for="formdesc">
          <b-form-input
            id="formdesc"
            v-model="newMeldung.description"
            required
          ></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="success">Absenden</b-button>
      </b-form>
    </b-jumbotron>

    <b-jumbotron
      header-level="4"
      header="Neue Mannschaft/Ressource"
      lead="Neue Mannschaft/Ressource erstellen"
    >
      <b-form-group label="Bezeichnung" label-for="formleiter">
        <b-form-input id="formleiter" v-model="newGroup.leader"></b-form-input>
      </b-form-group>
      <b-form-group label="Anzahl Personen" label-for="formpersons">
        <b-form-input
          type="number"
          id="formpersons"
          v-model="newGroup.persons"
        ></b-form-input>
      </b-form-group>
      <b-button @click="postNewGroup()" variant="success">Absenden</b-button>
    </b-jumbotron>

    <b-modal id="meldung-modal">
      <p>Tags: {{ meldung.tags }}</p>
      <p>Zeitpunkt: {{ new Date(meldung.timestamp).toLocaleTimeString() }}</p>
      <p>{{ meldung.beschreibung }}</p>
    </b-modal>

    <b-modal id="mannschaft-modal">
      <h4>Mannschaft/Resource</h4>

      <p>Bezeichnung: {{ shownSuchtrupp.leiter }}</p>
      <p>Anzahl Personen: {{ shownSuchtrupp.anzahlPersonen }}</p>
    </b-modal>

    <b-modal ok-disabled id="add-meldung-modal">
      <h4>Meldung hinzufügen</h4>

      <b-form @submit.prevent="postNewMessage()">
        <b-form-group label="Mannschaft/Ressource" label-for="formsuchtrupp">
          <b-form-select
            v-model="newMeldung.suchtrupp"
            :options="suchtruppsWithId"
            id="formsuchtrupp"
            required
          />
        </b-form-group>
        <b-form-group label="Schlagwort" label-for="formtags">
          <b-form-input
            required
            id="formtags"
            v-model="newMeldung.tags"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Beschreibung" label-for="formdesc">
          <b-form-input
            id="formdesc"
            v-model="newMeldung.description"
            required
          ></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="success">Absenden</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
function linearInterpolate(before, after, atPoint) {
  return {
    fraction: atPoint,
    timestamp: new Date(before + (after - before) * atPoint),
  };
}

export default {
  name: "SucheDetail",
  props: ["id"],
  data() {
    return {
      suche: undefined,
      newMeldung: {
        suchtrupp: undefined,
        tags: "",
        description: "",
      },
      newGroup: { leader: "", persons: 0 },
      meldung: { timestamp: new Date(), tags: "", description: "" },
      shownSuchtrupp: {},
      anfangszeit: undefined,
      endzeit: undefined,
    };
  },
  computed: {
    timeDivisions() {
      let timeDivisions = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

      return timeDivisions.map((fraction) =>
        linearInterpolate(
          this.earliestTimestamp,
          this.latestTimestamp,
          fraction
        )
      );
    },
    suchtruppsWithId() {
      return this.suche.suchtruppList.map((suchtrupp) => {
        return {
          text: suchtrupp.leiter,
          value: suchtrupp.id,
        };
      });
    },
    latestTimestamp() {
      let calculated = new Date(
        this.allMeldungen.map((meldung) => meldung.timestamp).sort()[
          this.allMeldungen.length - 1
        ]
      ).getTime();
      return new Date(this.endzeit).getTime() || calculated;
    },
    earliestTimestamp() {
      let calculated = new Date(
        this.allMeldungen.map((meldung) => meldung.timestamp).sort()[0]
      ).getTime();
      return new Date(this.anfangszeit).getTime() || calculated;
    },
    allMeldungen() {
      return this.suche.suchtruppList
        .map((suchtrupp) => suchtrupp.meldungen)
        .flat();
    },
  },
  async mounted() {
    let response = await fetch(
      "http://" + window.location.hostname + "/api/suche?id=" + this.id
    );
    let suche = await response.json();
    suche.suchtruppList.forEach(
      (suchtrupp) =>
        (this.newMeldung[suchtrupp.id] = { tags: "", description: "" })
    );
    this.suche = suche;
  },
  methods: {
    getTimestampLocation(timestamp) {
      return (
        (timestamp - this.earliestTimestamp) /
        (this.latestTimestamp - this.earliestTimestamp)
      );
    },
    clearAnfangAndEndzeit() {
      this.anfangszeit = undefined;
      this.endzeit = undefined;
    },
    openMeldungModal(meldung) {
      this.meldung = meldung;
      this.$bvModal.show("meldung-modal");
    },
    openAddMeldungModal(suchtrupp) {
      this.newMeldung.suchtrupp = suchtrupp.id;
      this.$bvModal.show("add-meldung-modal");
    },
    openSuchtruppModal(suchtrupp) {
      this.$bvModal.show("mannschaft-modal");
      this.shownSuchtrupp = suchtrupp;
    },
    async postNewMessage() {
      let messageBody = {
        tags: this.newMeldung.tags,
        beschreibung: this.newMeldung.description,
      };
      await fetch(
        "http://" +
          window.location.hostname +
          "/api/meldungen/" +
          this.newMeldung.suchtrupp,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageBody),
        }
      );
      this.newMeldung.tags = "";
      this.newMeldung.description = "";
      window.location.reload();
    },
    async postNewGroup() {
      let messageBody = {
        leiter: this.newGroup.leader,
        anzahlPersonen: this.newGroup.persons,
      };
      await fetch(
        "http://" +
          window.location.hostname +
          "/api/suchtrupps/" +
          this.suche.id,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageBody),
        }
      );
      window.location.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
.sucheDetail {
  padding: 0 5vw;
}

.suchtrupp-container {
  display: grid;
  grid-template-columns: 10rem 1fr 8rem;

  & > * {
    border: solid 2px black;
  }
}

.suchtrupp-name {
  cursor: pointer;
}

.suchtrupp-meldung-add-button {
  grid-column: 2;
  color: green;
}

.time-divisions {
  grid-column: 2;
  grid-row: 1;
  position: relative;
  & > span {
    border-left: solid 2px black;
    position: absolute;
  }
}

.suchtrupp-content {
  position: relative;
  display: flex;
  align-items: center;
}

.such-meldung {
  position: absolute;
  width: 4rem;
  height: 2rem;
  border-radius: 3px;
  background-color: #ddd;
  border: solid 1px black;
}
</style>