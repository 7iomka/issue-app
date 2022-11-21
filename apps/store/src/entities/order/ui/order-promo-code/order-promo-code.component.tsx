import clsx from 'clsx';
import type { MantineSize } from '@mantine/core';
import { ActionIcon, Button } from '@mantine/core';
import { useState } from 'react';
import { Icon } from '@steklo24/icons';
import { createView } from '@/shared/lib/view';
import { TextInput } from '@/shared/ui';

interface OrderPromoCodeProps {
  className?: string;
  size?: MantineSize;
}

const OrderPromoCode = createView<OrderPromoCodeProps>()
  .displayName('OrderPromoCode')
  .map(() => {
    const [promoCode, setPromoCode] = useState('');
    const [isPromoCodeApplied, setPromoCodeApplied] = useState(false);
    return {
      promoCode,
      setPromoCode,
      isPromoCodeApplied,
      setPromoCodeApplied,
    };
  })
  .memo()
  .view(
    ({
      className,
      promoCode,
      setPromoCode,
      isPromoCodeApplied,
      setPromoCodeApplied,
      size = 'sm',
    }) => (
      <div className={clsx('text-center', className)}>
        {isPromoCodeApplied ? (
          <div className="inline-flex items-center">
            <div className="text-sm">Промокод {promoCode} применен</div>
            <ActionIcon<'button'>
              size={18}
              variant="transparent"
              className="bg-white rounded-full text-gray-900 ml-6"
              onClick={() => {
                setPromoCode('');
                setPromoCodeApplied(false);
              }}
            >
              <Icon.X width={10} strokeWidth="3" />
            </ActionIcon>
          </div>
        ) : (
          <TextInput
            radius="lg"
            size={size}
            value={promoCode}
            onChange={setPromoCode}
            rightSection={
              <Button
                onClick={() => setPromoCodeApplied(true)}
                radius="lg"
                size={size}
                color="gray.4"
                className="m-1 ml-10 w-[81px] h-auto absolute inset-1 px-3"
                styles={(theme) => ({
                  root: {
                    '&:active': {
                      transform: 'none',
                      backgroundColor: theme.fn.primaryColor(),
                    },
                  },
                })}
              >
                Применить
              </Button>
            }
            label="Промокод"
            rightSectionWidth={94}
          />
        )}
      </div>
    ),
  ).Memo;

export type { OrderPromoCodeProps };
export { OrderPromoCode };
