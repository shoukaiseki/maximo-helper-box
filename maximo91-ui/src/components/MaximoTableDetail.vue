<template>
  <div class="maximo-table-detail">
    <div class="tdbar"></div>
    <div class="td-inner">
      <div class="sectionBS">
        <table role="presentation" class="so so-wide">
          <tbody>
            <tr>
              <!-- 标题栏 -->
              <td class="hbouter">
                <table cellspacing="0" cellpadding="0" style="width:100%;" role="presentation">
                  <tbody>
                    <tr>
                      <td class="tdhb hbsh" valign="middle">
                        <h2 style="display:inline">
                          <label class="text tdst">
                            {{ title }}
                          </label>
                        </h2>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <!-- 内容区域 -->
              <td class="std sectioncol" valign="top">
                <slot></slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '详细信息'
  }
})
</script>

<style scoped>
.maximo-table-detail {
  width: 100%;
  background: #ffffff;
}

.tdbar {
  border-bottom: 1px solid #E0E0E0;
  background: #ffffff;
  padding-top: 6px;
  margin-top: -1px;
}

.td-inner {
  width: 100%;
}

.sectionBS {
  margin: 0px !important;
}

.so {
  border-collapse: separate;
  margin: 0px 0px 12px;
}

.so-wide {
  width: 100% !important;
}

.hbouter {
  padding: 0px;
  white-space: nowrap;
  display: block;
}

.tdhb.hbsh {
  padding: 0px;
  white-space: nowrap;
  color: #161616;
  font-size: 14px;
  font-family: 'MaximoBase-Bold', Arial, sans-serif;
}

.text.tdst {
  color: #000000;
  text-align: left;
  margin-inline-start: 1rem;
  padding-top: 3px;
  display: block;
  padding-left: 2px;
}

.std.sectioncol {
  padding: 0px !important;
  padding-inline-end: 16px !important;
  vertical-align: top;
}
</style>
