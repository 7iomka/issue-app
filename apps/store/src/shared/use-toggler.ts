import { useUnit } from 'effector-react';

export const useToggler = (togglerInstance: any) => {
  const { $isOpen, ...togglerEvents } = togglerInstance;
  const isOpen = useUnit($isOpen);
  const events = useUnit({ ...togglerEvents });

  return {
    isOpen,
    ...events,
  };
};
