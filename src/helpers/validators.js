//Вспомоательные функции
const isNot =
  (fn) =>
  (...args) =>
    !fn(...args);
const fnEqual =
  (fn1, fn2) =>
  (...args) =>
    fn1(...args) === fn2(...args);
const isEqual = (a, b) => a === b;
const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((v, f) => f(v), x);
const curry =
  (fn) =>
  (...args) =>
    args.length >= fn.length ? fn(...args) : curry(fn.bind(null, ...args));
const allPass =
  (...fns) =>
  (...args) => {
    for (let fn of fns) {
      if (!fn(...args)) return false;
    }
    return true;
  };
const anyPass =
  (...fns) =>
  (...args) => {
    for (let fn of fns) {
      if (fn(...args)) return true;
    }
    return false;
  };

//Геттеры
const getProp = (prop) => (props) => props[prop] ? props[prop] : 0;
const getStar = getProp("star");
const getCircle = getProp("circle");
const getSquare = getProp("square");
const getTriangle = getProp("triangle");

//Предикаты
const isEqualCurried = curry(isEqual);
const isRed = isEqualCurried("red");
const isGreen = isEqualCurried("green");
const isBlue = isEqualCurried("blue");
const isOrange = isEqualCurried("orange");
const isWhite = isEqualCurried("white");

//Композиции геттеров и сравнений цветов
const isRedStar = compose(isRed, getStar);
// const isBlueStar = compose(isBlue, getStar);
// const isGreenStar = compose(isGreen, getStar);
// const isOrangeStar = compose(isOrange, getStar);
const isWhiteStar = compose(isWhite, getStar);
const isNotRedStar = isNot(isRedStar);
const isNotWhiteStar = isNot(isWhiteStar);

// const isRedCircle = compose(isRed, getCircle);
const isBlueCircle = compose(isBlue, getCircle);
// const isGreenCircle = compose(isGreen, getCircle);
// const isOrangeCircle = compose(isOrange, getCircle);
const isWhiteCircle = compose(isWhite, getCircle);

// const isRedSquare = compose(isRed, getSquare);
// const isBlueSquare = compose(isBlue, getSquare);
const isGreenSquare = compose(isGreen, getSquare);
const isOrangeSquare = compose(isOrange, getSquare);
const isWhiteSquare = compose(isWhite, getSquare);
const isNotWhiteSquare = isNot(isWhiteSquare);

// const isRedTriangle = compose(isRed, getTriangle);
// const isBlueTriangle = compose(isBlue, getTriangle);
const isGreenTriangle = compose(isGreen, getTriangle);
// const isOrangeTriangle = compose(isOrange, getTriangle);
const isWhiteTriangle = compose(isWhite, getTriangle);
const isNotWhiteTriangle = isNot(isWhiteTriangle);

//
const numberOfColors = (props) =>
  Object.values(props).reduce((acc, cur) => {
    acc[cur] = acc[cur] ? acc[cur] + 1 : 1;
    return acc;
  }, {});
const numberOfColorsNoWhite = (props) =>
  Object.values(props).reduce((acc, cur) => {
    acc[cur] = cur !== "white" ? (acc[cur] ? acc[cur] + 1 : 1) : undefined;
    return acc;
  }, {});
const numberOfRed = compose(getProp("red"), numberOfColors);
const numberOfBlue = compose(getProp("blue"), numberOfColors);
const numberOfGreen = compose(getProp("green"), numberOfColors);
// const numberOfOrange = numberOfProp('orange');
// const numberOfWhite = numberOfProp('white');

//Сравнения
const greaterOrEqualsThen = curry((a, b) => b >= a);
const greaterOrEqualsThenTwo = greaterOrEqualsThen(2);
const greaterOrEqualsThenThree = greaterOrEqualsThen(3);
const equalToFour = isEqualCurried(4);
const equalToTwo = isEqualCurried(2);
const equalToOne = isEqualCurried(1);
const redGreaterOrEqualsThenThree = compose(
  greaterOrEqualsThenThree,
  getProp("red")
);
const greenGreaterOrEqualsThenThree = compose(
  greaterOrEqualsThenThree,
  getProp("green")
);
const blueGreaterOrEqualsThenThree = compose(
  greaterOrEqualsThenThree,
  getProp("blue")
);
const orangeGreaterOrEqualsThenThree = compose(
  greaterOrEqualsThenThree,
  getProp("orange")
);
const anyValueGreaterOrEqualsThenThreeNoWhite = anyPass(
  redGreaterOrEqualsThenThree,
  greenGreaterOrEqualsThenThree,
  blueGreaterOrEqualsThenThree,
  orangeGreaterOrEqualsThenThree
);

//Частыне случаи
const oneRedFigure = compose(equalToOne, numberOfRed);
const twoGreenFigures = compose(equalToTwo, numberOfGreen);
const allHasColor = (prop) =>
  compose(equalToFour, getProp(prop), numberOfColors);
const squareEqualsTriangle = fnEqual(getSquare, getTriangle);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass(
  isRedStar,
  isGreenSquare,
  isWhiteCircle,
  isWhiteTriangle
);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(greaterOrEqualsThenTwo, numberOfGreen);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = fnEqual(numberOfRed, numberOfBlue);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass(isBlueCircle, isRedStar, isOrangeSquare);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
  anyValueGreaterOrEqualsThenThreeNoWhite,
  numberOfColorsNoWhite
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass(
  oneRedFigure,
  twoGreenFigures,
  isGreenTriangle
);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allHasColor("orange");

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass(isNotRedStar, isNotWhiteStar);

// 9. Все фигуры зеленые.
export const validateFieldN9 = allHasColor("green");

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass(
  squareEqualsTriangle,
  isNotWhiteTriangle,
  isNotWhiteSquare
);
