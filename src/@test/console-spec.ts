import { Console } from '@lib/console'
import { ColorsTextEnable, colorizeText } from '@util/color'

// const console = new Console({
//   context: "Teste",
//   config: { pidName: "Esliph" },
// });

// console.clear();
// console.log("Hello World");
// console.warn("Hello World");
// console.error("Hello World");

const text = 'Hello World'
const colors = [
    'black',
    'red',
    'blue',
    'green',
    'yellow',
    'cyan',
    'white',
    'grey',
    'purple',
]

colorizeText(text, { color: 'black' })

colors.forEach((color) => {
    // console.log(colorizeText(text, `${color}Dark`));
    // console.log(colorizeText(text, color))
    // console.log(colorizeText(text, `${color}Light`))
    // console.log(colorizeText(text, `${color}Bright`));
    // console.log('')
})
