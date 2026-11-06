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
