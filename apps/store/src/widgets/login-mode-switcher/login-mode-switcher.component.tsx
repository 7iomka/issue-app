import { createView } from '@/shared/lib/view';
import { OptionSwitcher } from '@/shared/ui';
import { $modes, $mode, modeChanged } from './login-mode-switcher.model';

interface LoginModeSwitcherProps {
  className?: string;
}

const LoginModeSwitcher = createView<LoginModeSwitcherProps>()
  .displayName('LoginModeSwitcher')
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

export type { LoginModeSwitcherProps };
export { LoginModeSwitcher };
