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
