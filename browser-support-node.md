## Browser support

Mantine is tested on real devices in the following browsers before each minor and major release: Chrome, Safari, Firefox, Edge, Safari for iOS, Chrome for Android. Testing in other browsers is not performed.

All Mantine components and hooks were tested to work in the following browsers:

- Firefox 63+ (released October 2018)
- Chromium browsers 84+ – Chrome, Edge, Chrome for Android, etc. (released July 2020)
- Safari 14.1+ (released April 2021)
- Safari for iOS 14.5+ (released April 2021)
- IE (any version) is not supported

In most cases Mantine components and hooks will work in any browser that is supported by your react version that you are using.
But you may experience some minor visual bugs caused by unsupported CSS properties (for example flexbox gap).

Workaround for unsupported css properties:

- `gap` in flex layout, for example for groups use margin on children elements
  ```tsx
  <Checkbox.Group orientation="vertical" spacing={0}>
    <Checkbox mb={SPACE_NEEDED_PUT_HERE} />
  </Checkbox.Group>
  ```
