# Carousel 走马灯

轮播切换、指示器与卡片布局。

> 本页仅列出当前源码已通过测试的接口；完整复刻状态以项目任务总账为准。

## 示例

### 基础轮播

轮播切换、指示器与卡片布局。

```tsx
import { Carousel, CarouselItem } from 'element-react';

/** 指示器与箭头切换均可操作，悬停暂停自动播放。 */
export default function Example() {
  return (
    <Carousel height="200px" indicatorPosition="outside" arrow="always" interval={4000}>
      {['第一屏', '第二屏', '第三屏'].map((label, index) => (
        <CarouselItem key={label} name={String(index)} label={label}>
          <div className="flex h-full items-center justify-center bg-[var(--el-color-primary-light-9)] text-xl text-[var(--el-color-primary)]">
            {label}
          </div>
        </CarouselItem>
      ))}
    </Carousel>
  );
}
```

### 卡片轮播

轮播切换、指示器与卡片布局。

```tsx
import { Carousel, CarouselItem } from 'element-react';

/** 卡片模式点击侧卡切换，缩放和位移沿用来源计算方式。 */
export default function Example() {
  return (
    <Carousel type="card" height="200px" autoplay={false}>
      {[1, 2, 3, 4].map((value) => (
        <CarouselItem key={value}>
          <div className="flex h-full items-center justify-center bg-[var(--el-color-success-light-8)] text-2xl text-[var(--el-color-success)]">
            {value}
          </div>
        </CarouselItem>
      ))}
    </Carousel>
  );
}
```

## 已验证 API

| 来源章节 | 原名称 | React接口 | 描述 | 类型 | 默认值 |
|---|---|---|---|---|---|
| Carousel Attributes | height | height | height of the carousel | string | '' |
| Carousel Attributes | initial-index | initialIndex | index of the initially active slide (starting from 0) | number | 0 |
| Carousel Attributes | trigger | trigger | how indicators are triggered | enum'hover' \| 'click' | hover |
| Carousel Attributes | autoplay | autoplay | whether automatically loop the slides | boolean | true |
| Carousel Attributes | interval | interval | interval of the auto loop, in milliseconds | number | 3000 |
| Carousel Attributes | indicator-position | indicatorPosition | position of the indicators | enum'' \| 'none' \| 'outside' | '' |
| Carousel Attributes | arrow | arrow | when arrows are shown | enum'always' \| 'hover' \| 'never' | hover |
| Carousel Attributes | type | type | type of the Carousel | enum'' \| 'card' | '' |
| Carousel Attributes | card-scale | cardScale | when type is card, scaled size of secondary cards | number | 0.83 |
| Carousel Attributes | loop | loop | display the items in loop | boolean | true |
| Carousel Attributes | direction | direction | display direction | enum'horizontal' \| 'vertical' | horizontal |
| Carousel Attributes | pause-on-hover | pauseOnHover | pause autoplay when hover | boolean | true |
| Carousel Attributes | motion-blur | motionBlur | infuse dynamism and smoothness into the carousel | boolean | false |
| Carousel Events | change | onChange | triggers when the active slide switches, it has two parameters, the one is the index of the new active slide, and other is index of the old active slide | Function(current: number, prev: number) => void | — |
| Carousel Slots | default | children | customize default content |  | — |
| Carousel Exposes | activeIndex | ref.current.activeIndex | active slide index | number | — |
| Carousel Exposes | setActiveItem | ref.current.setActiveItem | manually switch slide, index of the slide to be switched to, starting from 0; or the `name` of corresponding `el-carousel-item` | Function(index: string \| number) => void | — |
| Carousel Exposes | prev | ref.current.prev | switch to the previous slide | Function() => void | — |
| Carousel Exposes | next | ref.current.next | switch to the next slide | Function() => void | — |
| Carousel-Item Attributes | name | name | name of the item, can be used in `setActiveItem` | string | '' |
| Carousel-Item Attributes | label | label | text content for the corresponding indicator | string / number | '' |
| Carousel-Item Slots | default | children | customize default content |  | — |

## 完成记录

- [x] carousel:84 height；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:85 initialIndex；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:86 trigger；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:87 autoplay；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:88 interval；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:89 indicatorPosition；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:90 arrow；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:91 type；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:92 cardScale；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:93 loop；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:94 direction；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:95 pauseOnHover；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:96 motionBlur；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:102 onChange；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:108 children；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:114 ref.current.activeIndex；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:115 ref.current.setActiveItem；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:116 ref.current.prev；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:117 ref.current.next；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:125 name；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:126 label；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
- [x] carousel:132 children；实现：packages/components/carousel/index.tsx；测试：tests/carousel.test.tsx
