import { createMedia } from '@7iomka/media';
import { breakpoints } from '@steklo24/config/theme';

const AppMedia = createMedia({
  breakpoints,
});

// Make styles for injection into the header of the page
const mediaStyles = AppMedia.createMediaStyle();

const { Media, MediaContextProvider } = AppMedia;

export { breakpoints, Media, MediaContextProvider, mediaStyles };
