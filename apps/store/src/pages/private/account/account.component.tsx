import { Button, CopyButton, List } from '@mantine/core';
import { Icon } from '@steklo24/icons';
import { $$viewer } from '@/entities/viewer';
import { createView } from '@/shared/lib/view';
import { CustomLink, InfoCard } from '@/shared/ui';
import { routes } from '@/shared/routes';

const Account = createView()
  .units({
    viewer: $$viewer.$viewer,
  })
  .view(({ viewer }) => (
    <>
      <section>
        <InfoCard className="py-12 px-15 xsl:px-25 md:px-35">
          <div className="row g-15 items-center justify-between">
            <div className="col-auto">
              <div className="row items-center g-15">
                <div className="col-auto">Ваша реферальная ссылка</div>
                <div className="col-auto">
                  <div className="flex flex-wrap md:flex-nowrap">
                    <div className="flex items-center max-w-full rounded-md min-h-[30px] bg-gray-200 text-black text-sm px-15 mr-10 mb-10 md:mb-0">
                      <p className="truncate max-w-full">https://стекло24.москва/ref/U00001f</p>
                    </div>
                    <CopyButton value="https://стекло24.москва/ref/U00001">
                      {({ copied, copy }) => (
                        <Button
                          color={copied ? 'gray.3' : 'primary'}
                          onClick={copy}
                          radius="md"
                          size="sm"
                          compact
                          className="h-[30px] px-12"
                        >
                          {copied ? 'Скопировано' : 'Копировать'}
                        </Button>
                      )}
                    </CopyButton>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-auto">Приглашено: 30 чел.</div>
          </div>
        </InfoCard>{' '}
      </section>
      <section className="my-20">
        <div className="row g-10">
          <div className="col-12 md:col-6">
            <InfoCard
              title="Активные заказы"
              className="py-25 px-15 xsl:px-25 md:px-35 min-h-full"
              footerContent={
                <CustomLink href="#!" className="font-bold">
                  Подробнее
                </CustomLink>
              }
            >
              <div className="w-36 md:w-60 lg:w-80 absolute top-15 right-15 xsl:right-25 -z-10">
                <Icon.Box width="36" className="w-full h-full opacity-20 md:opacity-10" />
              </div>
              <div className="max-w-[80%]">
                У вас{' '}
                <CustomLink href="#!" className="font-bold">
                  один активный заказ
                </CustomLink>
              </div>
            </InfoCard>
          </div>
          <div className="col-12 md:col-6">
            <InfoCard
              title="Личные данные"
              className="py-25 px-15 xsl:px-25 md:px-35 min-h-full"
              footerContent={
                <CustomLink href={routes.account.personalData} className="font-bold">
                  Изменить данные
                </CustomLink>
              }
            >
              <div className="w-36 md:w-60 lg:w-80 absolute top-15 right-15 xsl:right-25 -z-10">
                <Icon.ProfileCard width="36" className="w-full h-full opacity-20 md:opacity-10" />
              </div>
              <div className="max-w-[80%]">
                <List listStyleType="disc" size="md" spacing={5}>
                  {(!!viewer?.firstname || !!viewer?.lastname) && (
                    <List.Item>
                      {[viewer.lastname, viewer.firstname].filter(Boolean).join(' ')}
                    </List.Item>
                  )}
                  <List.Item>{viewer?.phone}</List.Item>
                  {!!viewer?.email && <List.Item>{viewer?.email}</List.Item>}
                </List>
              </div>
            </InfoCard>
          </div>
          <div className="col-12 md:col-6">
            <InfoCard
              title="Мои организации"
              className="py-25 px-15 xsl:px-25 md:px-35 min-h-full"
              footerContent={
                <CustomLink href="#!" className="font-bold">
                  Добавить организацию или изменить данные
                </CustomLink>
              }
            >
              <div className="w-36 md:w-60 lg:w-80 absolute top-15 right-15 xsl:right-25 -z-10">
                <Icon.Documents width="36" className="w-full h-full opacity-20 md:opacity-10" />
              </div>
              <div className="max-w-[80%]">
                <List listStyleType="disc" size="md" spacing={5}>
                  <List.Item>
                    Индивидуальный предприниматель <br />
                    Ермолаев Николай Иванович
                  </List.Item>
                  <List.Item>ИП Ермолаев Владислав</List.Item>
                  <List.Item>ООО &#x201C;ДЖИФОРМ&#x201D;</List.Item>
                </List>
              </div>
            </InfoCard>
          </div>
          <div className="col-12 md:col-6">
            <InfoCard
              title="Моя корзина"
              className="py-25 px-15 xsl:px-25 md:px-35 min-h-full"
              footerContent={
                <CustomLink href="#!" className="font-bold">
                  Изменить данные
                </CustomLink>
              }
            >
              <div className="w-36 md:w-60 lg:w-80 absolute top-15 right-15 xsl:right-25 -z-10">
                <Icon.ShoppingCart3 width="36" className="w-full h-full opacity-20 md:opacity-10" />
              </div>
              <div className="max-w-[80%]">Товаров в корзине: 5</div>
            </InfoCard>
          </div>
        </div>
      </section>
    </>
  ));

export { Account };
