import { Divider } from '@mantine/core';
import { PersonalDataForm } from '@/features/viewer/personal-data';
import { AuthDataForm } from '@/features/viewer/auth-data';
import { $$viewer } from '@/entities/viewer';
import { createView } from '@/shared/lib/view';
import { InfoCard, PhoneInput } from '@/shared/ui';

const PersonalData = createView()
  .units({
    info: $$viewer.$viewer,
  })
  .view(({ info }) => (
    <section>
      <div className="row gx-12 gy-20">
        <div className="col-12 md:col-6">
          <InfoCard className="py-25 px-15 xsl:px-25 md:px-35" title="Личные данные">
            <PhoneInput value={info?.phone} disabled />
            <Divider my={20} className="opacity-50" />
            <PersonalDataForm />
          </InfoCard>
        </div>
        <div className="col-12 md:col-6">
          <InfoCard className="py-25 px-15 xsl:px-25 md:px-35" title="Авторизационные данные">
            <AuthDataForm />
          </InfoCard>
        </div>
      </div>
    </section>
  ));

export { PersonalData };
