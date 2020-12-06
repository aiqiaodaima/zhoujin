<template>
  <a-checkbox-group v-if="tagType === 'checkbox'" :disabled="disabled">
    <a-checkbox v-for="(item, key) in partyOptions" :key="key" :value="item.PARTY_CODE">{{
      item.PARTY_NAME
    }}</a-checkbox>
  </a-checkbox-group>

  <a-select
    v-else-if="tagType === 'select'"
    :disabled="disabled"
    :default-value="defaultValue"
    v-model="selected"
    :mode="mode"
    :placeholder="placeholder"
    allowClear
  >
    <a-select-option v-for="(item, index) in partyOptions" :key="item.PARTY_CODE" :value="item.PARTY_NAME">
      <span style="display: inline-block; width: 100%" :title="item.PARTY_NAME">
        {{ item.PARTY_NAME }}
      </span>
    </a-select-option>
  </a-select>
</template>

<script>
import { forEach } from 'lodash'
import { getAction } from '../../api/manage'
import * as customizeConfigs from '../../customizeConfig'
export default {
  name: 'BiRelPartyTag',
  props: {
    prjCode: {
      type: String,
      require: true,
    },
    relType: {
      type: String,
      require: true,
    },
    mode: {
      type: String,
      default: 'multiple'
    },
    placeholder: String,
    disabled: Boolean,
    type: String,
    options: Array,
    defaultValue: Array,
  },
  data() {
    let customizeEnv = customizeConfigs.customizeEnv
    return {
      customizeEnv: customizeEnv,
      partyOptions: [],
      tagType: '',
      selected: [],
    }
  },
  created() {
    if (!this.type || this.type === 'list_multi') {
      this.tagType = 'select'
    } else {
      this.tagType = this.type
    }
    //获取字典数据
    this.initPartyData()
  },
  watch: {
    options: function (val) {
      this.setCurrentOptions(val)
    },
    defaultValue: function (val) {
      this.selected = val
    },
  },
  methods: {
    initPartyData() {
      if (this.options && this.options.length > 0) {
        this.partyOptions = [...this.options]
      } else {
        getAction('/prj/rel/list?prjCode=' + this.prjCode + '&relType=' + this.relType, { pageSize: 99999 }).then(
          (res) => {
            if (res.success) {
              let param = {
                prjCode: this.prjCode,
              }
              if (this.customizeEnv === 'zrt') {
                //中融添加  选项
                // 查询所有受益人
                getAction('/prj/rel/getRelPartyListInfo', param).then((res) => {
                  console.log('受益人信息={}', res)
                  if (res.success) {
                    for (let item of res.result.list) {
                      this.partyOptions.push({ PARTY_CODE: item.partyCode, PARTY_NAME: item.partyName })
                    }
                    // 初始受益人的所有受益人
                    if (!res.result.initialBeneficiary) {
                      this.partyOptions.push({ PARTY_CODE: 'zr001', PARTY_NAME: '初始受益人' })
                    }
                    // 追加受益人的所有受益人
                    if (!res.result.additionalBeneficiary) {
                      this.partyOptions.push({ PARTY_CODE: 'zr002', PARTY_NAME: '追加受益人' })
                    }
                    // 被激活全体受益人
                      this.partyOptions.push({ PARTY_CODE: 'zr003', PARTY_NAME: '被激活全体受益人' })
                  }
                })
              } else {
                this.partyOptions = res.result.records
              }
              console.log('this.partyOptions', this.partyOptions)
            }
          }
        )
      }
    },
    setCurrentOptions(partyOptions) {
      this.partyOptions = partyOptions
    },
    getCurrentOptions() {
      return this.partyOptions
    },
    getValue() {
      return this.selected
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
}
</script>