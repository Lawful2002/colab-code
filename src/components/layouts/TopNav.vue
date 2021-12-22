<template>
  <div class="topnav d-sm-flex justify-content-between">
    <select
      v-on:change="langChange"
      class="form-select"
      aria-label="Select language"
      ref="lang"
    >
      <option value="cpp" selected>C++</option>
      <option value="javascript">Javascript</option>
      <option value="python">Python</option>
      <option value="java">Java</option>
      <option value="csharp">C#</option>
    </select>
    <div class="action-buttons d-sm-flex justify-content-between">
      <button class="round btn btn-primary">Upload File</button>
      <button class="round btn btn-primary">Download</button>
      <button class="round btn btn-primary">Run</button>
      <button class="round btn btn-primary">More Options</button>
    </div>
  </div>
</template>

<style scoped>
.topnav {
  background-color: #003367;
  padding: 20px;
}
.round {
  border-radius: 20px;
}
.form-select {
  width: 150px;
}
.action-buttons {
  width: 35%;
}
</style>

<script>
export default {
  emits: ['change-language'],
  mounted() {
    if(localStorage.getItem('code')){
      this.$refs.lang.value = localStorage.getItem('lang')
    }
    this.langChange()
  },
  data() {
    return {};
  },
  methods: {
    langChange() {
      let language = this.$refs.lang.value;
      this.$emit('change-language', language);
    },
  },
};
</script>