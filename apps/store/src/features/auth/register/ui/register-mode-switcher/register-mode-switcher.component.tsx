/* eslint-disable @typescript-eslint/no-shadow */
import { createView } from '@/shared/lib/view';
import { OptionSwitcher } from '@/shared/ui';
import { $modes, $mode, modeChanged } from '../../register.model';

interface RegisterModeSwitcherProps {
  className?: string;
}

const RegisterModeSwitcher = createView<RegisterModeSwitcherProps>()
  .displayName('RegisterModeSwitcher')
  .units({
    modes: $modes,
    activeMode: $mode,
    handleModeChange: modeChanged,
  })
  .memo()
  .view(({ className, modes, activeMode, handleModeChange }) => (
    <OptionSwitcher
      className={className}
      options={modes}
      value={activeMode}
      onChange={handleModeChange}
    />
  )).Memo;

export type { RegisterModeSwitcherProps };
export { RegisterModeSwitcher };
