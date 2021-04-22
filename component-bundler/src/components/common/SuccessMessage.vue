<template>
<div>
  <h2>{{ $t('messages.success.h2') }}</h2>
  <p>{{ $t('messages.success.p_1') }}</p>
  <p v-if="!suggestionUrl || suggestionUrl.length === 0">
    {{ $t('messages.success.p_2a') }}
    <a :href="url">{{ $t('messages.success.p_2b') }}</a>.
  </p>
  <p v-if="suggestionUrl && suggestionUrl.length > 0">
    {{ $t('messages.success.p_2a') }}
    <a target="_blank" :href="suggestionUrl">{{ $t('messages.success.p_2b') }}</a>.
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
