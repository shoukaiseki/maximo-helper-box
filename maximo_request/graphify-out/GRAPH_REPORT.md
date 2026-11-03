# Graph Report - maximo_request  (2026-11-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 94 nodes · 244 edges · 7 communities (6 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ad477b9b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6

## God Nodes (most connected - your core abstractions)
1. `getConfig()` - 16 edges
2. `requestFn()` - 16 edges
3. `readFileContent()` - 13 edges
4. `ConsoleLogger` - 10 edges
5. `importMaxDomain()` - 8 edges
6. `importMaxIntObject()` - 8 edges
7. `importMaxScript()` - 8 edges
8. `createService()` - 8 edges
9. `importMaxAppInfo()` - 7 edges
10. `importMaxAutoKey()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `createService()` --calls--> `getConfig()`  [EXTRACTED]
  nodeutils/requestHttp.js → nodeutils/config.js
- `saveErrorLog()` --calls--> `getConfig()`  [EXTRACTED]
  nodeutils/requestHttp.js → nodeutils/config.js
- `saveResponseLog()` --calls--> `getConfig()`  [EXTRACTED]
  nodeutils/requestHttp.js → nodeutils/config.js
- `importMaxScript()` --calls--> `readJsonFile()`  [EXTRACTED]
  nodeutils/maximoTools.js → nodeutils/fileUtils.js
- `importMaxScript()` --calls--> `resolveFilePath()`  [EXTRACTED]
  nodeutils/maximoTools.js → nodeutils/fileUtils.js

## Import Cycles
- None detected.

## Communities (7 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (14): args, __filename, filteredArgs, importCommands, packageJson, checkAndCreateConfig(), copySampleConfig(), __dirname (+6 more)

### Community 1 - "Community 1"
Cohesion: 0.38
Nodes (16): getConfig(), readFileContent(), readXmlFile(), callMaxScript(), checkImportResult(), importMaxAppInfo(), importMaxAutoKey(), importMaxDomain() (+8 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (15): author, bin, sks-maximo, dependencies, axios@^1.6.0, description, keywords, license (+7 more)

### Community 3 - "Community 3"
Cohesion: 0.40
Nodes (8): createService(), getLogDir(), getService(), joinUrl(), limitLogOutput(), saveErrorLog(), saveRequestLog(), saveResponseLog()

### Community 4 - "Community 4"
Cohesion: 0.40
Nodes (8): fileUtils, readJsonFile(), printBatchStats(), sendMockData(), sendMockDataBatch(), sendPOMockData(), sendPOMockDataBatch(), sendRlImportMockDataBatch()

### Community 6 - "Community 6"
Cohesion: 0.33
Nodes (7): getWorkDir(), fileExists(), filePathForName(), listFiles(), scanDir(), resolveFilePath(), batchImport()

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `axios` connect `Community 2` to `Community 3`?**
  _High betweenness centrality (0.275) - this node is a cross-community bridge._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Why does `ConsoleLogger` connect `Community 5` to `Community 0`?**
  _High betweenness centrality (0.182) - this node is a cross-community bridge._
- **Why does `getConfig()` connect `Community 1` to `Community 0`, `Community 3`, `Community 4`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._