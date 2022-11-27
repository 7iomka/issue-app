import { useUnit } from 'effector-react/scope';

// THis version product bug described here:
// https://t.me/effector_ru/280689
export const useToggler = (togglerInstance: any) => {
  const { $isOpen, ...togglerEvents } = togglerInstance;
  const isOpen = useUnit($isOpen);
  const events = useUnit({ ...togglerEvents });

  return {
    isOpen,
    ...events,
  };
};
