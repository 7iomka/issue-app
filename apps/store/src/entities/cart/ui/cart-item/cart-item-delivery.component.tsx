import clsx from 'clsx';
import {
  ActionIcon,
  SegmentedControl,
  Text,
  Tooltip,
  useComponentDefaultProps,
} from '@mantine/core';
import { Icon } from '@steklo24/icons';
import { createView } from '@/shared/lib/view';
import type { SegmentedCardsStylesParams } from '@/shared/lib/mantine';
import { useSegmentedCardsStyles } from '@/shared/lib/mantine';
import styles from './cart-item.module.scss';

interface CartItemDeliveryProps {
  className?: string;
}

const CartItemDelivery = createView<CartItemDeliveryProps>()
  .displayName('CartItemDelivery')
  .map(() => {
    //    const { classes, cx, theme } = useStyles(
    //   { controlSize, controlsOffset, orientation, height, includeGapInSize, breakpoints, slideGap },
    //   { name: 'Carousel', classNames, styles, unstyled }
    // );
    // TODO: Fix missing props: https://github.com/mantinedev/mantine/discussions/2812#discussioncomment-3992740
    const segmentedControlDefaultProps = useComponentDefaultProps(
      'SegmentedControl',
      {} as Partial<SegmentedCardsStylesParams>,
      {} as SegmentedCardsStylesParams,
    );
    const { classes: optionsClasses } = useSegmentedCardsStyles({
      ...segmentedControlDefaultProps,
      gap: 10,
    });
    return {
      optionsClasses,
    };
  })
  .memo()
  .view(({ className, optionsClasses }) => (
    <div className={clsx(styles.delivery, className)}>
      <h4 className="text-sm">
        <span className="uppercase">На сколько срочно вам нужен </span>
        <span className="whitespace-nowrap">
          <span className="uppercase">заказ?{` `}</span>
          <span className="inline-block whitespace-normal align-[-5px]">
            <Tooltip
              width={210}
              position="bottom"
              multiline
              transition="fade"
              color="gray.9"
              events={{ hover: true, focus: true, touch: true }}
              label="В зависимости от срочности изготовления мы можем увеличить стоимость, или наоборот сделать скидку, если изготовление будет происходить в не срочном порядке."
            >
              <ActionIcon<'button'> size={20} variant="transparent" color="gray.6">
                <Icon.QuestionMarkInCircleFilled width="20" />
              </ActionIcon>
            </Tooltip>
          </span>
        </span>
      </h4>
      <div className="mt-15">
        <div className="row gy-15 gx-30 items-center">
          <div className="col-auto">
            <SegmentedControl
              radius="lg"
              size="lg"
              classNames={optionsClasses}
              data={[
                {
                  value: 'x2',
                  label: (
                    <div className="text-left">
                      <h5 className="text-sm">Очень срочно (x2)</h5>
                      <p className="text-xs mt-2">2-3 дня</p>
                    </div>
                  ),
                },
                {
                  value: 'x1',
                  label: (
                    <div className="text-left">
                      <h5 className="text-sm">Стандартное время (x1)</h5>
                      <p className="text-xs mt-2">5 дней</p>
                    </div>
                  ),
                },
                {
                  value: 'x0.75',
                  label: (
                    <div className="text-left">
                      <h5 className="text-sm">Готов подождать (x0,75)</h5>
                      <p className="text-xs mt-2">2 недели</p>
                    </div>
                  ),
                },
              ]}
              color="primary"
            />
          </div>
          <div className="col-auto">
            <Text size="xs" className="opacity-60 xxl:max-w-[180px] leading-[1.2]" weight="700">
              Обратите внимание, что Вы можете забрать разные заказы в разное время
            </Text>
          </div>
        </div>
      </div>
    </div>
  )).Memo;

export type { CartItemDeliveryProps };
export { CartItemDelivery };
