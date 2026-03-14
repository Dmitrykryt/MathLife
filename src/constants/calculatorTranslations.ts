import { Locale } from '@/types'

type CalculatorTranslation = {
  name: { ru: string; en: string }
  description: { ru: string; en: string }
}

// Translations for all calculators by slug
export const calculatorTranslations: Record<string, CalculatorTranslation> = {
  // === BASIC ===
  arithmetic: {
    name: { ru: 'Арифметический калькулятор', en: 'Arithmetic Calculator' },
    description: { ru: 'Базовые арифметические операции: сложение, вычитание, умножение, деление', en: 'Basic arithmetic operations: addition, subtraction, multiplication, division' },
  },
  percentage: {
    name: { ru: 'Калькулятор процентов', en: 'Percentage Calculator' },
    description: { ru: 'Расчет процентов, процентного изменения, скидок и наценок', en: 'Calculate percentages, percentage change, discounts and markups' },
  },
  exponent: {
    name: { ru: 'Степени и корни', en: 'Powers and Roots' },
    description: { ru: 'Возведение в степень, извлечение корней любой степени', en: 'Exponentiation and roots of any degree' },
  },
  fractions: {
    name: { ru: 'Калькулятор дробей', en: 'Fractions Calculator' },
    description: { ru: 'Операции с обыкновенными дробями: сложение, вычитание, умножение, деление', en: 'Operations with fractions: addition, subtraction, multiplication, division' },
  },
  'gcd-lcm': {
    name: { ru: 'НОД и НОК', en: 'GCD and LCM' },
    description: { ru: 'Нахождение наибольшего общего делителя и наименьшего общего кратного', en: 'Find greatest common divisor and least common multiple' },
  },

  // === SCIENTIFIC ===
  trigonometry: {
    name: { ru: 'Тригонометрический калькулятор', en: 'Trigonometry Calculator' },
    description: { ru: 'Синус, косинус, тангенс и обратные тригонометрические функции', en: 'Sine, cosine, tangent and inverse trigonometric functions' },
  },
  logarithm: {
    name: { ru: 'Логарифмический калькулятор', en: 'Logarithm Calculator' },
    description: { ru: 'Натуральные и десятичные логарифмы, логарифмы по произвольному основанию', en: 'Natural and decimal logarithms, logarithms with any base' },
  },
  'complex-numbers': {
    name: { ru: 'Комплексные числа', en: 'Complex Numbers' },
    description: { ru: 'Операции с комплексными числами, преобразование форм записи', en: 'Operations with complex numbers, form conversion' },
  },
  factorial: {
    name: { ru: 'Факториал и перестановки', en: 'Factorial and Permutations' },
    description: { ru: 'Вычисление факториала, перестановок, сочетаний', en: 'Calculate factorial, permutations, combinations' },
  },
  expression: {
    name: { ru: 'Вычисление выражений', en: 'Expression Calculator' },
    description: { ru: 'Вычисление математических выражений с переменными', en: 'Evaluate mathematical expressions with variables' },
  },

  // === ALGEBRA ===
  'linear-equation': {
    name: { ru: 'Линейные уравнения', en: 'Linear Equations' },
    description: { ru: 'Решение линейных уравнений с одной и несколькими переменными', en: 'Solve linear equations with one or more variables' },
  },
  'quadratic-equation': {
    name: { ru: 'Квадратные уравнения', en: 'Quadratic Equations' },
    description: { ru: 'Решение квадратных уравнений, дискриминант, корни', en: 'Solve quadratic equations, discriminant, roots' },
  },
  'cubic-equation': {
    name: { ru: 'Кубические уравнения', en: 'Cubic Equations' },
    description: { ru: 'Решение кубических уравнений, формулы Кардано', en: 'Solve cubic equations, Cardano formulas' },
  },
  'systems-equations': {
    name: { ru: 'Системы уравнений', en: 'Systems of Equations' },
    description: { ru: 'Решение систем линейных уравнений различными методами', en: 'Solve systems of linear equations using various methods' },
  },
  polynomial: {
    name: { ru: 'Многочлены', en: 'Polynomials' },
    description: { ru: 'Операции с многочленами: сложение, умножение, деление, разложение', en: 'Operations with polynomials: addition, multiplication, division, factoring' },
  },
  inequalities: {
    name: { ru: 'Неравенства', en: 'Inequalities' },
    description: { ru: 'Решение линейных и квадратных неравенств', en: 'Solve linear and quadratic inequalities' },
  },
  progressions: {
    name: { ru: 'Прогрессии', en: 'Progressions' },
    description: { ru: 'Арифметическая и геометрическая прогрессии', en: 'Arithmetic and geometric progressions' },
  },

  // === GEOMETRY ===
  triangle: {
    name: { ru: 'Треугольник', en: 'Triangle' },
    description: { ru: 'Площадь, периметр, углы, теоремы треугольника', en: 'Area, perimeter, angles, triangle theorems' },
  },
  circle: {
    name: { ru: 'Круг и окружность', en: 'Circle and Circumference' },
    description: { ru: 'Площадь, длина окружности, сегменты, секторы', en: 'Area, circumference, segments, sectors' },
  },
  rectangle: {
    name: { ru: 'Прямоугольник и квадрат', en: 'Rectangle and Square' },
    description: { ru: 'Площадь, периметр, диагонали прямоугольника и квадрата', en: 'Area, perimeter, diagonals of rectangle and square' },
  },
  polygon: {
    name: { ru: 'Правильные многоугольники', en: 'Regular Polygons' },
    description: { ru: 'Площадь и периметр правильных многоугольников', en: 'Area and perimeter of regular polygons' },
  },
  sphere: {
    name: { ru: 'Сфера и шар', en: 'Sphere and Ball' },
    description: { ru: 'Площадь поверхности и объем сферы', en: 'Surface area and volume of a sphere' },
  },
  cylinder: {
    name: { ru: 'Цилиндр', en: 'Cylinder' },
    description: { ru: 'Объем и площадь поверхности цилиндра', en: 'Volume and surface area of a cylinder' },
  },
  cone: {
    name: { ru: 'Конус', en: 'Cone' },
    description: { ru: 'Объем и площадь поверхности конуса', en: 'Volume and surface area of a cone' },
  },
  pyramid: {
    name: { ru: 'Пирамида', en: 'Pyramid' },
    description: { ru: 'Объем и площадь поверхности пирамиды', en: 'Volume and surface area of a pyramid' },
  },
  coordinates: {
    name: { ru: 'Координаты и расстояния', en: 'Coordinates and Distances' },
    description: { ru: 'Расстояние между точками, середина отрезка на плоскости и в пространстве', en: 'Distance between points, midpoint on plane and in space' },
  },
  vector: {
    name: { ru: 'Векторы', en: 'Vectors' },
    description: { ru: 'Операции с векторами: сложение, скалярное и векторное произведение', en: 'Vector operations: addition, dot and cross product' },
  },

  // === MATRICES ===
  'matrix-operations': {
    name: { ru: 'Операции с матрицами', en: 'Matrix Operations' },
    description: { ru: 'Сложение, вычитание, умножение матриц', en: 'Matrix addition, subtraction, multiplication' },
  },
  'matrix-determinant': {
    name: { ru: 'Определитель матрицы', en: 'Matrix Determinant' },
    description: { ru: 'Вычисление определителя матрицы любого порядка', en: 'Calculate determinant of any order matrix' },
  },
  'matrix-inverse': {
    name: { ru: 'Обратная матрица', en: 'Inverse Matrix' },
    description: { ru: 'Нахождение обратной матрицы', en: 'Find the inverse of a matrix' },
  },
  'matrix-transpose': {
    name: { ru: 'Транспонирование матрицы', en: 'Matrix Transpose' },
    description: { ru: 'Транспонирование матрицы и её свойства', en: 'Transpose a matrix and its properties' },
  },
  'matrix-rank': {
    name: { ru: 'Ранг матрицы', en: 'Matrix Rank' },
    description: { ru: 'Вычисление ранга матрицы', en: 'Calculate the rank of a matrix' },
  },
  eigenvalues: {
    name: { ru: 'Собственные числа и векторы', en: 'Eigenvalues and Eigenvectors' },
    description: { ru: 'Нахождение собственных чисел и собственных векторов матрицы', en: 'Find eigenvalues and eigenvectors of a matrix' },
  },

  // === STATISTICS ===
  'basic-statistics': {
    name: { ru: 'Основные статистики', en: 'Basic Statistics' },
    description: { ru: 'Среднее, медиана, мода, дисперсия, стандартное отклонение', en: 'Mean, median, mode, variance, standard deviation' },
  },
  probability: {
    name: { ru: 'Теория вероятностей', en: 'Probability Theory' },
    description: { ru: 'Расчет вероятностей событий, комбинации', en: 'Calculate event probabilities, combinations' },
  },
  distributions: {
    name: { ru: 'Распределения', en: 'Distributions' },
    description: { ru: 'Нормальное, биномиальное, пуассоновское распределения', en: 'Normal, binomial, Poisson distributions' },
  },
  correlation: {
    name: { ru: 'Корреляция и регрессия', en: 'Correlation and Regression' },
    description: { ru: 'Коэффициент корреляции, линейная регрессия', en: 'Correlation coefficient, linear regression' },
  },
  'hypothesis-testing': {
    name: { ru: 'Проверка гипотез', en: 'Hypothesis Testing' },
    description: { ru: 't-тест, хи-квадрат, проверка статистических гипотез', en: 't-test, chi-square, statistical hypothesis testing' },
  },
  'combinations-permutations': {
    name: { ru: 'Комбинации и перестановки', en: 'Combinations and Permutations' },
    description: { ru: 'Расчет числа сочетаний и перестановок', en: 'Calculate number of combinations and permutations' },
  },

  // === FINANCE ===
  'loan-calculator': {
    name: { ru: 'Кредитный калькулятор', en: 'Loan Calculator' },
    description: { ru: 'Расчет ежемесячного платежа, переплаты по кредиту', en: 'Calculate monthly payment, loan overpayment' },
  },
  'deposit-calculator': {
    name: { ru: 'Депозитный калькулятор', en: 'Deposit Calculator' },
    description: { ru: 'Расчет дохода по депозиту с капитализацией и без', en: 'Calculate deposit income with and without capitalization' },
  },
  'investment-calculator': {
    name: { ru: 'Инвестиционный калькулятор', en: 'Investment Calculator' },
    description: { ru: 'Расчет доходности инвестиций, сложный процент', en: 'Calculate investment returns, compound interest' },
  },
  'vat-calculator': {
    name: { ru: 'Калькулятор НДС', en: 'VAT Calculator' },
    description: { ru: 'Выделение и начисление НДС', en: 'Calculate and allocate VAT' },
  },
  'currency-converter': {
    name: { ru: 'Конвертер валют', en: 'Currency Converter' },
    description: { ru: 'Конвертация валют по актуальным курсам', en: 'Convert currencies at current rates' },
  },
  'inflation-calculator': {
    name: { ru: 'Калькулятор инфляции', en: 'Inflation Calculator' },
    description: { ru: 'Расчет реальной стоимости денег с учетом инфляции', en: 'Calculate real value of money accounting for inflation' },
  },

  // === CONVERTERS ===
  'length-converter': {
    name: { ru: 'Конвертер длины', en: 'Length Converter' },
    description: { ru: 'Перевод единиц длины: метры, футы, дюймы, мили', en: 'Convert length units: meters, feet, inches, miles' },
  },
  'weight-converter': {
    name: { ru: 'Конвертер веса', en: 'Weight Converter' },
    description: { ru: 'Перевод единиц массы: килограммы, фунты, унции', en: 'Convert mass units: kilograms, pounds, ounces' },
  },
  'temperature-converter': {
    name: { ru: 'Конвертер температуры', en: 'Temperature Converter' },
    description: { ru: 'Перевод температуры: Цельсий, Фаренгейт, Кельвин', en: 'Convert temperature: Celsius, Fahrenheit, Kelvin' },
  },
  'area-converter': {
    name: { ru: 'Конвертер площади', en: 'Area Converter' },
    description: { ru: 'Перевод единиц площади: квадратные метры, акры, гектары', en: 'Convert area units: square meters, acres, hectares' },
  },
  'volume-converter': {
    name: { ru: 'Конвертер объема', en: 'Volume Converter' },
    description: { ru: 'Перевод единиц объема: литры, галлоны, кубические метры', en: 'Convert volume units: liters, gallons, cubic meters' },
  },
  'speed-converter': {
    name: { ru: 'Конвертер скорости', en: 'Speed Converter' },
    description: { ru: 'Перевод единиц скорости: км/ч, м/с, мили/ч', en: 'Convert speed units: km/h, m/s, mph' },
  },
  'time-converter': {
    name: { ru: 'Конвертер времени', en: 'Time Converter' },
    description: { ru: 'Перевод единиц времени: секунды, часы, дни', en: 'Convert time units: seconds, hours, days' },
  },
  'data-converter': {
    name: { ru: 'Конвертер данных', en: 'Data Converter' },
    description: { ru: 'Перевод единиц информации: байты, килобайты, мегабайты', en: 'Convert data units: bytes, kilobytes, megabytes' },
  },
  'angle-converter': {
    name: { ru: 'Конвертер углов', en: 'Angle Converter' },
    description: { ru: 'Перевод углов: градусы, радианы, грады', en: 'Convert angles: degrees, radians, gradians' },
  },

  // === ENGINEERING ===
  'physics-calculator': {
    name: { ru: 'Физический калькулятор', en: 'Physics Calculator' },
    description: { ru: 'Основные физические формулы: скорость, ускорение, сила', en: 'Basic physics formulas: velocity, acceleration, force' },
  },
  'electrical-calculator': {
    name: { ru: 'Электротехнический калькулятор', en: 'Electrical Calculator' },
    description: { ru: 'Закон Ома, мощность, сопротивление электрических цепей', en: 'Ohms law, power, electrical circuit resistance' },
  },
  thermodynamics: {
    name: { ru: 'Термодинамика', en: 'Thermodynamics' },
    description: { ru: 'Расчеты термодинамических процессов', en: 'Thermodynamic process calculations' },
  },
  'fluid-mechanics': {
    name: { ru: 'Гидравлика', en: 'Fluid Mechanics' },
    description: { ru: 'Расчеты потока жидкости, давление, расход', en: 'Fluid flow calculations, pressure, flow rate' },
  },

  // === SPECIALIZED ===
  'graphing-calculator': {
    name: { ru: 'Графический калькулятор', en: 'Graphing Calculator' },
    description: { ru: 'Построение 2D и 3D графиков функций', en: 'Plot 2D and 3D function graphs' },
  },
  derivative: {
    name: { ru: 'Производные', en: 'Derivatives' },
    description: { ru: 'Вычисление производных функций', en: 'Calculate derivatives of functions' },
  },
  integral: {
    name: { ru: 'Интегралы', en: 'Integrals' },
    description: { ru: 'Вычисление определенных и неопределенных интегралов', en: 'Calculate definite and indefinite integrals' },
  },
  limits: {
    name: { ru: 'Пределы', en: 'Limits' },
    description: { ru: 'Вычисление пределов функций', en: 'Calculate limits of functions' },
  },
  'fourier-transform': {
    name: { ru: 'Преобразование Фурье', en: 'Fourier Transform' },
    description: { ru: 'Быстрое преобразование Фурье (FFT)', en: 'Fast Fourier Transform (FFT)' },
  },
  'number-theory': {
    name: { ru: 'Теория чисел', en: 'Number Theory' },
    description: { ru: 'Простые числа, разложение на множители, делители', en: 'Prime numbers, factorization, divisors' },
  },
  'date-calculator': {
    name: { ru: 'Калькулятор дат', en: 'Date Calculator' },
    description: { ru: 'Разница между датами, добавление дней', en: 'Difference between dates, add days' },
  },
  'bmi-calculator': {
    name: { ru: 'Индекс массы тела', en: 'BMI Calculator' },
    description: { ru: 'Расчет ИМТ и интерпретация результата', en: 'Calculate BMI and interpret the result' },
  },
}

// Helper function to get translated calculator name
export function getCalculatorName(slug: string, language: Locale): string {
  const translation = calculatorTranslations[slug]
  if (!translation) return slug
  return translation.name[language] || translation.name.ru
}

// Helper function to get translated calculator description
export function getCalculatorDescription(slug: string, language: Locale): string {
  const translation = calculatorTranslations[slug]
  if (!translation) return ''
  return translation.description[language] || translation.description.ru
}
