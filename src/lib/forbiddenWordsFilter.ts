/**
 * Умный фильтр нецензурных слов
 * Использует несколько методов обнаружения:
 * - Собственный алгоритм с транслитерацией
 * - Библиотека bad-words (английский)
 * - Библиотека leo-profanity (мультиязычный)
 * - Библиотека obscenity (английский с детекцией обхода)
 */

import { Filter } from 'bad-words'
import leoProfanity from 'leo-profanity'
import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'obscenity'

// Инициализация библиотек
const badWordsFilter = new Filter()

// Инициализация leo-profanity с русским и английским словарём
leoProfanity.loadDictionary('ru')
leoProfanity.loadDictionary('en')

// Инициализация obscenity
const obscenityMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
})

// Базовый список запрещённых корней и слов
const FORBIDDEN_ROOTS = [
  // Основные корни
  'хуй', 'хуя', 'хуе', 'хуи', 'хую', 'хуюшк',
  'пизд', 'пизда', 'пизды', 'пизде', 'пизду',
  'еб', 'еба', 'еби', 'ебл', 'ёба', 'ёби', 'ебан',
  'бля', 'бляд', 'бляди',
  'сук', 'сука', 'суки', 'суч', 'сучк',
  'гандон', 'гондон',
  'муд', 'мудак', 'мудил',
  'долбо', 'долба',
  'пидор', 'пидар', 'пидр', 'педик',
  'гнид',
  'сран', 'ссан',
  'залуп',
  'урод',
  'шлюх', 'шлю',
  'простит',
  'даун',
  'дебил',
  
  // Половые органы и термины
  'пенис', 'пеніс', 'член', 'хер',
  'фаллос', 'фалос', 'фалос',
  'вагин', 'вагіна',
  'яйц', 'яичк',
  'анус', 'жоп', 'жопа', 'поп',
  'клитор',
  'сперм',
  'секс',
  'фаллос',
  'фекал',
  'клоак',
  'целк',
  'влагал',
  'манд', 'манда', 'мандавошк',
  'письк', 'писюл',
  
  // Производные от матов
  'хуев', 'хуё', 'хуи', 'хуйн', 'хуяк', 'хуяр', 'хуяч',
  'пиздю', 'пиздя', 'пиздё',
  'ебан', 'ебуч', 'ебён',
  'блядов', 'блядств',
  'сукин', 'сучар',
  'мудоеб',
  'долбоёб',
  'пидорас', 'педераст',
  'срень',
  
  // Слова из списка
  'аборт',
  'бздун', 'бздюх', 'беспезды',
  'блуд', 'блядво', 'блядеха', 'блядина', 'блядист', 'блядк', 'блядов', 'блядун', 'блядюг', 'блядюр', 'блядюшк',
  'бордель',
  'вафлист',
  'вжоп', 'влагал',
  'вздрачив', 'вздроч', 'вздрюч',
  'въеб', 'въебаш', 'въебен',
  'вислозад',
  'вхуяк', 'вхуяр', 'вхуяч', 'вхуяш',
  'выбляд',
  'выеб', 'выср', 'высс',
  'говн', 'говнец', 'говнист', 'говнод', 'говноед', 'говномес', 'говномер', 'говнос', 'говнюк',
  'голожоп',
  'гомик', 'гомосек',
  'гонорея',
  'давалка',
  'двужопн',
  'дерьм', 'дерьмов',
  'дилдо',
  'додроч',
  'доеб', 'доебен',
  'допизд', 'допиздю', 'допиздобол',
  'дотрах',
  'дохуй', 'дохуяк', 'дохуяр', 'дохуяч',
  'дрисн', 'дрист', 'дроч', 'дрюч',
  'дурак', 'дуроеб',
  'ебал', 'ебальн', 'ебальник', 'ебанашк', 'ебанут', 'ебануть', 'ебат', 'ебаться', 'ебитесь', 'еблысь', 'ебн',
  'жирнозад', 'жопоеб', 'жопенц', 'жопищ', 'жопк', 'жопн', 'жополиз', 'жопоног', 'жопочк', 'жопочн', 'жопств',
  'забзд', 'забляд',
  'задр', 'задрачив', 'задроч', 'задрюч',
  'заеб', 'заебаш', 'заебен',
  'запизд', 'запиздобол', 'запиздю', 'запиздяр', 'запиздях', 'запиздяч', 'запиздяш',
  'засран', 'засрат', 'засс',
  'затрах',
  'захуяк', 'захуяр', 'захуяч', 'захуяш',
  'злоебуч',
  'издроч', 'изманд', 'изъеб',
  'испизд', 'испражн', 'исхуяк', 'исхуяр',
  'какашк', 'какать',
  'кастрат', 'кастриров',
  'кнахт',
  'конч',
  'косоеб',
  'кривохуй',
  'курв',
  'лахудр',
  'лох', 'лохудр', 'лохматк',
  'мастурб', 'минет', 'минетч',
  'мозгоеб',
  'мокрожоп', 'мокропизд',
  'моч',
  'мудашв', 'мудильщ', 'мудист',
  'наеб', 'набзд', 'наблюд',
  'надроч', 'надрист',
  'накак',
  'напизд', 'напиздю', 'напиздяр',
  'наср', 'насс',
  'натрах',
  'нахуяк', 'нахуяр', 'нахуяч', 'нахуяш',
  'недоеб', 'недонос',
  'неебущ',
  'нищеебств',
  'обдрист', 'обдроч', 'обоср', 'обосс', 'обпизд', 'обтрах', 'обхуяр', 'объеб',
  'одинхуй', 'однапизд', 'однохуйствен',
  'оебаш', 'оебен',
  'опедераст', 'опизден', 'опизд', 'остоеб', 'остопизд', 'остохуел',
  'отдрачив', 'отдроч', 'отпизд', 'отсасыв', 'отсос', 'оттрах', 'отхерач', 'отхуй', 'отхуяк', 'отхуяр', 'отхуяч', 'отхуяш', 'отъеб',
  'очк', 'пердн', 'пердеж', 'пердет', 'пердун',
  'падл', 'падлюк',
  'педераст', 'педерасти', 'педрил',
  'пеж',
  'перебзд', 'передрачив', 'передроч', 'перееб', 'перетрах', 'перехуй', 'перехуяк', 'перехуяр', 'перехуяч',
  'пиздан', 'пиздат', 'пизден', 'пизденыш', 'пиздеть', 'пиздец', 'пиздищ', 'пиздобол', 'пиздов', 'пиздолиз', 'пиздомол', 'пиздосос', 'пиздоход', 'пиздуй', 'пиздун', 'пиздюг', 'пиздюлей', 'пиздюл', 'пиздюлин', 'пиздюк', 'пиздюшк', 'пиздяк', 'пиздятин', 'пиздяч',
  'плоскозад',
  'поеб', 'поблуд', 'побляд',
  'подоср', 'подосс', 'подпизд', 'подпиздобол', 'подпиздю', 'подпиздяр', 'подпиздях', 'подпиздяч', 'подпиздяш', 'подрист', 'подроч', 'подхуяк', 'подхуяр', 'подхуяч', 'подхуяш', 'подъеб',
  'поперд',
  'попизд', 'попиздобол', 'попиздов', 'попиздох', 'попиздош', 'попиздюк', 'попиздюл', 'попиздюр', 'попиздюх', 'попиздяк', 'попиздяр', 'попиздях', 'попиздяч', 'попиздяш', 'попизж',
  'потаск', 'потрах',
  'похер', 'похуист', 'похуяк', 'похуяр', 'похуяч', 'похуяш',
  'поц',
  'пошмар',
  'приеб', 'приебаш', 'приебен', 'приебур', 'прижоп', 'прикинуть', 'приманд', 'примандох', 'примандош', 'примандюк', 'примандех', 'примандюл', 'примандюр', 'примандяк', 'примандяр', 'примандях', 'примандяч', 'примандяш', 'примудох', 'припизд', 'припиздобол', 'припиздох', 'припиздош', 'припиздюк', 'припиздюл', 'припиздюр', 'припиздюх', 'припиздяк', 'припиздяр', 'припиздях', 'припиздяч', 'припиздяш', 'припиздрон', 'припизж', 'прихуяк', 'прихуяр', 'прихуяч', 'прихуяш', 'притрах', 'пробляд', 'продрачив', 'продроч', 'проеб', 'пропизд', 'пропиздобол', 'пропиздох', 'пропиздош', 'пропиздюк', 'пропиздюл', 'пропиздюр', 'пропиздюх', 'пропиздяк', 'пропиздяр', 'пропиздях', 'пропиздяч', 'пропиздяш', 'пропизж', 'пропиздон', 'прохуяк', 'прохуяр', 'прохуяч', 'прохуяш',
  'разблюд', 'раздроч', 'раззалуп', 'разнохуйствен', 'разъеб', 'разъебаш', 'разъебен', 'распизд', 'распиздобол', 'распиздох', 'распиздош', 'распиздон', 'распиздяй', 'расхуяр', 'расхуяч',
  'сдроч', 'сестроеб', 'сифилит', 'сифилюг', 'скурв', 'сманд',
  'сперматозавр',
  'спизд',
  'стерв', 'стервоз',
  'сукин', 'сукин', 'суходрочк',
  'сучар', 'сучь',
  'схуяк', 'схуяр', 'схуяч',
  'съеб', 'съебаш', 'съебен',
  'тварь',
  'толстожоп', 'толстозад',
  'торчил',
  'трахан', 'трах', 'трахн',
  'трепак',
  'триппер',
  'ублюдок',
  'уеб', 'уебыш', 'уебищ', 'уебаш', 'уебен',
  'уср', 'усрачк', 'усс',
  'ухуяк', 'ухуяр', 'ухуяч', 'ухуяш',
  'херн', 'херов', 'хрен', 'хренов',
  'хуевин', 'хуеглот', 'хуегрыз', 'хуедрыг', 'хуемудр', 'хуемысл', 'хуеньк', 'хуеплет', 'хуесос', 'хует', 'хуетен', 'хуец', 'хуил', 'хуин', 'хуист', 'хуишк', 'хуищ',
  'хули',
  'хуюж', 'хуюшк',
  'хуян', 'хуяст', 'хуйствен',
  'черножоп', 'чернозад',
  'шалав', 'шмар',
  
  // Английские корни (транслитерированные)
  'фак', 'фук', 'фк',
  'шит',
  'бич',
  'асс',
  'дамн',
  'крап',
  'дик',
  'пуси',
  'кок',
  'вор',
  'слут',
  'бастард',
  'нигер', 'нигга',
  'кант',
  'тват',
  'ванк',
  'писс',
  'ретард',
  'морон',
  'идиот',
  'спам', 'spam',
]

// Похожие символы (leet speak и визуально похожие)
const SIMILAR_CHARS: Record<string, string[]> = {
  'а': ['a', '@', '4'],
  'a': ['а', '@', '4'],
  'б': ['b', '6'],
  'b': ['б', '6'],
  'в': ['v', 'w'],
  'v': ['в'],
  'w': ['в'],
  'г': ['g', 'r'],
  'g': ['г'],
  'д': ['d'],
  'd': ['д'],
  'е': ['e', 'ё', '3'],
  'e': ['е', 'ё', '3'],
  'ё': ['е', 'e', '3'],
  'ж': ['zh'],
  'з': ['z', '3'],
  'z': ['з', '3'],
  'и': ['i', '1', 'u'],
  'i': ['и', '1', 'l', '|'],
  'й': ['и', 'i', 'y'],
  'y': ['у', 'й'],
  'к': ['k', 'q'],
  'k': ['к'],
  'л': ['l', '1'],
  'l': ['л', '1', 'i'],
  'м': ['m'],
  'm': ['м'],
  'н': ['h', 'n'],
  'h': ['н', 'n'],
  'n': ['н', 'h'],
  'о': ['o', '0'],
  'o': ['о', '0'],
  'п': ['p', 'n'],
  'p': ['п', 'r'],
  'р': ['p', 'r'],
  'r': ['р', 'p'],
  'с': ['c', 's', '$'],
  'c': ['с', 'k', 's'],
  's': ['с', '$', '5'],
  'т': ['t'],
  't': ['т'],
  'у': ['y', 'u'],
  'u': ['у', 'y'],
  'ф': ['f', 'ph'],
  'f': ['ф', 'ph'],
  'х': ['x', 'h', 'kh'],
  'x': ['х', 'ks'],
  'ц': ['c', 'ts'],
  'ч': ['ch', '4'],
  'ш': ['sh'],
  'щ': ['sch', 'sh'],
  'ъ': [''],
  'ы': ['i', 'bl'],
  'ь': [''],
  'э': ['e', 'ae'],
  'ю': ['u', 'yu', 'io'],
  'я': ['ya', 'ja', 'q'],
}

// Транслитерация: английские буквы → русские
const TRANSILIT_TO_RUSSIAN: Record<string, string> = {
  'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д',
  'e': 'е', 'yo': 'ё', 'zh': 'ж', 'z': 'з', 'i': 'и',
  'y': 'й', 'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н',
  'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т',
  'u': 'у', 'f': 'ф', 'h': 'х', 'x': 'кс', 'ts': 'ц',
  'ch': 'ч', 'sh': 'ш', 'sch': 'щ', 'ya': 'я', 'yu': 'ю',
  'ja': 'я', 'ju': 'ю', 'w': 'в',
}

// Расстояние Левенштейна (количество изменений для превращения одного слова в другое)
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

// Нормализация текста (приведение к стандартному виду)
function normalizeText(text: string): string {
  let result = text.toLowerCase()
  
  // Удаляем повторяющиеся буквы (чччлллеееннн -> член)
  result = result.replace(/(.)\1+/g, '$1')
  
  // Заменяем цифры на похожие буквы
  result = result.replace(/[0]/g, 'о')
  result = result.replace(/[1]/g, 'i')
  result = result.replace(/[3]/g, 'е')
  result = result.replace(/[4]/g, 'а')
  result = result.replace(/[5]/g, 's')
  result = result.replace(/[6]/g, 'б')
  result = result.replace(/[7]/g, 'т')
  result = result.replace(/[8]/g, 'в')
  result = result.replace(/[9]/g, 'g')
  
  // Заменяем спецсимволы
  result = result.replace(/[@]/g, 'а')
  result = result.replace(/[$]/g, 's')
  result = result.replace(/[|]/g, 'i')
  result = result.replace(/[!]/g, 'i')
  result = result.replace(/[*]/g, '')
  result = result.replace(/[+]/g, '')
  result = result.replace(/[_]/g, '')
  result = result.replace(/[-]/g, '')
  result = result.replace(/[.]/g, '')
  
  // Заменяем английские буквы на русские аналоги
  const engToRus: Record<string, string> = {
    'a': 'а', 'b': 'в', 'c': 'с', 'd': 'д', 'e': 'е',
    'f': 'ф', 'g': 'г', 'h': 'н', 'i': 'и', 'j': 'й',
    'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н', 'o': 'о',
    'p': 'р', 'q': 'q', 'r': 'р', 's': 'с', 't': 'т',
    'u': 'у', 'v': 'в', 'w': 'в', 'x': 'х', 'y': 'у', 'z': 'з'
  }
  
  for (const [eng, rus] of Object.entries(engToRus)) {
    result = result.replace(new RegExp(eng, 'g'), rus)
  }
  
  // Удаляем все кроме русских букв
  result = result.replace(/[^а-яё]/g, '')
  
  // Нормализуем ё → е
  result = result.replace(/ё/g, 'е')
  
  return result
}

// Конвертация транслитерации в русский
function convertToRussian(text: string): string {
  let result = text.toLowerCase()
  
  // Сначала заменяем комбинации
  const combinations = ['zh', 'sh', 'sch', 'ch', 'ya', 'yu', 'ja', 'ju', 'yo', 'ts', 'kh']
  for (const combo of combinations) {
    if (TRANSILIT_TO_RUSSIAN[combo]) {
      result = result.replace(new RegExp(combo, 'g'), TRANSILIT_TO_RUSSIAN[combo])
    }
  }
  
  // Затем отдельные буквы
  for (const [eng, rus] of Object.entries(TRANSILIT_TO_RUSSIAN)) {
    if (eng.length === 1) {
      result = result.replace(new RegExp(eng, 'g'), rus)
    }
  }
  
  return result
}

// Генерация вариантов слова с заменами похожих символов
function generateVariants(text: string): string[] {
  const variants: Set<string> = new Set()
  
  // Оригинал
  variants.add(text.toLowerCase())
  
  // Полностью нормализованный (все буквы русские)
  const normalized = normalizeText(text)
  variants.add(normalized)
  
  // Вариант с транслитерацией в русский
  const transliterated = convertToRussian(text)
  variants.add(transliterated)
  variants.add(normalizeText(transliterated))
  
  // Вариант с заменой только цифр
  let digitsReplaced = text.toLowerCase()
  digitsReplaced = digitsReplaced.replace(/[0]/g, 'о')
  digitsReplaced = digitsReplaced.replace(/[1]/g, 'i')
  digitsReplaced = digitsReplaced.replace(/[3]/g, 'е')
  digitsReplaced = digitsReplaced.replace(/[4]/g, 'а')
  digitsReplaced = digitsReplaced.replace(/[5]/g, 's')
  digitsReplaced = digitsReplaced.replace(/[6]/g, 'б')
  variants.add(digitsReplaced)
  variants.add(normalizeText(digitsReplaced))
  
  return Array.from(variants).filter(v => v.length > 0)
}

// Проверка на запрещённые слова (использует все методы)
export function containsForbiddenWord(text: string): { 
  isForbidden: boolean
  detectedWord?: string
  confidence: number 
  source?: string
} {
  // 1. Проверка через собственный алгоритм
  const variants = generateVariants(text)
  
  for (const variant of variants) {
    for (const root of FORBIDDEN_ROOTS) {
      if (variant.includes(root)) {
        return { 
          isForbidden: true, 
          detectedWord: root,
          confidence: 1.0,
          source: 'custom'
        }
      }
    }
      
    for (const root of FORBIDDEN_ROOTS) {
      if (variant.length >= root.length) {
        for (let i = 0; i <= variant.length - root.length; i++) {
          const substring = variant.substring(i, i + root.length)
          
          if (substring === root) {
            return { 
              isForbidden: true, 
              detectedWord: root,
              confidence: 1.0,
              source: 'custom'
            }
          }
          
          if (root.length <= 4) {
            const distance = levenshteinDistance(substring, root)
            const similarity = 1 - (distance / root.length)
            
            if (similarity >= 0.75) {
              return { 
                isForbidden: true, 
                detectedWord: root,
                confidence: similarity,
                source: 'custom-levenshtein'
              }
            }
          }
        }
      }
    }
  }
  
  // 2. Проверка через bad-words (английский)
  try {
    if (badWordsFilter.isProfane(text)) {
      const detectedWord = badWordsFilter.list.find(word => 
        text.toLowerCase().includes(word.toLowerCase())
      )
      return { 
        isForbidden: true, 
        detectedWord: detectedWord || 'unknown',
        confidence: 0.9,
        source: 'bad-words'
      }
    }
  } catch {
    // Игнорируем ошибки библиотеки
  }
  
  // 3. Проверка через leo-profanity (русский + английский)
  try {
    if (leoProfanity.check(text)) {
      return { 
        isForbidden: true, 
        detectedWord: 'profanity',
        confidence: 0.85,
        source: 'leo-profanity'
      }
    }
  } catch {
    // Игнорируем ошибки библиотеки
  }
  
  // 4. Проверка через obscenity (английский с детекцией обхода)
  try {
    const matches = obscenityMatcher.getAllMatches(text)
    if (matches.length > 0) {
      return { 
        isForbidden: true, 
        detectedWord: 'obscenity',
        confidence: 0.9,
        source: 'obscenity'
      }
    }
  } catch {
    // Игнорируем ошибки библиотеки
  }
  
  return { isForbidden: false, confidence: 0 }
}

// Быстрая проверка (только boolean)
export function isNicknameAllowed(nickname: string): boolean {
  const result = containsForbiddenWord(nickname)
  return !result.isForbidden
}

// Экспорт для использования в других файлах
export const forbiddenWordsFilter = {
  containsForbiddenWord,
  isNicknameAllowed,
}
