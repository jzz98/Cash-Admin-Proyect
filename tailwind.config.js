/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/views/**/*.ejs',
    './src/JS/**/*.js'
  ],
  theme: {
    extend: {
      colors:{
        'aquaPers': '#00D6BC',
        'grayPers': '#3333',
        'gray2Pers': '#334155',
        'whiteSmoke': '#F1F5F9',
        'whiteSomke2': '#F9FAFD',
      },
      fontFamily:{
        'cambria':['Cambria', 'Cochin', 'Georgia', 'Times', 'Times New Roman', 'serif'],
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
};
