<script setup lang="ts">
import type { ApiEndpoint, ApiField } from '~/utils/api-catalog'
import { buildCurl, buildEndpointMarkdown, findApiGroup, pick } from '~/utils/api-catalog'
import { docPath } from '~/utils/docs'
import DocsCopyMarkdown from '~/components/docs/DocsCopyMarkdown.vue'

const props = defineProps<{ endpoint: ApiEndpoint }>()

const { t, locale } = useI18n()
const localePath = useLocalePath()
const copied = ref<'curl' | 'json' | ''>('')
const group = computed(() => findApiGroup(props.endpoint.slug))

const curl = computed(() => buildCurl(props.endpoint))
const headers = computed(() => (props.endpoint.headers || []).filter(f => f.loc === 'header'))
const query = computed(() => (props.endpoint.params || []).filter(f => f.loc === 'query'))
const pathParams = computed(() => (props.endpoint.params || []).filter(f => f.loc === 'path'))
const body = computed(() => props.endpoint.body || [])
const authLabel = computed(() => t(`docs.api.auth_${props.endpoint.auth}`))
const codeTab = ref<'curl' | 'json'>('curl')
const markdown = computed(() => buildEndpointMarkdown(props.endpoint, locale.value, {
  auth: authLabel.value,
  headers: t('docs.api.headers'),
  query: t('docs.api.query'),
  path: t('docs.api.path'),
  body: t('docs.api.body'),
  errors: t('docs.api.errors'),
  curl: t('docs.api.md_curl'),
  response: t('docs.api.md_response'),
  name: t('docs.api.md_name'),
  type: t('docs.api.md_type'),
  required: t('docs.api.md_required'),
  desc: t('docs.api.md_desc'),
  yes: t('docs.api.md_yes'),
  no: t('docs.api.md_no'),
}))

const toc = computed(() => {
  const items: { id: string; text: string; depth: number }[] = []
  if (headers.value.length) items.push({ id: 'headers', text: t('docs.api.headers'), depth: 2 })
  if (pathParams.value.length) items.push({ id: 'path', text: t('docs.api.path'), depth: 2 })
  if (query.value.length) items.push({ id: 'query', text: t('docs.api.query'), depth: 2 })
  if (body.value.length) items.push({ id: 'body', text: t('docs.api.body'), depth: 2 })
  items.push({ id: 'response', text: t('docs.api.responses'), depth: 2 })
  if (props.endpoint.errors?.length) items.push({ id: 'errors', text: t('docs.api.errors'), depth: 2 })
  return items
})

const docsToc = useDocsToc()
watchEffect(() => {
  docsToc.value = toc.value
})
onUnmounted(() => {
  docsToc.value = []
})

async function copy(kind: 'curl' | 'json') {
  const text = kind === 'curl' ? curl.value : props.endpoint.responseJson
  try {
    await navigator.clipboard.writeText(text)
    copied.value = kind
    setTimeout(() => {
      if (copied.value === kind) copied.value = ''
    }, 1600)
  }
  catch { /* ignore */ }
}

function loc(field: ApiField) {
  return pick(field.desc, locale.value)
}
</script>

<template>
  <article class="docs-prose docs-api-page">
    <p class="docs-crumb">
      <NuxtLink :to="localePath(docPath('api'))">{{ t('docs.api.crumb') }}</NuxtLink>
      <span v-if="group && group.slug !== 'api-healthz'" aria-hidden="true">›</span>
      <span v-if="group && group.slug !== 'api-healthz'">{{ pick(group.title, locale) }}</span>
    </p>
    <div class="docs-ep-title">
      <span class="docs-method" :class="`is-${endpoint.method.toLowerCase()}`">{{ endpoint.method }}</span>
      <h1>{{ pick(endpoint.title, locale) }}</h1>
    </div>
    <p class="docs-ep-pathline">
      <code class="docs-ep-path">{{ endpoint.path }}</code>
      <span class="docs-ep-auth">{{ authLabel }}</span>
    </p>
    <div class="docs-page-actions">
      <DocsCopyMarkdown :markdown="markdown" />
    </div>
    <p class="docs-lead">{{ pick(endpoint.summary, locale) }}</p>

    <div class="docs-api">
      <div class="docs-api-spec">
        <section v-if="headers.length" id="headers">
          <h2>{{ t('docs.api.headers') }}</h2>
          <p class="docs-api-in">In: header</p>
          <div class="docs-fields">
            <div v-for="field in headers" :key="field.name" class="docs-field">
              <div class="docs-field-head">
                <span class="docs-field-name">{{ field.name }}<span v-if="field.required" class="docs-req">*</span></span>
                <span class="docs-field-type">{{ field.type }}</span>
              </div>
              <p class="docs-field-desc">{{ loc(field) }}</p>
            </div>
          </div>
        </section>

        <section v-if="pathParams.length" id="path">
          <h2>{{ t('docs.api.path') }}</h2>
          <p class="docs-api-in">In: path</p>
          <div class="docs-fields">
            <div v-for="field in pathParams" :key="field.name" class="docs-field">
              <div class="docs-field-head">
                <span class="docs-field-name">{{ field.name }}<span v-if="field.required" class="docs-req">*</span></span>
                <span class="docs-field-type">{{ field.type }}</span>
              </div>
              <p class="docs-field-desc">{{ loc(field) }}</p>
            </div>
          </div>
        </section>

        <section v-if="query.length" id="query">
          <h2>{{ t('docs.api.query') }}</h2>
          <p class="docs-api-in">In: query</p>
          <div class="docs-fields">
            <div v-for="field in query" :key="field.name" class="docs-field">
              <div class="docs-field-head">
                <span class="docs-field-name">{{ field.name }}<span v-if="field.required" class="docs-req">*</span></span>
                <span class="docs-field-type">{{ field.type }}</span>
              </div>
              <p class="docs-field-desc">{{ loc(field) }}</p>
            </div>
          </div>
        </section>

        <section v-if="body.length" id="body">
          <h2>{{ t('docs.api.body') }}</h2>
          <p class="docs-api-in">{{ endpoint.contentType || 'application/json' }}</p>
          <div class="docs-fields">
            <div v-for="field in body" :key="field.name" class="docs-field">
              <div class="docs-field-head">
                <span class="docs-field-name">{{ field.name }}<span v-if="field.required" class="docs-req">*</span></span>
                <span class="docs-field-type">{{ field.type }}</span>
              </div>
              <p class="docs-field-desc">{{ loc(field) }}</p>
            </div>
          </div>
        </section>

        <section v-if="endpoint.errors?.length" id="errors" class="docs-api-errors-wide">
          <h2>{{ t('docs.api.errors') }}</h2>
          <div class="docs-fields">
            <div v-for="err in endpoint.errors" :key="err.message" class="docs-field">
              <div class="docs-field-head">
                <span class="docs-field-name">{{ err.message }}</span>
                <span class="docs-field-type">message</span>
              </div>
              <p class="docs-field-desc">{{ pick(err.desc, locale) }}</p>
            </div>
          </div>
        </section>
      </div>

      <aside class="docs-api-code" id="response">
        <div class="docs-code-card">
          <div class="docs-code-tabs">
            <button type="button" :class="{ 'is-on': codeTab === 'curl' }" @click="codeTab = 'curl'">cURL</button>
            <button type="button" :class="{ 'is-on': codeTab === 'json' }" @click="codeTab = 'json'">
              <span class="docs-resp-code">200</span>
              JSON
            </button>
            <button type="button" class="docs-code-copy" @click="copy(codeTab)">
              {{ copied === codeTab ? t('docs.api.copied') : t('docs.api.copy') }}
            </button>
          </div>
          <pre v-show="codeTab === 'curl'"><code>{{ curl }}</code></pre>
          <pre v-show="codeTab === 'json'"><code>{{ endpoint.responseJson }}</code></pre>
        </div>
        <p v-if="endpoint.responseNote" class="docs-api-note">{{ pick(endpoint.responseNote, locale) }}</p>
      </aside>
    </div>
  </article>
</template>
