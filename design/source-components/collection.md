# Collection 源码目录设计

- 来源：packages/components/collection
- 分类：子组件入口、重导出目录或内部能力；不等同公开根导出
- 功能设计：集合注册/注销、DOM顺序和稳定键；用于菜单、游走焦点等，StrictMode 下注册幂等。
- 家族设计：内部基础设施；公开稳定性需单独审计
- React方案：集合注册/注销、DOM顺序和稳定键；用于菜单、游走焦点等，StrictMode 下注册幂等。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/collection/index.ts（SHA256 b0c795789f59e19b54b7ccc9d1f75261378b703342494d852ce3381452a246d6）
- packages/components/collection/src/collection-item.vue（SHA256 a17e7e3df0531a9b1040b350c9568b8c0f8ec0d2095cdabdf3e5644a3d104f30）
- packages/components/collection/src/collection.ts（SHA256 7a94cd506a629643c7960697a4513589a78a54ef766df03558db9c3bc4e1543e）
- packages/components/collection/src/collection.vue（SHA256 788fedad239a4059fd4b4d8ce4a52f13ddaaa5d91381a7bf8a962244e627a99a）
- packages/components/collection/src/tokens.ts（SHA256 0cdae4c075716704e55f417a7b8d04a007c11fda7e727dabddb637dfb964c0dc）
- packages/components/collection/test-helper/index.ts（SHA256 f7dde7107bd706351b8f580a8b417b21c71cc0d4a10ec7a0b72814e79d23c6c7）
- packages/components/collection/__tests__/collection-item.test.ts（SHA256 20182cfad82734e1dd2fda14e630f8892a4889ac1a0c9332e790638549ec1c5c）
- packages/components/collection/__tests__/collection.test.ts（SHA256 f5db9d0bf000135f76ece6a0ea713be3de28d89dcffde1168e258995c66014da）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- <ElCollectionItem /> — packages/components/collection/__tests__/collection-item.test.ts
- should be able to render correctly — packages/components/collection/__tests__/collection-item.test.ts
- register child instance — packages/components/collection/__tests__/collection-item.test.ts
- <ElCollection /> — packages/components/collection/__tests__/collection.test.ts
- render — packages/components/collection/__tests__/collection.test.ts
- should be able to render correctly — packages/components/collection/__tests__/collection.test.ts
- provides — packages/components/collection/__tests__/collection.test.ts
- should be able to provide valid data — packages/components/collection/__tests__/collection.test.ts

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
