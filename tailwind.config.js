// Colours are CSS variables (space-separated RGB) defined per theme in src/styles.css,
// so one markup serves the current theme and the new-logo themes (?theme=metal | ?theme=light).
const c = name => `rgb(var(--c-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.js'],
  theme: { extend: {
    colors: {
      // surfaces
      ink: c('ink'), char: c('char'), char2: c('char2'), paper: c('paper'),
      // accent
      copper: c('copper'), copperl: c('copperl'), onaccent: c('onaccent'),
      // text: hi = headings, fg* = body tints, tech/pts = hero sub-lines, steel* = muted
      hi: c('hi'), fg: c('fg'), fg2: c('fg2'), fg3: c('fg3'), fg4: c('fg4'), fg5: c('fg5'), tech: c('tech'), pts: c('pts'),
      steel: c('steel'), steeld: c('steeld'),
      // text / lines on the paper band (#deploy)
      paperink: c('paperink'), papermuted: c('papermuted'), paperline: c('paperline'),
      // hairlines, darkest to lightest on the default theme; edge = the nav's bottom border base
      line: c('line'), line2: c('line2'), line3: c('line3'), line4: c('line4'), line5: c('line5'), boxline: c('boxline'), edge: c('edge'),
    },
    fontFamily: { display: ['Archivo', 'Arial Narrow', 'Arial', 'sans-serif'], body: ['"IBM Plex Sans"', 'Helvetica Neue', 'Arial', 'sans-serif'] },
  } },
};
