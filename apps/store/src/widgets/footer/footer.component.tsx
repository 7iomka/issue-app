import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import xss from 'xss';
import { Button, Modal } from '@mantine/core';
import { VisaIcon } from '@steklo24/icons/visa';
import { MastercardIcon } from '@steklo24/icons/mastercard';
import { MirIcon } from '@steklo24/icons/mir';
import { StoresMap } from '@/widgets/maps/stores-map';
import { $$category } from '@/entities/category';
import { Image, CustomLink, breakpoints } from '@/shared/ui';
import { createView } from '@/shared/lib/view';
import { aboutLinks, serviceLinks, bottomTextItems } from './footer.data';
import styles from './footer.module.scss';

interface FooterProps {
  className?: string;
}

// TODO: Handle aboutLinks, serviceLinks with mocks (api)
const Footer = createView<FooterProps>()
  .displayName('Footer')
  .units({
    categories: $$category.$categories,
  })
  .map(({ categories }) => {
    const mapRef = useRef(null);
    const [isMapModalOpened, setIsMapModalOpened] = useState(false);
    const [isYMapsApiAvailable, setIsYMapsApiAvailable] = useState(false);
    const [isMapRefAvailable, setIsMapRefAvailable] = useState(false);

    return {
      items: categories.map((cat) => ({
        id: cat.id,
        label: cat.name,
        href: cat.url,
      })),
      mapRef,
      isMapModalOpened,
      setIsMapModalOpened,
      isYMapsApiAvailable,
      setIsYMapsApiAvailable,
      isMapRefAvailable,
      setIsMapRefAvailable,
    };
  })
  .effect(({ mapRef, isMapModalOpened, isYMapsApiAvailable, isMapRefAvailable }) => {
    // Handle fit map every time when modal is open, and
    // first time when ymaps api is loaded
    useEffect(() => {
      if (isMapModalOpened && isMapRefAvailable) {
        setTimeout(() => {
          (mapRef.current as any).container.fitToViewport();
        }, 100);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMapModalOpened, isMapRefAvailable]);
  })
  .memo()
  .view(
    ({
      className,
      mapRef,
      items,
      isMapModalOpened,
      setIsMapModalOpened,
      isYMapsApiAvailable,
      setIsYMapsApiAvailable,
      setIsMapRefAvailable,
    }) => (
      <footer className={clsx(styles.Footer, className)}>
        <div className="container">
          <div className={styles.Footer__main}>
            <div className="row gy-30">
              <div className="col-12 xsl:col-6 md:col-4 lg:col-2">
                <h4 className={styles.Footer__section_title}>Каталог</h4>
                <div className={styles.Footer__section_content}>
                  <ul className={styles.Footer__links_list}>
                    {items.map((item) => (
                      <li key={item.id}>
                        <CustomLink href={item.href}>{item.label}</CustomLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-12 xsl:col-6 md:col-4 lg:col-2">
                <h4 className={styles.Footer__section_title}>О компании</h4>
                <div className={styles.Footer__section_content}>
                  <ul className={styles.Footer__links_list}>
                    {aboutLinks?.map((item) => (
                      <li key={item.id}>
                        <CustomLink href={item.link}>
                          <span dangerouslySetInnerHTML={{ __html: xss(item.title) }} />
                        </CustomLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-12 md:col-4 lg:col-3">
                <h4 className={styles.Footer__section_title}>Услуги</h4>
                <div className={styles.Footer__section_content}>
                  <ul
                    className={clsx(styles.Footer__links_list, styles.Footer__links_list_wrapped)}
                  >
                    {serviceLinks?.map((item) => (
                      <li key={item.id}>
                        <CustomLink href={item.link}>
                          <span dangerouslySetInnerHTML={{ __html: xss(item.title) }} />
                        </CustomLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-12 lg:col-5">
                <h4 className={styles.Footer__section_title}>Пункт выдачи</h4>
                <div className={styles.Footer__section_content}>
                  <div className="row gy-24 space-between">
                    <div className="col-12 md:col-6">
                      <p>
                        г. Москва, Дмитровское шоссе, д.13.
                        <br />
                        Жилой комплекс «Дыхание»
                      </p>
                      <p>
                        <br />
                      </p>
                      <p>
                        <strong>Телефон: </strong>
                        <CustomLink component="a" href="tel:+74995209498">
                          +7 (499) 520 94 98
                        </CustomLink>
                      </p>
                      <p>
                        <strong>Чат в WhatsApp: </strong>
                        <CustomLink component="a" href="https://wa.me/79253825148" target="_blank">
                          +7 (925) 382 51 48
                        </CustomLink>
                      </p>
                      <p>
                        <strong>E-mail: </strong>
                        <CustomLink component="a" href="mailto:steklo-24@yandex.ru">
                          steklo-24@yandex.ru
                        </CustomLink>
                      </p>
                    </div>
                    <div className="col-12 md:col-6">
                      <p>Режим работы офиса / Пункта выдачи: ежедневно с 10:00 до 19:00</p>
                      <p>
                        <br />
                      </p>
                      <p>Режим работы производства: Пн-Сб</p>
                    </div>
                  </div>
                  <div className={styles.Footer__map_preview}>
                    <Image
                      src="/static/images/content/contacts/address_map_preview.jpg"
                      className="object-cover"
                      sizes={`(min-width: ${breakpoints.md}px): 40vw, 100vw`}
                      fill
                    />
                    <Button
                      className={styles.Footer__map_trigger}
                      onClick={() => setIsMapModalOpened(true)}
                    >
                      Открыть карту
                    </Button>
                  </div>

                  <Modal
                    opened={isMapModalOpened}
                    fullScreen
                    padding={0}
                    onClose={() => setIsMapModalOpened(false)}
                  >
                    <StoresMap
                      style={{ width: '100%', height: '100%' }}
                      onLoad={() => {
                        if (!isYMapsApiAvailable) {
                          setIsYMapsApiAvailable(true);
                        }
                      }}
                      instanceRef={(v) => {
                        mapRef.current = v;
                        setIsMapRefAvailable(!!v);
                      }}
                    />
                  </Modal>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.Footer__bottom}>
            <div className="row gy-32">
              <div className="col-12 lg:col-7 order-1 lg:order-0">
                {bottomTextItems.map((text, index) => (
                  <p
                    // eslint-disable-next-line react/no-array-index-key
                    key={`footer_text_${index}`}
                    className="opacity-30 mb-20 leading-loose"
                    dangerouslySetInnerHTML={{ __html: xss(text) }}
                  />
                ))}
              </div>
              <div className="col-12 lg:col-5">
                <div className="flex items-center space-x-8">
                  <VisaIcon height={24} />
                  <MastercardIcon height={24} />
                  <MirIcon height={24} />
                </div>
                <div className="mt-20 leading-loose">
                  <p>
                    ИП Ермолаев Николай Иванович, ОГРНИП 318583500024541 от 28.04.2018, ИНН
                    583805739250. Служба поддержки клиентов +7 (495) 649-61-45, steklo-24@yandex.ru
                  </p>
                  <p>
                    <br />
                  </p>
                  <p>
                    © СТЕКЛО24.МОСКВА Все права защищены 2013 - {new Date().getUTCFullYear()}гг.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    ),
  ).Memo;

export { Footer };
