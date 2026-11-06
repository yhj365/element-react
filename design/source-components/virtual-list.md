# VirtualList 源码目录设计

- 来源：packages/components/virtual-list
- 分类：根组件入口直接重导出（包括部分基础设施）
- 功能设计：定长/变长列表及网格、overscan、尺寸缓存、scrollTo与滚动锚定；稳定key和键盘焦点保活。
- 家族设计：内部基础设施；公开稳定性需单独审计
- React方案：定长/变长列表及网格、overscan、尺寸缓存、scrollTo与滚动锚定；稳定key和键盘焦点保活。
- 状态：目录已纳入覆盖；未逐行完成实现行为审计，不代表组件已实现。

## 文件追踪

- packages/components/virtual-list/index.ts（SHA256 1682413b108e101362ce1fb599f4c86cd2949b7e37955b7d7605a9b2077912f8）
- packages/components/virtual-list/src/builders/build-grid.ts（SHA256 c6f9065d533a07628af27aa1f5eee6e0d040042ebdbddc7aa14c38f89755b41a）
- packages/components/virtual-list/src/builders/build-list.ts（SHA256 bbf53cdc5e8ce19f2c09549e3671b1fc092f175432719bdb6b833247a19f0411）
- packages/components/virtual-list/src/components/dynamic-size-grid.ts（SHA256 ebae59b20310cb4d702bc748675c753d1c6db28bb8c2a9dc09a59268720e61d3）
- packages/components/virtual-list/src/components/dynamic-size-list.ts（SHA256 61c3c067f855d76c6ce32a5b28383b2835400ec642474c9c7bcff89c1fcfd99b）
- packages/components/virtual-list/src/components/fixed-size-grid.ts（SHA256 025aa558e0388638313e03d7bbff5238ef99415defae79d5f9c2d0b61a600df2）
- packages/components/virtual-list/src/components/fixed-size-list.ts（SHA256 17a111d1d4bf6808d91b8e5b1e02ea47a826e2cfbbbfaa0de04bffefecd72c50）
- packages/components/virtual-list/src/components/scrollbar.ts（SHA256 57d5a67d33e8abc09d6195c369924c52228b98c53ee821ba0a6874e978281c65）
- packages/components/virtual-list/src/defaults.ts（SHA256 efd006c9a64297607470a079bc7bf7f1f142fc9ff6cb70e07808292dae325f39）
- packages/components/virtual-list/src/hooks/use-cache.ts（SHA256 f784323b738a56b6098ce7bd087924618cd588479d4f922f4f37cd3ecbbd6756）
- packages/components/virtual-list/src/hooks/use-grid-touch.ts（SHA256 82e3e625052e1d10895db96ad15ca846d1760c3aaedbe4798d598efdbc1e02c1）
- packages/components/virtual-list/src/hooks/use-grid-wheel.ts（SHA256 e9b9fd557111c6a79e247d265b65b456176c32fff3c3deaf05d9387b749a863d）
- packages/components/virtual-list/src/hooks/use-wheel.ts（SHA256 f352645baf11ee3a91022b4ccfa6b8f6bcef0da9ebcb8cdbc0eb9aa046fc4ed8）
- packages/components/virtual-list/src/props.ts（SHA256 c76ed316549c3339e9fb94f40bbf7230808755194cca4ec512463f8acd3ce93b）
- packages/components/virtual-list/src/types.ts（SHA256 8323fd674b4cfe62536f5b8b5f583a6eaa099ba87333e1b241298355c0c81a2a）
- packages/components/virtual-list/src/utils.ts（SHA256 9f0cf20cb27af1ad95d3f7ba767e920b9122b8c162b9213cef6ada9ef616f5ad）
- packages/components/virtual-list/style/css.ts（SHA256 5542bf6553354c0bd14d5ca39b3e91f1156a18d2b4e145ae1ba02dad56498942）
- packages/components/virtual-list/style/index.ts（SHA256 109724d741ff74c2d9c283fac284acbd684574b716569c4dfa683a9774786acb）
- packages/components/virtual-list/__tests__/dynamic-size-grid.test.ts（SHA256 f0ee1ae8b4665ce8db61916b8a7e996a0c7dc9523a2b58ee503d1a76bd8b4770）
- packages/components/virtual-list/__tests__/dynamic-size-list.test.ts（SHA256 1a5c070f4a2efa755dfc3722f1b951bd02e1601f0509a42086ea507c7930f533）
- packages/components/virtual-list/__tests__/fixed-size-grid.test.ts（SHA256 20aec987e2a3c70e135365507a986b3fb76d35afda769429d18f95fd7670c650）
- packages/components/virtual-list/__tests__/fixed-size-list.test.ts（SHA256 73f85d6233de2f744645ddb4bec5d06aa0146b71f273a9a7fb650ea89932454d）
- packages/components/virtual-list/__tests__/scrollbar.test.ts（SHA256 7fe984a744287391af3ea9e96e84f25534072523326935f5863080008ee31683）
- packages/components/virtual-list/__tests__/setup-mock.ts（SHA256 3f5c1a969377de3617a254e2a13dc9a67b030f4add7da8f7cdb49616954e3cd0）

## 来源测试名称索引

以下为静态提取，不包含所有动态生成用例、断言、before/after钩子；必须阅读测试快照迁移行为，不以标题数量代表完整覆盖。

- <fixed-size-grid /> — packages/components/virtual-list/__tests__/dynamic-size-grid.test.ts
- render testing — packages/components/virtual-list/__tests__/dynamic-size-grid.test.ts
- should render correctly — packages/components/virtual-list/__tests__/dynamic-size-grid.test.ts
- should render zero row zero column — packages/components/virtual-list/__tests__/dynamic-size-grid.test.ts
- scroll testing — packages/components/virtual-list/__tests__/dynamic-size-grid.test.ts
- should scroll correctly — packages/components/virtual-list/__tests__/dynamic-size-grid.test.ts
- should not scroll at all — packages/components/virtual-list/__tests__/dynamic-size-grid.test.ts
- should run scrollTo correctly — packages/components/virtual-list/__tests__/dynamic-size-grid.test.ts
- should scrollToItem with correct alignment — packages/components/virtual-list/__tests__/dynamic-size-grid.test.ts
- error handling — packages/components/virtual-list/__tests__/dynamic-size-grid.test.ts
- should throw when column-width is not number — packages/components/virtual-list/__tests__/dynamic-size-grid.test.ts
- should throw when row-height is not number — packages/components/virtual-list/__tests__/dynamic-size-grid.test.ts
- should be able to render component type — packages/components/virtual-list/__tests__/dynamic-size-grid.test.ts
- <dynamic-size-list /> — packages/components/virtual-list/__tests__/dynamic-size-list.test.ts
- render testing — packages/components/virtual-list/__tests__/dynamic-size-list.test.ts
- should render vertical list correctly — packages/components/virtual-list/__tests__/dynamic-size-list.test.ts
- should render horizontal list correctly — packages/components/virtual-list/__tests__/dynamic-size-list.test.ts
- scroll functionality — packages/components/virtual-list/__tests__/dynamic-size-list.test.ts
- should scroll correctly in horizontal mode — packages/components/virtual-list/__tests__/dynamic-size-list.test.ts
- should emit end-reached when wheel scrolling reaches bottom — packages/components/virtual-list/__tests__/dynamic-size-list.test.ts
- should emit end-reached when native scrolling reaches bottom — packages/components/virtual-list/__tests__/dynamic-size-list.test.ts
- should emit end-reached when clicking scrollbar track to bottom — packages/components/virtual-list/__tests__/dynamic-size-list.test.ts
- should emit end-reached again after total increases and bottom is reached again — packages/components/virtual-list/__tests__/dynamic-size-list.test.ts
- should scrollToItem correctly — packages/components/virtual-list/__tests__/dynamic-size-list.test.ts
- to throw — packages/components/virtual-list/__tests__/dynamic-size-list.test.ts
- should throw when item-size is not function — packages/components/virtual-list/__tests__/dynamic-size-list.test.ts
- <fixed-size-grid /> — packages/components/virtual-list/__tests__/fixed-size-grid.test.ts
- render testing — packages/components/virtual-list/__tests__/fixed-size-grid.test.ts
- should render correctly — packages/components/virtual-list/__tests__/fixed-size-grid.test.ts
- should render zero row zero column — packages/components/virtual-list/__tests__/fixed-size-grid.test.ts
- scroll testing — packages/components/virtual-list/__tests__/fixed-size-grid.test.ts
- should scroll correctly — packages/components/virtual-list/__tests__/fixed-size-grid.test.ts
- should not scroll at all — packages/components/virtual-list/__tests__/fixed-size-grid.test.ts
- should run scrollTo correctly — packages/components/virtual-list/__tests__/fixed-size-grid.test.ts
- should scrollToItem with correct alignment — packages/components/virtual-list/__tests__/fixed-size-grid.test.ts
- should handle touchstart touchmove correctly — packages/components/virtual-list/__tests__/fixed-size-grid.test.ts
- error handling — packages/components/virtual-list/__tests__/fixed-size-grid.test.ts
- should throw when column-width is not number — packages/components/virtual-list/__tests__/fixed-size-grid.test.ts
- should throw when row-height is not number — packages/components/virtual-list/__tests__/fixed-size-grid.test.ts
- <fixed-size-list /> — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should render correctly — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should render 0 item when total is 0 — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should early terminate scroll handler when the scrollTo equals to current offset — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should render correct items to the dom — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should emit end-reached when wheel scrolling reaches bottom — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should not double-emit end-reached when browser clamps scrollTop below maxOffset (DPR mismatch) — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should emit end-reached when native scrolling reaches bottom — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should emit end-reached when clicking scrollbar track to bottom — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should emit rtl horizontal end-reached payloads based on visual direction — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should set initial offset — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should render horizontal list — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should handle horizontal scroll correctly — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should render rtl direction — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should update rendered items when cache changes — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should update rendered items when item size changed — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- scrollTo — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should correctly scroll vertically — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should correctly scroll horizontally — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should not scroll out of the boundary — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should emit end-reached again after total increases and bottom is reached again — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- scrollToItem — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should scrollToItem correctly — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- to throw — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- should throw when layout is invalid — packages/components/virtual-list/__tests__/fixed-size-list.test.ts
- virtual scrollbar — packages/components/virtual-list/__tests__/scrollbar.test.ts
- vertical inline style — packages/components/virtual-list/__tests__/scrollbar.test.ts
- horizontal inline style — packages/components/virtual-list/__tests__/scrollbar.test.ts
- click track — packages/components/virtual-list/__tests__/scrollbar.test.ts
- horizontal track height/width — packages/components/virtual-list/__tests__/scrollbar.test.ts
- vertical track height/width — packages/components/virtual-list/__tests__/scrollbar.test.ts
- should locate correctly when endGap is set — packages/components/virtual-list/__tests__/scrollbar.test.ts

## 必须补齐的设计审计

- [ ] 导出与组合关系、Props默认值、emits、defineExpose、watch/生命周期副作用逐项核对。
- [ ] React实现的状态所有权、上下文、订阅和卸载清理明确。
- [ ] 来源测试全部建立映射，涉及DOM/视觉的补充浏览器对照。
