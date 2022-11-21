const scrollbarCompensation = ({ theme }) => {
  // var primaryColor = theme('colors.primary');

  return {
    '.c-scrollbar-compensation': {
      paddingRight: 'var(--scrollbar-width)',
    },
  };
};

const visuallyHidden = () => ({
  '.c-visually-hidden': {
    margin: '-1px',
    padding: '0',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clip: ['rect(0 0 0 0)', 'rect(0, 0, 0, 0)'],
    position: 'absolute',
  },
});
module.exports = [scrollbarCompensation, visuallyHidden];
