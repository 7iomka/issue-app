import clsx from 'clsx';
import { Button } from '@mantine/core';
import { createView } from '@/shared/lib/view';

interface OptionSwitcherProps {
  className?: string;
  options: { label: string; value: any }[];
  value: any;
  onChange(v: any): void;
}

const OptionSwitcher = createView<OptionSwitcherProps>()
  .displayName('OptionModeSwitcher')
  .memo()
  .view(({ className, options, value, onChange }) => (
    <div className={clsx(className, 'flex flex-col')}>
      <div className="row g-8 items-center justify-center">
        {options.map((option) => (
          <div className="col-12 xsm:col-6" key={option.value}>
            <Button
              variant={option.value === value ? 'filled' : 'outline'}
              radius="md"
              size="sm"
              compact
              fullWidth
              px={8}
              sx={{
                height: 30,
                '&': option.value === value && {
                  pointerEvents: 'none',
                  cursor: 'default',
                },
                '&:not(:hover)': option.value !== value && {
                  color: `rgba(var(--root-color-rgb), 0.4)`,
                  borderColor: `rgba(var(--root-color-rgb), 0.2)`,
                  backgroundColor: `var(--root-background)`,
                },
              }}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )).Memo;

export type { OptionSwitcherProps };
export { OptionSwitcher };
