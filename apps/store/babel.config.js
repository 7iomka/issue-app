module.exports = (api) => {
  api.cache(false);

  const presets = ['next/babel', 'effector-http-api/babel-preset'];
  const plugins = [];

  presets.push('patronum/babel-preset');
  plugins.push([
    'effector/babel-plugin',
    {
      factories: [
        'patronum',
        // 'effector-react-form',
        // '@/shared/lib/effector-react-form',
        // '@/shared/lib/effector-react-form/factories/create-form',
        '@/shared/lib/toggler',
        'effector-http-api',
        'effector-view',
      ],
      addLoc: true,
      reactSsr: true,
      debugSids: process.env.NODE_ENV === 'development',
    },
  ]);

  plugins.push([
    'effector/babel-plugin',
    {
      importName: '@/shared/lib/effector-react-form',
      storeCreators: ['createForm'],
      noDefaults: true,
    },
    'createForm',
  ]);

  plugins.push([
    'effector/babel-plugin',
    {
      importName: '@/shared/lib/toggler',
      storeCreators: ['createToggler'],
      noDefaults: true,
    },
    'createToggler',
  ]);
  // plugins.push([
  //   'effector/babel-plugin',
  //   {
  //     importName: '@/shared/lib/factory',
  //     storeCreators: ['createLayout'],
  //   },
  //   'createLayout',
  // ]);

  return {
    presets,
    plugins,
  };
};
