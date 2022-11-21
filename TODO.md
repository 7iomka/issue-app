### Effector issues

https://t.me/effector_ru/273836

### Next.js issues

- When catchAll ends with no-found result, back browser button will not load previous page at all
- Middleware breaks static pages with query params [Link](https://github.com/vercel/next.js/issues/40498)
- Use only clientside rendering for all widgets that rendering product lists
- [Problem with router attach to effector models](https://leeward-trust-101.notion.site/Next-router-with-effector-5dace3de8585460691129b2136821a69)
- Fix production errors (something related with nextjs-effector or smthelse)

### Mantine or UI / React components issues

- Menu still visible event if it target is hidden [Link](https://github.com/mantinedev/mantine/issues/2535)
- Wrong alignment behavior with Tooltip/Popover components [Link](https://github.com/mantinedev/mantine/issues/2500)
- Improve draft realization on `prinority-nav` component (fix startup rerenders)
- Refactor quantity input to be only controlled [Link](https://github.com/mantinedev/mantine/discussions/2635#discussioncomment-3807954)
- Flex Gap is not supported for Safari < 14.1, but used in
  - Carousel: `indicators: {gap: 8}`
  - Group: `root: { gap: theme.fn.size({ size: spacing, sizes: theme.spacing }) }` -- fixed
  - Stack: `root: { gap: theme.fn.size({ size: spacing, sizes: theme.spacing }) }` -- fixed
  - Tabs (TabList): `tabsList: {... if (variant === 'pills') { return { gap: theme.spacing.sm / 2, }; } ... }`
  - Calendar (CalendarBase): `calendarBase: {gap: theme.spacing.md}`
    **Note**: Group and Stack components is a base for most Mantine components. -- fixed
- Sometimes header nav has weird behavior and partially fixed position styles
- Compare component has issue when rightProductSlider is unmounted without change activeRightProduct store value to null.

### Backend API

- ProductCardDto
  - `count` props - still needed in lists?
  - `availability` is number instead of `ProductAvailabilityEnum`
  - `count` is always 0 - user don't have ability to buy?
  - why product statuses is globally across all users?
- normalize endpoints dto for lists - sometimes response contains list > dto, sometimes list > {..., product: dto}
- fix `ProductFavoriteCardDto` - is not actual with `ProductCardDto`
