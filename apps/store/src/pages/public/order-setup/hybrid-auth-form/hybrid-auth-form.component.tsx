import { $$orderProcess } from '@/processes/order-process';
import { LoginByPhone } from '@/features/auth/login/by-phone';
import { RegisterForm, RegisterModeSwitcher } from '@/features/auth/register';
import { createView } from '@/shared/lib/view';

interface HybridAuthFormProps {
  className?: string;
  formSubmitLabel?: string;
}

const HybridAuthForm = createView<HybridAuthFormProps>()
  .displayName('HybridAuthForm')
  .units({
    isRegistrationFormUsed: $$orderProcess.$isRegistrationFormUsed,
  })
  .memo()
  .view(({ className, isRegistrationFormUsed, formSubmitLabel }) => (
    <div className={className}>
      {isRegistrationFormUsed ? (
        <RegisterForm showAgreement={false} formSubmitLabel={formSubmitLabel}>
          <RegisterModeSwitcher />
        </RegisterForm>
      ) : (
        <LoginByPhone formSubmitLabel={formSubmitLabel} />
      )}
    </div>
  )).Memo;

export type { HybridAuthFormProps };
export { HybridAuthForm };
