import Api from "../tools/api";

//Вспомогательные функции
// const isNot =
//   (fn) =>
//   (...args) =>
//     !fn(...args);
// const fnEqual =
//   (fn1, fn2) =>
//   (...args) =>
//     fn1(...args) === fn2(...args);
// const isEqual = (a, b) => a === b;
const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((v, f) => f(v), x);
const partial =
  (fn, apply) =>
  (...args) =>
    fn(...apply, args);
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
// const anyPass =
//   (...fns) =>
//   (...args) => {
//     for (let fn of fns) {
//       if (fn(...args)) return true;
//     }
//     return false;
//   };
const tap = (fn, arg) => {
  fn(arg);
  return arg;
};
const ifElse =
  (fn, onTrue, onFalse) =>
  (...args) => {
    if (fn(...args)) onTrue(...args);
    else onFalse(...args);
  };
const test = (regexp) => (str) => regexp.test(str);
const assoc = curry((obj, prop, value) => {
  var result = {};
  for (var p in obj) {
    result[p] = obj[p];
  }
  result[prop] = value;
  return result;
});
const getProp = (prop) => (props) => props[prop] ? props[prop] : 0;
const andThen = curry((fn, promise) => promise.then(fn));
const otherwise = curry((fn, promise) => promise.then(null, fn));
function flip(fn) {
  const res = (...args) => fn(...args.reverse());
  Object.defineProperty(res, "length", { value: fn.length });
  return res;
}
const curryRight = compose(curry, flip);
//Работа с апи
const api = new Api();

const API_NUMBERS_URL = "https://api.tech/numbers/base";
const API_ANIMALS_URL = "https://animals.tech/";

const callApiWithEmptyParams = curryRight(api.get)({});
const thenCallApiWithEmptyParams = andThen(callApiWithEmptyParams);

const assocNumberToBinary = assoc({ from: 10, to: 2 }, "number");
const getApiResult = compose(String, getProp("result"));
const apiGetNumberBinaryBase = compose(
  api.get(API_NUMBERS_URL),
  assocNumberToBinary
);
//Работа со строками
const testOnlyNumbers = test(/^[0-9]+\.?[0-9]+$/);
const checkLength = (str) => str.length > 2 && str.length < 10;

const validate = allPass(checkLength, testOnlyNumbers);
const roundStringToNumber = compose(Math.floor, Number);
const concat = curry((a, b) => "".concat(a, b));
const concatToAnimalsUrl = compose(concat(API_ANIMALS_URL), String);

//Чистые функции для подсчетов
const length = (p) => p.length;
const square = (n) => n * n;
const modThree = (n) => n % 3;

//Ассинхронные функции для использования в композиции
const thenGetLength = andThen(length);
const thenSquare = andThen(square);
const thenGetModThree = andThen(modThree);
const thenGetApiResult = andThen(getApiResult);
const thenConcatToAnimalsUrl = andThen(concatToAnimalsUrl);

//Цепочка вычеслений
const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const tapLog = curry(tap)(writeLog);
  const thenTapLog = andThen(tapLog);
  const thenHandleSuccess = andThen(handleSuccess);
  const otherwiseHandleError = otherwise(handleError);

  const sequenceComposition = compose(
    otherwiseHandleError,
    thenHandleSuccess, //9
    thenGetApiResult, //8
    thenCallApiWithEmptyParams,
    thenConcatToAnimalsUrl,
    thenTapLog, //7
    thenGetModThree,
    thenTapLog, //6
    thenSquare,
    thenTapLog, //5
    thenGetLength,
    thenTapLog, //4
    thenGetApiResult,
    apiGetNumberBinaryBase,
    tapLog, //3
    roundStringToNumber
  );
  const handleValidationError = partial(handleError, ["ValidationError"]);

  const checkCondition = ifElse(
    validate,
    sequenceComposition,
    handleValidationError
  ); //2
  const logAndRunCondition = compose(checkCondition, tapLog); //1

  logAndRunCondition(value);
};

export default processSequence;
