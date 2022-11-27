import { useUnit, useStore, useEvent } from 'effector-react/scope';

// UNCOMMENT THIS version TO SEE BUG (https://t.me/effector_ru/280689)
// export const useToggler = (togglerInstance: any) => {
//   const { $isOpen, ...togglerEvents } = togglerInstance;
//   const isOpen = useUnit($isOpen);
//   const events = useUnit({ ...togglerEvents });

//   return {
//     isOpen,
//     ...events
//   };
// };

export const useToggler = (togglerInstance: any) => {
  const { $isOpen, ...togglerEvents } = togglerInstance;
  const isOpen = useStore($isOpen);
  const open = useEvent(togglerEvents.open);
  const close = useEvent(togglerEvents.close);
  const toggle = useEvent(togglerEvents.toggle);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};
