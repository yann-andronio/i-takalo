// module.exports = {
//   presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
//   plugins: [
//     'react-native-worklets/plugin',
//   ],
// };

module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    'react-native-worklets/plugin',
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',   
        path: '.env',
        safe: false, 
        allowUndefined: true  
      }
    ]
  ],
};
