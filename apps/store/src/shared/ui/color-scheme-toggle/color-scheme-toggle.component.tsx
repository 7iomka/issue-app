import clsx from 'clsx';
import { Listbox } from '@headlessui/react';
import { Fragment, useEffect, useRef } from 'react';
import { useUnit } from 'effector-react/scope';
import { useIsomorphicLayoutEffect } from '@steklo24/hooks';
import { appConfig } from '@steklo24/config/app';
import { createView } from '@/shared/lib/view';
import type { IconProps } from './color-scheme-toggle.icons.component';
import { MoonIcon, PcIcon, SunIcon } from './color-scheme-toggle.icons.component';
import { $$colorScheme } from './color-scheme-toggle.model';
import type { ColorScheme } from './color-scheme-toggle.types';

function updateColorSchemeDOM() {
  if (
    localStorage[appConfig.colorSchemeKey] === 'dark' ||
    (!(appConfig.colorSchemeKey in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.style.colorScheme = 'dark';
    document.documentElement.classList.add('changing-color-scheme');
    document.documentElement.classList.add('color-scheme-dark');
  } else {
    document.documentElement.style.colorScheme = '';
    document.documentElement.classList.remove('changing-color-scheme');
    document.documentElement.classList.remove('color-scheme-dark');
  }
}

type Settings = {
  value: ColorScheme;
  label: string;
  icon: (props: IconProps) => JSX.Element;
}[];

const settings: Settings = [
  {
    value: 'light',
    label: 'Light',
    icon: SunIcon,
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: MoonIcon,
  },
  {
    value: 'system',
    label: 'System',
    icon: PcIcon,
  },
];

function useColorScheme() {
  const colorScheme = useUnit($$colorScheme.$colorScheme);
  const colorSchemeUpdated = useUnit($$colorScheme.colorSchemeUpdated);
  const initial = useRef(true);

  useIsomorphicLayoutEffect(() => {
    const colorSchemeFromStorage = localStorage[appConfig.colorSchemeKey];
    if (colorSchemeFromStorage === 'light' || colorSchemeFromStorage === 'dark') {
      colorSchemeUpdated(colorSchemeFromStorage);
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (colorScheme === 'system') {
      localStorage.removeItem(appConfig.colorSchemeKey);
    } else if (colorScheme === 'light' || colorScheme === 'dark') {
      localStorage[appConfig.colorSchemeKey] = colorScheme;
    }
    if (initial.current) {
      initial.current = false;
    } else {
      updateColorSchemeDOM();
    }
  }, [colorScheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener('change', updateColorSchemeDOM);
    } else {
      mediaQuery.addListener(updateColorSchemeDOM);
    }

    function onStorage() {
      updateColorSchemeDOM();
      const colorSchemeFromStorage = localStorage[appConfig.colorSchemeKey];
      if (colorSchemeFromStorage === 'light' || colorSchemeFromStorage === 'dark') {
        colorSchemeUpdated(colorSchemeFromStorage);
      } else {
        colorSchemeUpdated('system');
      }
    }

    window.addEventListener('storage', onStorage);

    return () => {
      if (mediaQuery?.removeEventListener) {
        mediaQuery.removeEventListener('change', updateColorSchemeDOM);
      } else {
        mediaQuery.removeListener(updateColorSchemeDOM);
      }

      window.removeEventListener('storage', onStorage);
    };
  }, [colorSchemeUpdated]);

  return { colorScheme, colorSchemeUpdated };
}

interface ColorSchemeToggleProps {
  panelClassName?: string;
}

const ColorSchemeToggle = createView<ColorSchemeToggleProps>()
  .displayName('ColorSchemeToggle')
  .map(() => {
    const { colorScheme, colorSchemeUpdated } = useColorScheme();
    return {
      colorScheme,
      colorSchemeUpdated,
    };
  })
  .memo()
  .view(({ panelClassName, colorScheme, colorSchemeUpdated }) => (
    <Listbox value={colorScheme} onChange={colorSchemeUpdated}>
      <Listbox.Label className="sr-only">???????????????? ??????????</Listbox.Label>
      <Listbox.Button type="button">
        <span className="dark:hidden">
          <SunIcon className="w-24 h-24" selected={colorScheme !== 'system'} />
        </span>
        <span className="hidden dark:inline">
          <MoonIcon className="w-24 h-24" selected={colorScheme !== 'system'} />
        </span>
      </Listbox.Button>
      <Listbox.Options
        className={clsx(
          'absolute z-50 bottom-full mb-6 right-0 bg-white rounded-lg ring-1 ring-neutral-900/10 shadow-lg overflow-hidden w-144 py-4 text-sm text-neutral-700 font-semibold dark:bg-neutral-800 dark:ring-0 dark:highlight-white/5 dark:text-neutral-300',
          panelClassName,
        )}
      >
        {settings.map(({ value, label, icon: Icon }) => (
          <Listbox.Option key={value} value={value} as={Fragment}>
            {({ active, selected }) => (
              <li
                className={clsx(
                  'py-4 px-8 flex items-center cursor-pointer',
                  selected && 'text-sky-500',
                  active && 'bg-neutral-100 dark:bg-neutral-600/30',
                )}
              >
                <Icon selected={selected} className="w-24 h-24 mr-8" />
                {label}
              </li>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  )).Memo;

const ColorSchemeSelect = createView()
  .displayName('ColorSchemeSelect')
  .map(() => {
    const { colorScheme, colorSchemeUpdated } = useColorScheme();
    const colorSchemeConfig = settings.find((item) => item.value === colorScheme);
    const activeLabel = colorSchemeConfig?.label ?? '';
    return {
      colorScheme,
      colorSchemeUpdated,
      activeLabel,
      controlId: 'color_scheme_toggle',
      labelId: 'color_scheme_toggle_label',
    };
  })
  .view(({ activeLabel, colorScheme, colorSchemeUpdated, controlId, labelId }) => (
    <div className="flex items-center justify-between">
      <label
        id={labelId}
        htmlFor={controlId}
        className="text-neutral-700 font-normal dark:text-neutral-400"
      >
        ?????????????????? ??????????
      </label>
      <div
        className="relative flex items-center ring-1 ring-neutral-900/10 rounded-lg shadow-sm p-4 
      text-neutral-700 font-semibold dark:bg-neutral-600 dark:ring-0 dark:highlight-white/5 dark:text-neutral-200"
      >
        <SunIcon className="w-24 h-24 mr-4 dark:hidden" />
        <svg viewBox="0 0 24 24" fill="none" className="w-24 h-24 mr-4 hidden dark:block">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
            className="fill-transparent"
          />
          <path
            d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
            className="fill-neutral-400"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
            className="fill-neutral-400"
          />
        </svg>
        {activeLabel}
        <svg className="w-24 h-24 ml-4 text-neutral-400" fill="none">
          <path
            d="m15 11-3 3-3-3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <select
          id={controlId}
          aria-labelledby={labelId}
          value={colorScheme}
          onChange={(e) => colorSchemeUpdated(e.target.value as ColorScheme)}
          className="absolute appearance-none inset-0 w-full h-full opacity-0"
        >
          {settings.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  ));

export { ColorSchemeSelect, ColorSchemeToggle, updateColorSchemeDOM };
