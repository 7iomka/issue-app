import { memo, useMemo } from 'react';
import clsx from 'clsx';
import type { ButtonProps } from '@mantine/core';
import { Button } from '@mantine/core';
import { getFormattedTel } from '@steklo24/utils';
import styles from './header-phone.module.scss';

interface HeaderPhoneProps extends ButtonProps {
  className?: string;
  value?: string;
}

const HeaderPhone = memo((props: HeaderPhoneProps) => {
  const { className, value = '+7 (911) 323 23 45', variant = 'subtle', ...rest } = props;
  const telValue = useMemo(() => getFormattedTel(value), [value]);
  return (
    <Button
      className={clsx(styles.HeaderPhone, className)}
      variant={variant}
      radius="sm"
      component="a"
      compact={variant !== 'filled'}
      href={`tel:${telValue}`}
      {...rest}
    >
      {value}
    </Button>
  );
});

HeaderPhone.displayName = 'HeaderPhone';

export { HeaderPhone };
