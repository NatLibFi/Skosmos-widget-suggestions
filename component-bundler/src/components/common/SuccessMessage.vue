<template>
<div>
  <h2>Ehdotus lähetetty onnistuneesti</h2>
  <p>Ehdotuksesi siirtyy nyt YSO-kokouksen käsiteltäväksi.</p>
  <p v-if="!suggestionUrl || suggestionUrl.length === 0">
    Voit seurata ehdotusten käsittelyä
    <a :href="url">täällä</a>.
  </p>
  <p v-if="suggestionUrl && suggestionUrl.length > 0">
    Voit seurata ehdotuksesi käsittelyn etenemistä
    <a :href="suggestionUrl">täältä</a>.
  </p>
</div>
</template>

<script>
export default {
  props: {
    suggestionUrl: String,
    url: String
  }

}
</script>

<style scoped>
h2 {
  margin-top: 6px;
}

p {
  margin-top: 16px;
}

a {
  color: #00748f;
  font-weight: 500;
}
</style>
