<template>
  <el-container class="layout">
    <el-aside width="200px" class="aside">
      <div class="logo">
        <el-icon :size="22"><Box /></el-icon>
        <span>SKS 导入工具</span>
      </div>
      <el-menu :default-active="activeMenu" class="side-menu" @select="key => activeMenu = key">
        <el-menu-item index="plan">
          <el-icon><Document /></el-icon>
          <span>导入计划</span>
        </el-menu-item>
        <el-menu-item index="run">
          <el-icon><VideoPlay /></el-icon>
          <span>执行监控</span>
          <el-badge v-if="isRunning" is-dot class="running-dot" />
        </el-menu-item>
        <el-menu-item index="result">
          <el-icon><DataAnalysis /></el-icon>
          <span>执行结果</span>
          <el-tag v-if="runResults.length" size="small" type="info">{{ runResults.length }}</el-tag>
        </el-menu-item>
        <el-menu-item index="env">
          <el-icon><Setting /></el-icon>
          <span>环境配置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container class="main-container">
      <el-header class="header">
        <h2>{{ menuTitles[activeMenu] }}</h2>
        <div class="header-right">
          <div class="plan-controls">
            <span class="plan-label">计划:</span>
            <el-select
              v-model="currentPlanId"
              filterable
              allow-create
              default-first-option
              placeholder="选择或输入新建计划名"
              style="width: 240px"
              @change="onPlanSelectChange"
            >
              <el-option
                v-for="p in plans"
                :key="p.id"
                :label="p.name"
                :value="p.id"
              >
                <div class="plan-option">
                  <span class="plan-option-name">
                    <el-icon v-if="defaultPlanId === p.id" style="color: #e6a23c; margin-right: 4px" title="默认计划"><StarFilled /></el-icon>{{ p.name }}<span v-if="p.env" class="plan-option-env"> [{{ p.env }}]</span>
                  </span>
                  <span class="plan-option-actions">
                    <el-icon class="plan-action-icon" title="设为默认" @click.stop="setDefaultPlan(p)"><Star /></el-icon>
                    <el-icon class="plan-action-icon" title="重命名" @click.stop="renamePlan(p)"><Edit /></el-icon>
                    <el-icon class="plan-action-icon plan-action-del" title="删除" @click.stop="deletePlanById(p)"><Delete /></el-icon>
                  </span>
                </div>
              </el-option>
              <template #footer>
                <el-button type="primary" plain size="small" style="width: 100%" @click="newPlan">
                  <el-icon style="margin-right: 4px"><Plus /></el-icon>新建计划
                </el-button>
              </template>
            </el-select>
          </div>
          <div class="env-controls">
            <el-switch
              v-model="envSwitchAllowed"
              active-text="允许切换环境"
              inline-prompt
              style="margin-right: 12px"
              @change="onEnvSwitchChange"
            />
            <el-select v-model="currentEnv" placeholder="选择环境" style="width: 260px" :disabled="!envSwitchAllowed">
              <el-option
                v-for="env in envs"
                :key="env.key"
                :label="`${env.key} (${env.baseUrl})`"
                :value="env.key"
              />
            </el-select>
          </div>
        </div>
      </el-header>

      <el-main class="main">
        <!-- 导入计划 -->
        <el-card v-show="activeMenu === 'plan'" class="plan-card">
          <template #header>
            <div class="card-header">
              <span>导入计划</span>
              <div>
                <el-button size="small" :disabled="!hasPlan" @click="savePlan">保存</el-button>
                <el-button size="small" :disabled="!loadedPlanId" @click="loadPlan(loadedPlanId)">加载</el-button>
                <el-button size="small" :disabled="!hasPlan" @click="exportPlan">导出JSON</el-button>
              </div>
            </div>
          </template>

          <el-form :model="plan" label-width="80px">
            <el-form-item label="计划名称">
              <el-input v-model="plan.name" disabled placeholder="通过顶部下拉新建计划" />
            </el-form-item>
            <el-form-item label="并发数">
              <el-input-number v-model="plan.concurrency" :min="1" :max="10" />
            </el-form-item>
            <el-form-item label="参考环境">
              <el-input :model-value="plan.env || '-'" disabled>
                <template #append>执行以顶部所选环境为准</template>
              </el-input>
            </el-form-item>
          </el-form>

          <el-table :data="plan.tasks" border style="width: 100%">
            <el-table-column type="index" width="50" label="#" />
            <el-table-column prop="importType" label="导入类型" width="160">
              <template #default="{ row }">
                <div class="type-cell">
                  <el-select v-model="row.importType" size="small" @change="onImportTypeChange(row)">
                    <el-option label="对象配置" value="object" />
                    <el-option label="应用信息" value="appinfo" />
                    <el-option label="应用XML" value="presentation" />
                    <el-option label="域配置" value="domain" />
                    <el-option label="AutoKey" value="autokey" />
                    <el-option label="自动化脚本" value="script" />
                    <el-option label="对象结构" value="intobject" />
                  </el-select>
                  <el-tooltip content="查看接口说明" placement="top">
                    <el-icon class="help-icon" @click="showRemark(row.importType)"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="path" label="目录路径" min-width="280">
              <template #default="{ row }">
                <div style="display: flex; gap: 4px; align-items: center">
                  <el-input v-model="row.path" size="small" placeholder="输入目录路径" style="flex: 1" />
                  <el-button size="small" @click="browseDir(row)">选择</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="extFilter" label="扩展名" width="100">
              <template #default="{ row }">
                <el-input v-model="row.extFilter" size="small" />
              </template>
            </el-table-column>
            <el-table-column prop="recursive" label="递归" width="70">
              <template #default="{ row }">
                <el-checkbox v-model="row.recursive" />
              </template>
            </el-table-column>
            <el-table-column label="URL 参数" width="230">
              <template #default="{ row }">
                <div class="param-cell">
                  <span class="param-summary" :title="paramSummary(row)">{{ paramSummary(row) }}</span>
                  <el-button size="small" link type="primary" @click="openParamDialog(row)">编辑</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="enabled" label="启用" width="70">
              <template #default="{ row }">
                <el-checkbox v-model="row.enabled" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ $index }">
                <el-button size="small" @click="moveTask($index, -1)" :disabled="$index === 0">上移</el-button>
                <el-button size="small" @click="moveTask($index, 1)" :disabled="$index === plan.tasks.length - 1">下移</el-button>
                <el-button size="small" type="danger" @click="removeTask($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="table-footer">
            <el-button type="primary" :disabled="!hasPlan" @click="addTask">添加任务</el-button>
            <el-button type="success" :disabled="!hasPlan || isRunning" @click="startRun">开始执行</el-button>
          </div>

          <!-- URL 参数编辑 -->
          <el-dialog v-model="paramDialogVisible" :title="paramDialogTitle" width="760px">
            <el-table :data="paramRows" size="small" border>
              <el-table-column label="启用" width="60" align="center">
                <template #default="{ row }">
                  <el-checkbox v-model="row.enabled" />
                </template>
              </el-table-column>
              <el-table-column label="参数名" width="190">
                <template #default="{ row }">
                  <el-input v-model="row.name" size="small" placeholder="参数名" />
                </template>
              </el-table-column>
              <el-table-column label="值" width="180">
                <template #default="{ row }">
                  <el-select
                    v-if="row.htmlType === 'select'"
                    v-model="row.value"
                    size="small"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="选择或输入"
                    :disabled="!row.enabled"
                  >
                    <el-option
                      v-for="opt in row.htmlTypeOptions"
                      :key="opt.dictValue"
                      :label="opt.dictLabel"
                      :value="opt.dictValue"
                    />
                  </el-select>
                  <el-select
                    v-else-if="row.htmlType === 'boolSelect'"
                    v-model="row.value"
                    size="small"
                    placeholder="选择 true / false"
                    :disabled="!row.enabled"
                  >
                    <el-option label="true" value="true" />
                    <el-option label="false" value="false" />
                  </el-select>
                  <el-input v-else v-model="row.value" size="small" placeholder="值" :disabled="!row.enabled" />
                </template>
              </el-table-column>
              <el-table-column label="说明" min-width="180">
                <template #default="{ row }">
                  <el-input v-model="row.description" size="small" placeholder="说明（可自行填写）" />
                </template>
              </el-table-column>
              <el-table-column width="60">
                <template #default="{ $index }">
                  <el-button size="small" type="danger" link @click="paramRows.splice($index, 1)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="param-footer">
              <el-button size="small" @click="addParamRow">添加参数</el-button>
              <el-button size="small" @click="resetDefaultParams">恢复默认参数</el-button>
              <span class="param-tip">取消勾选「启用」可保留参数配置但不发送</span>
            </div>

            <template #footer>
              <el-button @click="paramDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="saveParamDialog">确定</el-button>
            </template>
          </el-dialog>

          <!-- 接口说明 -->
          <el-dialog
            v-model="remarkDialogVisible"
            :title="remarkTitle"
            width="760px"
            :fullscreen="remarkFullscreen"
            @closed="remarkFullscreen = false"
          >
            <template #header>
              <div class="remark-dialog-header">
                <span class="remark-dialog-title">{{ remarkTitle }}</span>
                <el-tooltip :content="remarkFullscreen ? '还原' : '最大化'" placement="bottom">
                  <el-icon class="remark-dialog-expand" @click="remarkFullscreen = !remarkFullscreen">
                    <FullScreen v-if="!remarkFullscreen" />
                    <Aim v-else />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
            <div class="remark-content" :class="{ 'is-fullscreen': remarkFullscreen }" v-html="remarkHtml"></div>
          </el-dialog>

          <!-- 失败 / 忽略 行明细 -->
          <el-dialog
            v-model="detailDialogVisible"
            :title="'行明细：' + detailTitle"
            width="900px"
            append-to-body
          >
            <el-table :data="detailRows" size="small" border max-height="60vh">
              <el-table-column label="状态" width="90">
                <template #default="{ row }">
                  <el-tag size="small" :type="row.status === 'failed' ? 'danger' : 'info'">
                    {{ row.status === 'failed' ? '失败' : '忽略' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column type="index" width="50" label="#" />
              <el-table-column prop="objectName" label="对象" width="150" />
              <el-table-column prop="ref" label="引用(sks:ref)" min-width="200" show-overflow-tooltip />
              <el-table-column prop="parent" label="所属对象" width="140" show-overflow-tooltip />
              <el-table-column prop="operation" label="操作" width="90" />
              <el-table-column prop="message" label="消息" min-width="220" show-overflow-tooltip />
            </el-table>
          </el-dialog>
        </el-card>

        <!-- 执行监控 -->
        <el-card v-show="activeMenu === 'run'" class="run-card">
          <template #header>
            <div class="card-header">
              <span>执行</span>
              <div>
                <el-button type="primary" :disabled="!hasPlan || isRunning" @click="startRun">开始执行</el-button>
                <el-button type="danger" @click="stopRun" :disabled="!isRunning">停止</el-button>
              </div>
            </div>
          </template>

          <div v-if="isRunning || runResults.length > 0 || logs.length > 0">
            <el-progress :percentage="totalProgress" :status="progressStatus" />
            <div class="progress-info">
              总进度: {{ completedTasks }}/{{ enabledTasks }} 任务
            </div>

            <div v-if="currentTask" class="current-task-progress">
              <el-divider content-position="left">当前任务</el-divider>
              <div class="progress-info">
                <span>{{ currentTaskLabel }}</span>
                <span>{{ currentTask.done }}/{{ currentTask.total }} 文件，成功 {{ currentTask.success }}，失败 {{ currentTask.failed }}</span>
              </div>
              <el-progress :percentage="currentTaskProgress" :status="currentTaskProgressStatus" />
            </div>

            <el-divider />

            <div class="log-container">
              <div v-for="(log, index) in logs" :key="index" class="log-line">
                {{ log }}
              </div>
            </div>
          </div>

          <el-empty v-else description="暂无执行记录" />
        </el-card>

        <!-- 执行结果 -->
        <el-card v-show="activeMenu === 'result'" class="result-card">
          <template #header>
            <div class="card-header">
              <span>执行结果</span>
              <el-button size="small" @click="copyResults">复制原始JSON</el-button>
            </div>
          </template>

          <el-table v-if="runResults.length" :data="runResults" border>
            <el-table-column type="expand">
              <template #default="{ row }">
                <div class="file-result-wrap">
                  <el-table v-if="row.files && row.files.length" :data="row.files" size="small" border>
                    <el-table-column label="文件" min-width="260" show-overflow-tooltip>
                      <template #default="{ row: file }">{{ baseName(file.fileName) }}</template>
                    </el-table-column>
                    <el-table-column label="状态" width="100">
                      <template #default="{ row: file }">
                        <el-tag size="small" :type="fileTagType(file)">{{ fileStatusText(file) }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="成功" width="80">
                      <template #default="{ row: file }">{{ fileCount(file, 'successSum') }}</template>
                    </el-table-column>
                    <el-table-column label="失败" width="80">
                      <template #default="{ row: file }">
                        <span :class="{ 'fail-count': fileFailSum(file) > 0 }">{{ fileFailSum(file) }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="忽略" width="80">
                      <template #default="{ row: file }">{{ fileCount(file, 'ignoreSum') }}</template>
                    </el-table-column>
                    <el-table-column label="消息" min-width="220" show-overflow-tooltip>
                      <template #default="{ row: file }">{{ fileMessage(file) }}</template>
                    </el-table-column>
                    <el-table-column label="明细" width="120">
                      <template #default="{ row: file }">
                        <el-button
                          v-if="detailCount(file) > 0"
                          link
                          :type="fileFailSum(file) > 0 ? 'danger' : 'info'"
                          size="small"
                          @click="openDetails(file)"
                        >明细 ({{ detailCount(file) }})</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-empty v-else description="无文件级记录" :image-size="50" />
                </div>
              </template>
            </el-table-column>
            <el-table-column type="index" width="50" label="#" />
            <el-table-column prop="task.importType" label="导入类型" width="120" />
            <el-table-column prop="task.path" label="目录" show-overflow-tooltip />
            <el-table-column prop="result.total" label="文件数" width="80" />
            <el-table-column prop="result.successCount" label="成功" width="70" />
            <el-table-column prop="result.failedCount" label="失败" width="70" />
            <el-table-column label="行失败" width="90">
              <template #default="{ row }">
                <span :class="{ 'fail-count': childFailCount(row) > 0 }">{{ childFailCount(row) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="result.duration" label="耗时(ms)" width="100" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="taskTagType(row)">{{ taskStatusText(row) }}</el-tag>
              </template>
            </el-table-column>
          </el-table>

          <el-empty v-else description="暂无执行结果" />
        </el-card>

        <!-- 环境配置 -->
        <el-card v-show="activeMenu === 'env'" class="env-card">
          <template #header>
            <div class="card-header">
              <span>环境列表</span>
              <span class="env-tip">配置文件: ~/.sks/nodeutils/config.json</span>
            </div>
          </template>

          <el-table :data="envs" border>
            <el-table-column prop="key" label="环境" width="150">
              <template #default="{ row }">
                <el-tag v-if="row.key === currentEnv" type="success">{{ row.key }}</el-tag>
                <span v-else>{{ row.key }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="baseUrl" label="baseUrl" show-overflow-tooltip />
            <el-table-column prop="langcode" label="语言" width="100" />
            <el-table-column prop="authType" label="认证方式" width="120" />
          </el-table>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      activeMenu: 'plan',
      menuTitles: {
        plan: '导入计划',
        run: '执行监控',
        result: '执行结果',
        env: '环境配置'
      },
      envs: [],
      currentEnv: '',
      envSwitchAllowed: false,
      lockedEnv: '',
      plans: [],
      currentPlanId: '',
      loadedPlanId: '',
      defaultPlanId: '',
      plan: {
        name: '',
        env: '',
        concurrency: 1,
        tasks: []
      },
      isRunning: false,
      completedTasks: 0,
      currentTask: null,
      enabledTasks: 0,
      logs: [],
      runResults: [],
      eventSource: null,
      importConfig: {},
      importTypeMethod: {
        object: 'importMaxObject',
        appinfo: 'importMaxAppInfo',
        presentation: 'importMaxPresentation',
        domain: 'importMaxDomain',
        autokey: 'importMaxAutoKey',
        script: 'importMaxScript',
        intobject: 'importMaxIntObject'
      },
      paramDialogVisible: false,
      paramTaskIndex: -1,
      paramDialogTitle: 'URL 参数',
      paramRows: [],
      remarkDialogVisible: false,
      remarkTitle: '',
      remarkHtml: '',
      remarkFullscreen: false,
      detailDialogVisible: false,
      detailTitle: '',
      detailRows: []
    };
  },
  computed: {
    hasPlan() {
      return !!(this.plan && this.plan.name);
    },
    totalProgress() {
      if (this.enabledTasks === 0) return 0;
      return Math.round((this.completedTasks / this.enabledTasks) * 100);
    },
    currentTaskProgress() {
      if (!this.currentTask || !this.currentTask.total) return 0;
      return Math.round((this.currentTask.done / this.currentTask.total) * 100);
    },
    currentTaskProgressStatus() {
      if (!this.currentTask) return undefined;
      if (this.currentTask.failed > 0) return 'warning';
      if (this.currentTask.done >= this.currentTask.total && this.currentTask.total > 0) return 'success';
      return undefined;
    },
    currentTaskLabel() {
      if (!this.currentTask) return '';
      const t = this.currentTask;
      return `任务 ${t.index + 1}: ${t.importType} - ${String(t.path).split(/[\\/]/).pop()}`;
    },
    progressStatus() {
      if (this.isRunning) return '';
      if (this.runResults.every(r => r.result?.success)) return 'success';
      return 'exception';
    }
  },
  mounted() {
    this.loadEnvs();
    this.loadImportConfig();
    this.loadPlanList().then(() => {
      // loadPlanList 内部已优先加载默认计划；没有默认计划时才回退到最近修改的计划
      if (!this.loadedPlanId && this.plans.length > 0) {
        this.loadPlan(this.plans[0].id);
      }
    });
  },
  methods: {
    onEnvSwitchChange(allowed) {
      if (allowed) {
        // 记录开启时的环境，关闭时回退，防止切换后忘记改回
        this.lockedEnv = this.currentEnv;
      } else if (this.lockedEnv && this.lockedEnv !== this.currentEnv) {
        this.currentEnv = this.lockedEnv;
        this.$message.info(`已回退到环境: ${this.lockedEnv}`);
      }
    },
    async loadEnvs() {
      try {
        const res = await axios.get('/api/envs');
        if (res.data.success) {
          this.envs = res.data.data;
          this.currentEnv = res.data.currentEnv;
        }
      } catch (error) {
        console.error('加载环境失败:', error);
      }
    },
    async loadImportConfig() {
      try {
        const res = await axios.get('/api/import-config');
        if (res.data.success) {
          this.importConfig = res.data.data || {};
        }
      } catch (error) {
        console.error('加载接口配置失败:', error);
      }
    },
    getTypeConfig(importType) {
      const method = this.importTypeMethod[importType];
      return (method && this.importConfig[method]) || null;
    },
    defaultParamsFor(importType) {
      const item = this.getTypeConfig(importType);
      const result = {};
      if (item && Array.isArray(item.params)) {
        for (const p of item.params) {
          if (!p.name || p.name === '*') continue;
          if (p.default === '' || p.default === null || p.default === undefined) continue;
          result[p.name] = p.default;
        }
      }
      return result;
    },
    onImportTypeChange(row) {
      row.urlParams = this.defaultParamsFor(row.importType);
      row.urlParamMeta = {};
    },
    paramSummary(row) {
      const params = row.urlParams || {};
      const keys = Object.keys(params);
      const disabledCount = Object.values(row.urlParamMeta || {})
        .filter(m => m && m.enabled === false).length;
      let text;
      if (keys.length) {
        text = keys.map(k => `${k}=${params[k]}`).join(', ');
      } else {
        text = disabledCount > 0 ? '未启用任何参数' : '使用接口默认参数';
      }
      if (disabledCount > 0) {
        text += `（${disabledCount} 项未启用）`;
      }
      return text;
    },
    openParamDialog(row) {
      this.paramTaskIndex = this.plan.tasks.indexOf(row);
      const item = this.getTypeConfig(row.importType);
      const defaults = this.defaultParamsFor(row.importType);
      const current = row.urlParams || {};
      const meta = row.urlParamMeta || {};

      const descMap = {};
      const typeMap = {};
      if (item && Array.isArray(item.params)) {
        for (const p of item.params) {
          descMap[p.name] = p.description || '';
          typeMap[p.name] = {
            htmlType: p.htmlType || '',
            htmlTypeOptions: Array.isArray(p.htmlTypeOptions) ? p.htmlTypeOptions : []
          };
        }
      }

      const names = Array.from(new Set([
        ...Object.keys(defaults),
        ...Object.keys(current),
        ...Object.keys(meta)
      ]));
      this.paramRows = names.map(name => {
        const m = meta[name] || {};
        const t = typeMap[name] || {};
        let value;
        if (Object.prototype.hasOwnProperty.call(current, name)) {
          value = current[name];
        } else if (Object.prototype.hasOwnProperty.call(m, 'value')) {
          value = m.value;
        } else {
          value = defaults[name];
        }
        return {
          name,
          value: value === undefined || value === null ? '' : String(value),
          enabled: m.enabled !== false,
          description: m.description !== undefined ? m.description : (descMap[name] || ''),
          htmlType: t.htmlType || '',
          htmlTypeOptions: t.htmlTypeOptions || []
        };
      });

      this.paramDialogTitle = `URL 参数：${String(row.path).split(/[\\/]/).pop() || row.importType}`;
      this.paramDialogVisible = true;
    },
    addParamRow() {
      this.paramRows.push({ name: '', value: '', enabled: true, description: '', htmlType: '', htmlTypeOptions: [] });
    },
    resetDefaultParams() {
      const row = this.plan.tasks[this.paramTaskIndex];
      if (!row) return;
      const item = this.getTypeConfig(row.importType);
      const descMap = {};
      const typeMap = {};
      if (item && Array.isArray(item.params)) {
        for (const p of item.params) {
          descMap[p.name] = p.description || '';
          typeMap[p.name] = {
            htmlType: p.htmlType || '',
            htmlTypeOptions: Array.isArray(p.htmlTypeOptions) ? p.htmlTypeOptions : []
          };
        }
      }
      this.paramRows = Object.entries(this.defaultParamsFor(row.importType)).map(([name, value]) => ({
        name,
        value: String(value),
        enabled: true,
        description: descMap[name] || '',
        htmlType: (typeMap[name] && typeMap[name].htmlType) || '',
        htmlTypeOptions: (typeMap[name] && typeMap[name].htmlTypeOptions) || []
      }));
    },
    coerceParamValue(value) {
      if (typeof value !== 'string') return value;
      const v = value.trim();
      if (v === 'true') return true;
      if (v === 'false') return false;
      if (v !== '' && /^-?\d+(\.\d+)?$/.test(v)) return Number(v);
      return v;
    },
    saveParamDialog() {
      const row = this.plan.tasks[this.paramTaskIndex];
      if (!row) {
        this.paramDialogVisible = false;
        return;
      }
      const params = {};
      const meta = {};
      for (const p of this.paramRows) {
        const name = String(p.name || '').trim();
        if (!name) continue;
        const value = this.coerceParamValue(p.value);
        const description = String(p.description || '').trim();
        if (p.enabled === false) {
          // 未启用：保留名称/值/说明，但不发送
          meta[name] = { enabled: false, description, value };
        } else {
          params[name] = value;
          if (description) {
            meta[name] = { enabled: true, description };
          }
        }
      }
      row.urlParams = params;
      row.urlParamMeta = meta;
      this.paramDialogVisible = false;
    },
    showRemark(importType) {
      const item = this.getTypeConfig(importType);
      if (!item) {
        this.$message.warning('暂无该接口的说明');
        return;
      }
      this.remarkTitle = item.title || item.key;
      this.remarkHtml = item.remarkHtml || '<p>暂无详细说明</p>';
      this.remarkFullscreen = false;
      this.remarkDialogVisible = true;
    },
    async loadPlanList() {
      try {
        const res = await axios.get('/api/plan/list');
        if (res.data.success) {
          this.plans = res.data.data || [];
          this.defaultPlanId = res.data.defaultId || '';
          // 初次加载时，如果有默认计划且未加载过，自动加载
          if (this.defaultPlanId && !this.loadedPlanId) {
            const defaultPlan = this.plans.find(p => p.id === this.defaultPlanId);
            if (defaultPlan) {
              await this.loadPlan(this.defaultPlanId);
            }
          }
        }
      } catch (error) {
        console.error('加载计划列表失败:', error);
      }
    },
    async onPlanSelectChange(val) {
      if (val === this.loadedPlanId) return;
      const exists = this.plans.some(p => p.id === val);
      if (exists) {
        this.loadPlan(val);
      } else {
        // 输入新名称 = 新建计划，立即持久化（名称可重复，后端生成 uuid）
        this.plan = { name: String(val).trim(), env: this.currentEnv, concurrency: 1, tasks: [] };
        this.loadedPlanId = '';
        await this.savePlan();
        await this.reloadAfterCreate();
      }
    },
    async newPlan() {
      try {
        const { value } = await this.$prompt('请输入新计划名称', '新建计划', {
          confirmButtonText: '创建',
          cancelButtonText: '取消',
          inputPattern: /\S+/,
          inputErrorMessage: '名称不能为空'
        });
        const name = String(value).trim();
        this.currentPlanId = name;
        this.plan = { name, env: this.currentEnv, concurrency: 1, tasks: [] };
        this.loadedPlanId = '';
        await this.savePlan();
        await this.reloadAfterCreate();
      } catch (e) {
        // 取消
      }
    },
    async reloadAfterCreate() {
      // 后端已返回 uuid，重新拉取该计划详情并刷新页面显示
      if (this.plan.id) {
        await this.loadPlan(this.plan.id);
      }
      await this.loadPlanList();
    },
    async loadPlan(id) {
      if (!id) return;
      try {
        const res = await axios.get('/api/plan', { params: { id } });
        if (res.data.success && res.data.data) {
          this.plan = res.data.data;
          this.currentPlanId = this.plan.id || id;
          this.loadedPlanId = this.plan.id || id;
          // 计划与环境强关联：plan.env 仅为保存时的参考值，不覆盖当前环境
        }
      } catch (error) {
        this.$message.error('加载计划失败: ' + error.message);
      }
    },
    async savePlan() {
      if (!this.plan.name || !this.plan.name.trim()) {
        this.$message.warning('请先通过顶部下拉或"新建"按钮创建计划');
        return;
      }
      try {
        this.plan.env = this.currentEnv;
        const res = await axios.post('/api/plan', { plan: this.plan });
        if (res.data.success) {
          this.plan.id = res.data.data.id;
          this.loadedPlanId = this.plan.id;
          this.currentPlanId = this.plan.id;
          await this.loadPlanList();
          this.$message.success('计划已保存');
        }
      } catch (error) {
        this.$message.error('保存失败: ' + error.message);
      }
    },
    async setDefaultPlan(p) {
      try {
        await axios.post('/api/plan/default', { id: p.id });
        this.defaultPlanId = p.id;
        this.$message.success(`已将「${p.name}」设为默认计划`);
      } catch (e) {
        this.$message.error('设置失败: ' + (e.response?.data?.message || e.message));
      }
    },
    async renamePlan(p) {
      try {
        const { value } = await this.$prompt('请输入新的计划名称', '重命名计划', {
          inputValue: p.name,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S+/,
          inputErrorMessage: '名称不能为空'
        });
        const newName = String(value).trim();
        if (newName === p.name) return;
        await axios.post('/api/plan/rename', { id: p.id, newName });
        if (this.loadedPlanId === p.id) {
          this.plan.name = newName;
        }
        await this.loadPlanList();
        this.$message.success('计划已重命名');
      } catch (e) {
        if (e && e.response) {
          this.$message.error('重命名失败: ' + (e.response.data?.message || e.message));
        }
      }
    },
    async deletePlanById(p) {
      try {
        await this.$confirm(`确定删除计划「${p.name}」？`, '删除计划', {
          type: 'warning',
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        });
        await axios.delete('/api/plan', { params: { id: p.id } });
        if (this.loadedPlanId === p.id) {
          this.currentPlanId = '';
          this.loadedPlanId = '';
          this.plan = { name: '', env: this.currentEnv, concurrency: 1, tasks: [] };
        }
        await this.loadPlanList();
        this.$message.success('计划已删除');
      } catch (e) {
        if (e && e.response) {
          this.$message.error('删除失败: ' + (e.response.data?.message || e.message));
        }
      }
    },
    exportPlan() {
      const blob = new Blob([JSON.stringify(this.plan, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'import-plan.json';
      a.click();
    },
    addTask() {
      if (!this.hasPlan) {
        this.$message.warning('请先选择或新建计划');
        return;
      }
      this.plan.tasks.push({
        id: Date.now(),
        importType: 'object',
        sourceType: 'directory',
        path: '',
        extFilter: '.json',
        recursive: true,
        logname: '',
        options: {},
        urlParams: this.defaultParamsFor('object'),
        enabled: true
      });
    },
    removeTask(index) {
      this.plan.tasks.splice(index, 1);
    },
    moveTask(index, direction) {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= this.plan.tasks.length) return;
      const temp = this.plan.tasks[index];
      this.plan.tasks[index] = this.plan.tasks[newIndex];
      this.plan.tasks[newIndex] = temp;
    },
    async browseDir(row) {
      try {
        const res = await axios.post('/api/browse/dir');
        if (res.data.success && res.data.path) {
          row.path = res.data.path;
        }
      } catch (e) {
        this.$message.error('选择目录失败: ' + (e.response?.data?.message || e.message));
      }
    },
    async startRun() {
      if (!this.hasPlan) {
        this.$message.warning('请先选择或新建计划');
        return;
      }
      if (!this.currentEnv) {
        this.$message.warning('请先选择环境');
        return;
      }

      const enabledTasks = this.plan.tasks.filter(t => t.enabled);
      if (enabledTasks.length === 0) {
        this.$message.warning('没有启用的任务');
        return;
      }

      this.isRunning = true;
      this.activeMenu = 'run';
      this.completedTasks = 0;
      this.currentTask = null;
      this.enabledTasks = enabledTasks.length;
      this.logs = [];
      this.runResults = [];

      try {
        const response = await fetch('/api/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            env: this.currentEnv,
            tasks: enabledTasks,
            concurrency: this.plan.concurrency
          })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          buffer = parts.pop();

          for (const part of parts) {
            let event = '';
            let data = null;
            for (const line of part.split('\n')) {
              if (line.startsWith('event: ')) event = line.slice(7).trim();
              else if (line.startsWith('data: ')) {
                try { data = JSON.parse(line.slice(6)); } catch (e) { /* 忽略解析失败 */ }
              }
            }
            if (event && data) this.handleEvent(event, data);
          }
        }
      } catch (error) {
        this.addLog(`执行失败: ${error.message}`);
      } finally {
        this.isRunning = false;
      }
    },
    handleEvent(event, data) {
      switch (event) {
        case 'start':
          this.addLog(`开始执行，环境: ${data.env}，任务数: ${data.totalTasks}`);
          break;
        case 'taskStart':
          this.currentTask = {
            index: data.index,
            importType: data.task.importType,
            path: data.task.path,
            total: 0,
            done: 0,
            success: 0,
            failed: 0,
            files: []
          };
          this.addLog(`任务 ${data.index + 1} 开始: ${data.task.importType} - ${data.task.path}`);
          break;
        case 'taskScan':
          if (this.currentTask && this.currentTask.index === data.index) {
            this.currentTask.total = data.totalFiles;
          }
          this.addLog(`  扫描到 ${data.totalFiles} 个文件`);
          break;
        case 'taskComplete':
          this.completedTasks++;
          this.runResults.push({ ...data, files: this.currentTask ? this.currentTask.files : [] });
          this.currentTask = null;
          this.addLog(`任务 ${data.index + 1} 完成: 成功 ${data.result.successCount}, 失败 ${data.result.failedCount}`);
          break;
        case 'taskError':
          this.completedTasks++;
          this.runResults.push({ ...data, files: this.currentTask ? this.currentTask.files : [] });
          this.currentTask = null;
          this.addLog(`任务 ${data.index + 1} 失败: ${data.error}`);
          break;
        case 'taskSkipped':
          this.completedTasks++;
          this.addLog(`任务 ${data.index + 1} 跳过: ${data.reason}`);
          break;
        case 'fileProgress':
          if (this.currentTask && this.currentTask.index === data.index) {
            this.currentTask.done++;
            if (data.status === 'success') this.currentTask.success++;
            else this.currentTask.failed++;
            this.currentTask.files.push({
              fileName: data.fileName,
              status: data.status || 'error',
              message: data.message || '',
              data: data.data || null
            });
          }
          this.addLog(`  文件: ${String(data.fileName).split(/[\\/]/).pop()} - ${data.status === 'success' ? '成功' : '失败'}${data.data && Number(data.data['sks:failSumTotal']) > 0 ? `，行失败 ${data.data['sks:failSumTotal']}` : ''}${data.message && data.status !== 'success' ? '：' + data.message : ''}`);
          break;
        case 'complete':
          this.currentTask = null;
          this.addLog(`全部完成，耗时: ${data.duration}ms`);
          break;
        case 'error':
          this.addLog(`错误: ${data.message}`);
          break;
      }
    },
    addLog(message) {
      const time = new Date().toLocaleTimeString();
      this.logs.push(`[${time}] ${message}`);
    },
    async stopRun() {
      try {
        await axios.post('/api/run/stop');
        this.addLog('已发送停止请求');
      } catch (error) {
        this.$message.error('停止失败: ' + error.message);
      }
    },
    copyResults() {
      const json = JSON.stringify(this.runResults, null, 2);
      navigator.clipboard.writeText(json).then(() => {
        this.$message.success('已复制到剪贴板');
      });
    },
    baseName(fileName) {
      const parts = String(fileName || '').split(/[\\/]/);
      return parts[parts.length - 1] || '';
    },
    fileFailSum(file) {
      return this.fileSum(file, 'failSum');
    },
    fileIgnoreSum(file) {
      return this.fileSum(file, 'ignoreSum');
    },
    fileSum(file, key) {
      if (!file || !file.data) return 0;
      const map = {
        successSum: 'sks:successSumTotal',
        failSum: 'sks:failSumTotal',
        ignoreSum: 'sks:ignoreSumTotal'
      };
      return Number(file.data[map[key]]) || 0;
    },
    fileCount(file, key) {
      return file && file.data ? this.fileSum(file, key) : '-';
    },
    fileMessage(file) {
      return (file && file.message) || '';
    },
    fileStatusText(file) {
      if (!file || file.status !== 'success') return '失败';
      return this.fileFailSum(file) > 0 ? '部分失败' : '成功';
    },
    fileTagType(file) {
      if (!file || file.status !== 'success') return 'danger';
      return this.fileFailSum(file) > 0 ? 'warning' : 'success';
    },
    childFailCount(row) {
      return (row.files || []).reduce((sum, f) => sum + this.fileFailSum(f), 0);
    },
    taskStatusText(row) {
      if (!row.result || row.result.success === false) return '失败';
      return this.childFailCount(row) > 0 ? '部分失败' : '成功';
    },
    taskTagType(row) {
      const text = this.taskStatusText(row);
      if (text === '失败') return 'danger';
      return text === '部分失败' ? 'warning' : 'success';
    },
    /**
     * 把统一返回格式里的 results 树扁平化为失败/忽略行
     * 根对象 -> attributes / indexes / relationships
     */
    collectDetailRows(rows, parentRef, out) {
      (rows || []).forEach(row => {
        if (!row || typeof row !== 'object') return;
        const ref = row['sks:ref'] || '';
        if (row._status === 'failed' || row._status === 'skipped') {
          out.push({
            status: row._status,
            objectName: row['sks:objectName'] || '',
            ref,
            parent: parentRef,
            operation: row._operation || '',
            message: row._message || ''
          });
        }
        const childParent = ref || parentRef;
        this.collectDetailRows(row.attributes, childParent, out);
        this.collectDetailRows(row.indexes, childParent, out);
        this.collectDetailRows(row.relationships, childParent, out);
      });
      return out;
    },
    detailRowsOf(file) {
      return this.collectDetailRows(file && file.data ? file.data.results : [], '', []);
    },
    detailCount(file) {
      return this.detailRowsOf(file).length;
    },
    openDetails(file) {
      this.detailTitle = this.baseName(file.fileName);
      this.detailRows = this.detailRowsOf(file);
      this.detailDialogVisible = true;
    }
  }
};
</script>

<style scoped>
.layout {
  height: 100vh;
}

.aside {
  background: #ffffff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
  border-bottom: 1px solid #e4e7ed;
}

.side-menu {
  border-right: none;
  flex: 1;
}

.running-dot {
  margin-left: 8px;
}

.main-container {
  background: #f5f7fa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border-bottom: 1px solid #e4e7ed;
}

.header h2 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.env-controls {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.plan-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.plan-label {
  font-size: 13px;
  color: #606266;
}

.plan-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.plan-option-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.plan-option-env {
  color: #909399;
  font-size: 12px;
}

.plan-option-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.plan-action-icon {
  color: #909399;
  cursor: pointer;
}

.plan-action-icon:hover {
  color: #409eff;
}

.plan-action-del:hover {
  color: #f56c6c;
}

.main {
  overflow-y: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.env-tip {
  font-size: 12px;
  color: #909399;
}

.table-footer {
  margin-top: 15px;
}

.progress-info {
  margin-top: 10px;
  color: #606266;
}

.current-task-progress .progress-info {
  display: flex;
  justify-content: space-between;
  margin: 0 0 8px;
}

.log-container {
  max-height: 400px;
  overflow-y: auto;
  background: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
}

.file-result-wrap {
  padding: 8px 16px;
  background: #fafafa;
}

.fail-count {
  color: #f56c6c;
  font-weight: 600;
}

.log-line {
  margin-bottom: 4px;
  color: #303133;
}

.type-cell {
  display: flex;
  align-items: center;
  gap: 4px;
}

.help-icon {
  color: #909399;
  cursor: pointer;
  font-size: 15px;
}

.help-icon:hover {
  color: #409eff;
}

.param-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.param-summary {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: #606266;
}

.param-footer {
  margin-top: 8px;
}

.param-tip {
  font-size: 12px;
  color: #909399;
  margin-left: 12px;
}

.remark-content {
  max-height: 60vh;
  overflow-y: auto;
  line-height: 1.7;
  font-size: 13px;
  color: #303133;
}

.remark-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0;
}

.remark-content :deep(th),
.remark-content :deep(td) {
  border: 1px solid #ebeef5;
  padding: 6px 10px;
  text-align: left;
}

.remark-content :deep(th) {
  background: #f5f7fa;
}

.remark-content :deep(code) {
  background: #f5f7fa;
  padding: 2px 4px;
  border-radius: 3px;
}

.remark-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 24px;
}

.remark-dialog-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.remark-dialog-expand {
  font-size: 16px;
  color: #606266;
  cursor: pointer;
}

.remark-dialog-expand:hover {
  color: #409eff;
}

.remark-content.is-fullscreen {
  max-height: calc(100vh - 150px);
}
</style>
