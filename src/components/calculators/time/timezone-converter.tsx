'use client'

import { useState, useMemo } from 'react'
import { Calculator } from '@/types'
import { CalculatorShell } from '../shared/CalculatorShell'
import { useSettingsStore } from '@/store/settingsStore'
import { 
  PieChartWidget, 
  BarChartWidget, 
  ProgressBarsWidget, 
  StatsCardsWidget,
  HorizontalBarWidget,
  DonutChartWidget
} from '../shared/CalculatorCharts'

interface Props {
  calculator: Calculator
}

interface Timezone {
  city: string
  cityEn: string
  country: string
  countryEn: string
  offset: number
  emoji: string
}

const timezones: Timezone[] = [
  // UTC-12 to UTC-8 (Pacific)
  { city: 'Бейкер', cityEn: 'Baker Island', country: 'США', countryEn: 'USA', offset: -12, emoji: '🇺🇸' },
  { city: 'Мидуэй', cityEn: 'Midway', country: 'США', countryEn: 'USA', offset: -11, emoji: '🇺🇸' },
  { city: 'Гонолулу', cityEn: 'Honolulu', country: 'США', countryEn: 'USA', offset: -10, emoji: '🇺🇸' },
  { city: 'Анкоридж', cityEn: 'Anchorage', country: 'США', countryEn: 'USA', offset: -9, emoji: '🇺🇸' },
  { city: 'Лос-Анджелес', cityEn: 'Los Angeles', country: 'США', countryEn: 'USA', offset: -8, emoji: '🇺🇸' },
  { city: 'Ванкувер', cityEn: 'Vancouver', country: 'Канада', countryEn: 'Canada', offset: -8, emoji: '🇨🇦' },
  { city: 'Тихуана', cityEn: 'Tijuana', country: 'Мексика', countryEn: 'Mexico', offset: -8, emoji: '🇲🇽' },

  // UTC-7 to UTC-6 (Mountain & Central)
  { city: 'Денвер', cityEn: 'Denver', country: 'США', countryEn: 'USA', offset: -7, emoji: '🇺🇸' },
  { city: 'Финикс', cityEn: 'Phoenix', country: 'США', countryEn: 'USA', offset: -7, emoji: '🇺🇸' },
  { city: 'Калгари', cityEn: 'Calgary', country: 'Канада', countryEn: 'Canada', offset: -7, emoji: '🇨🇦' },
  { city: 'Мехико', cityEn: 'Mexico City', country: 'Мексика', countryEn: 'Mexico', offset: -6, emoji: '🇲🇽' },
  { city: 'Чикаго', cityEn: 'Chicago', country: 'США', countryEn: 'USA', offset: -6, emoji: '🇺🇸' },
  { city: 'Даллас', cityEn: 'Dallas', country: 'США', countryEn: 'USA', offset: -6, emoji: '🇺🇸' },
  { city: 'Хьюстон', cityEn: 'Houston', country: 'США', countryEn: 'USA', offset: -6, emoji: '🇺🇸' },
  { city: 'Виннипег', cityEn: 'Winnipeg', country: 'Канада', countryEn: 'Canada', offset: -6, emoji: '🇨🇦' },
  { city: 'Гватемала', cityEn: 'Guatemala City', country: 'Гватемала', countryEn: 'Guatemala', offset: -6, emoji: '🇬🇹' },
  { city: 'Сан-Сальвадор', cityEn: 'San Salvador', country: 'Сальвадор', countryEn: 'El Salvador', offset: -6, emoji: '🇸🇻' },
  { city: 'Манагуа', cityEn: 'Managua', country: 'Никарагуа', countryEn: 'Nicaragua', offset: -6, emoji: '🇳🇮' },
  { city: 'Тегусигальпа', cityEn: 'Tegucigalpa', country: 'Гондурас', countryEn: 'Honduras', offset: -6, emoji: '🇭🇳' },

  // UTC-5 to UTC-4 (Eastern & Atlantic)
  { city: 'Нью-Йорк', cityEn: 'New York', country: 'США', countryEn: 'USA', offset: -5, emoji: '🇺🇸' },
  { city: 'Вашингтон', cityEn: 'Washington', country: 'США', countryEn: 'USA', offset: -5, emoji: '🇺🇸' },
  { city: 'Торонто', cityEn: 'Toronto', country: 'Канада', countryEn: 'Canada', offset: -5, emoji: '🇨🇦' },
  { city: 'Монреаль', cityEn: 'Montreal', country: 'Канада', countryEn: 'Canada', offset: -5, emoji: '🇨🇦' },
  { city: 'Детройт', cityEn: 'Detroit', country: 'США', countryEn: 'USA', offset: -5, emoji: '🇺🇸' },
  { city: 'Богота', cityEn: 'Bogotá', country: 'Колумбия', countryEn: 'Colombia', offset: -5, emoji: '🇨🇴' },
  { city: 'Лима', cityEn: 'Lima', country: 'Перу', countryEn: 'Peru', offset: -5, emoji: '🇵🇪' },
  { city: 'Кито', cityEn: 'Quito', country: 'Эквадор', countryEn: 'Ecuador', offset: -5, emoji: '🇪🇨' },
  { city: 'Панама', cityEn: 'Panama City', country: 'Панама', countryEn: 'Panama', offset: -5, emoji: '🇵🇦' },
  { city: 'Гавана', cityEn: 'Havana', country: 'Куба', countryEn: 'Cuba', offset: -5, emoji: '🇨🇺' },
  { city: 'Кингстон', cityEn: 'Kingston', country: 'Ямайка', countryEn: 'Jamaica', offset: -5, emoji: '🇯🇲' },
  { city: 'Каракас', cityEn: 'Caracas', country: 'Венесуэла', countryEn: 'Venezuela', offset: -4, emoji: '🇻🇪' },
  { city: 'Сантьяго', cityEn: 'Santiago', country: 'Чили', countryEn: 'Chile', offset: -4, emoji: '🇨🇱' },
  { city: 'Буэнос-Айрес', cityEn: 'Buenos Aires', country: 'Аргентина', countryEn: 'Argentina', offset: -3, emoji: '🇦🇷' },
  { city: 'Монтевидео', cityEn: 'Montevideo', country: 'Уругвай', countryEn: 'Uruguay', offset: -3, emoji: '🇺🇾' },
  { city: 'Сан-Паулу', cityEn: 'São Paulo', country: 'Бразилия', countryEn: 'Brazil', offset: -3, emoji: '🇧🇷' },
  { city: 'Рио-де-Жанейро', cityEn: 'Rio de Janeiro', country: 'Бразилия', countryEn: 'Brazil', offset: -3, emoji: '🇧🇷' },
  { city: 'Бразилиа', cityEn: 'Brasília', country: 'Бразилия', countryEn: 'Brazil', offset: -3, emoji: '🇧🇷' },
  { city: 'Ньюфаундленд', cityEn: 'St. John\'s', country: 'Канада', countryEn: 'Canada', offset: -2.5, emoji: '🇨🇦' },

  // UTC-2 to UTC-1 (Atlantic)
  { city: 'Южная Георгия', cityEn: 'South Georgia', country: 'Британия', countryEn: 'UK', offset: -2, emoji: '🇬🇧' },
  { city: 'Азорские о-ва', cityEn: 'Azores', country: 'Португалия', countryEn: 'Portugal', offset: -1, emoji: '🇵🇹' },
  { city: 'Кабо-Верде', cityEn: 'Praia', country: 'Кабо-Верде', countryEn: 'Cape Verde', offset: -1, emoji: '🇨🇻' },

  // UTC+0 (GMT/UTC)
  { city: 'Лондон', cityEn: 'London', country: 'Великобритания', countryEn: 'UK', offset: 0, emoji: '🇬🇧' },
  { city: 'Дублин', cityEn: 'Dublin', country: 'Ирландия', countryEn: 'Ireland', offset: 0, emoji: '🇮🇪' },
  { city: 'Лиссабон', cityEn: 'Lisbon', country: 'Португалия', countryEn: 'Portugal', offset: 0, emoji: '🇵🇹' },
  { city: 'Рейкьявик', cityEn: 'Reykjavik', country: 'Исландия', countryEn: 'Iceland', offset: 0, emoji: '🇮🇸' },
  { city: 'Дакар', cityEn: 'Dakar', country: 'Сенегал', countryEn: 'Senegal', offset: 0, emoji: '🇸🇳' },
  { city: 'Касабланка', cityEn: 'Casablanca', country: 'Марокко', countryEn: 'Morocco', offset: 0, emoji: '🇲🇦' },
  { city: 'Абиджан', cityEn: 'Abidjan', country: 'Кот-д\'Ивуар', countryEn: 'Ivory Coast', offset: 0, emoji: '🇨🇮' },
  { city: 'Аккра', cityEn: 'Accra', country: 'Гана', countryEn: 'Ghana', offset: 0, emoji: '🇬🇭' },
  { city: 'Монровия', cityEn: 'Monrovia', country: 'Либерия', countryEn: 'Liberia', offset: 0, emoji: '🇱🇷' },

  // UTC+1 (CET)
  { city: 'Париж', cityEn: 'Paris', country: 'Франция', countryEn: 'France', offset: 1, emoji: '🇫🇷' },
  { city: 'Берлин', cityEn: 'Berlin', country: 'Германия', countryEn: 'Germany', offset: 1, emoji: '🇩🇪' },
  { city: 'Мюнхен', cityEn: 'Munich', country: 'Германия', countryEn: 'Germany', offset: 1, emoji: '🇩🇪' },
  { city: 'Рим', cityEn: 'Rome', country: 'Италия', countryEn: 'Italy', offset: 1, emoji: '🇮🇹' },
  { city: 'Милан', cityEn: 'Milan', country: 'Италия', countryEn: 'Italy', offset: 1, emoji: '🇮🇹' },
  { city: 'Мадрид', cityEn: 'Madrid', country: 'Испания', countryEn: 'Spain', offset: 1, emoji: '🇪🇸' },
  { city: 'Барселона', cityEn: 'Barcelona', country: 'Испания', countryEn: 'Spain', offset: 1, emoji: '🇪🇸' },
  { city: 'Амстердам', cityEn: 'Amsterdam', country: 'Нидерланды', countryEn: 'Netherlands', offset: 1, emoji: '🇳🇱' },
  { city: 'Брюссель', cityEn: 'Brussels', country: 'Бельгия', countryEn: 'Belgium', offset: 1, emoji: '🇧🇪' },
  { city: 'Вена', cityEn: 'Vienna', country: 'Австрия', countryEn: 'Austria', offset: 1, emoji: '🇦🇹' },
  { city: 'Цюрих', cityEn: 'Zurich', country: 'Швейцария', countryEn: 'Switzerland', offset: 1, emoji: '🇨🇭' },
  { city: 'Женева', cityEn: 'Geneva', country: 'Швейцария', countryEn: 'Switzerland', offset: 1, emoji: '🇨🇭' },
  { city: 'Варшава', cityEn: 'Warsaw', country: 'Польша', countryEn: 'Poland', offset: 1, emoji: '🇵🇱' },
  { city: 'Прага', cityEn: 'Prague', country: 'Чехия', countryEn: 'Czechia', offset: 1, emoji: '🇨🇿' },
  { city: 'Будапешт', cityEn: 'Budapest', country: 'Венгрия', countryEn: 'Hungary', offset: 1, emoji: '🇭🇺' },
  { city: 'Белград', cityEn: 'Belgrade', country: 'Сербия', countryEn: 'Serbia', offset: 1, emoji: '🇷🇸' },
  { city: 'Загреб', cityEn: 'Zagreb', country: 'Хорватия', countryEn: 'Croatia', offset: 1, emoji: '🇭🇷' },
  { city: 'Любляна', cityEn: 'Ljubljana', country: 'Словения', countryEn: 'Slovenia', offset: 1, emoji: '🇸🇮' },
  { city: 'Братислава', cityEn: 'Bratislava', country: 'Словакия', countryEn: 'Slovakia', offset: 1, emoji: '🇸🇰' },
  { city: 'Копенгаген', cityEn: 'Copenhagen', country: 'Дания', countryEn: 'Denmark', offset: 1, emoji: '🇩🇰' },
  { city: 'Осло', cityEn: 'Oslo', country: 'Норвегия', countryEn: 'Norway', offset: 1, emoji: '🇳🇴' },
  { city: 'Стокгольм', cityEn: 'Stockholm', country: 'Швеция', countryEn: 'Sweden', offset: 1, emoji: '🇸🇪' },
  { city: 'Хельсинки', cityEn: 'Helsinki', country: 'Финляндия', countryEn: 'Finland', offset: 2, emoji: '🇫🇮' },
  { city: 'Лагос', cityEn: 'Lagos', country: 'Нигерия', countryEn: 'Nigeria', offset: 1, emoji: '🇳🇬' },
  { city: 'Алжир', cityEn: 'Algiers', country: 'Алжир', countryEn: 'Algeria', offset: 1, emoji: '🇩🇿' },
  { city: 'Тунис', cityEn: 'Tunis', country: 'Тунис', countryEn: 'Tunisia', offset: 1, emoji: '🇹🇳' },

  // UTC+2 (EET)
  { city: 'Афины', cityEn: 'Athens', country: 'Греция', countryEn: 'Greece', offset: 2, emoji: '🇬🇷' },
  { city: 'Салоники', cityEn: 'Thessaloniki', country: 'Греция', countryEn: 'Greece', offset: 2, emoji: '🇬🇷' },
  { city: 'София', cityEn: 'Sofia', country: 'Болгария', countryEn: 'Bulgaria', offset: 2, emoji: '🇧🇬' },
  { city: 'Бухарест', cityEn: 'Bucharest', country: 'Румыния', countryEn: 'Romania', offset: 2, emoji: '🇷🇴' },
  { city: 'Киев', cityEn: 'Kyiv', country: 'Украина', countryEn: 'Ukraine', offset: 2, emoji: '🇺🇦' },
  { city: 'Харьков', cityEn: 'Kharkiv', country: 'Украина', countryEn: 'Ukraine', offset: 2, emoji: '🇺🇦' },
  { city: 'Одесса', cityEn: 'Odesa', country: 'Украина', countryEn: 'Ukraine', offset: 2, emoji: '🇺🇦' },
  { city: 'Кишинёв', cityEn: 'Chișinău', country: 'Молдова', countryEn: 'Moldova', offset: 2, emoji: '🇲🇩' },
  { city: 'Таллин', cityEn: 'Tallinn', country: 'Эстония', countryEn: 'Estonia', offset: 2, emoji: '🇪🇪' },
  { city: 'Рига', cityEn: 'Riga', country: 'Латвия', countryEn: 'Latvia', offset: 2, emoji: '🇱🇻' },
  { city: 'Вильнюс', cityEn: 'Vilnius', country: 'Литва', countryEn: 'Lithuania', offset: 2, emoji: '🇱🇹' },
  { city: 'Каир', cityEn: 'Cairo', country: 'Египет', countryEn: 'Egypt', offset: 2, emoji: '🇪🇬' },
  { city: 'Йоханнесбург', cityEn: 'Johannesburg', country: 'ЮАР', countryEn: 'South Africa', offset: 2, emoji: '🇿🇦' },
  { city: 'Кейптаун', cityEn: 'Cape Town', country: 'ЮАР', countryEn: 'South Africa', offset: 2, emoji: '🇿🇦' },
  { city: 'Тель-Авив', cityEn: 'Tel Aviv', country: 'Израиль', countryEn: 'Israel', offset: 2, emoji: '🇮🇱' },
  { city: 'Иерусалим', cityEn: 'Jerusalem', country: 'Израиль', countryEn: 'Israel', offset: 2, emoji: '🇮🇱' },
  { city: 'Бейрут', cityEn: 'Beirut', country: 'Ливан', countryEn: 'Lebanon', offset: 2, emoji: '🇱🇧' },
  { city: 'Амман', cityEn: 'Amman', country: 'Иордания', countryEn: 'Jordan', offset: 2, emoji: '🇯🇴' },
  { city: 'Дамаск', cityEn: 'Damascus', country: 'Сирия', countryEn: 'Syria', offset: 2, emoji: '🇸🇾' },
  { city: 'Найроби', cityEn: 'Nairobi', country: 'Кения', countryEn: 'Kenya', offset: 3, emoji: '🇰🇪' },
  { city: 'Хартум', cityEn: 'Khartoum', country: 'Судан', countryEn: 'Sudan', offset: 2, emoji: '🇸🇩' },

  // UTC+3 (Moscow, Turkey, Arabia)
  { city: 'Москва', cityEn: 'Moscow', country: 'Россия', countryEn: 'Russia', offset: 3, emoji: '🇷🇺' },
  { city: 'Санкт-Петербург', cityEn: 'St. Petersburg', country: 'Россия', countryEn: 'Russia', offset: 3, emoji: '🇷🇺' },
  { city: 'Казань', cityEn: 'Kazan', country: 'Россия', countryEn: 'Russia', offset: 3, emoji: '🇷🇺' },
  { city: 'Нижний Новгород', cityEn: 'Nizhny Novgorod', country: 'Россия', countryEn: 'Russia', offset: 3, emoji: '🇷🇺' },
  { city: 'Ульяновск', cityEn: 'Ulyanovsk', country: 'Россия', countryEn: 'Russia', offset: 4, emoji: '🇷🇺' },
  { city: 'Самара', cityEn: 'Samara', country: 'Россия', countryEn: 'Russia', offset: 4, emoji: '🇷🇺' },
  { city: 'Стамбул', cityEn: 'Istanbul', country: 'Турция', countryEn: 'Turkey', offset: 3, emoji: '🇹🇷' },
  { city: 'Анкара', cityEn: 'Ankara', country: 'Турция', countryEn: 'Turkey', offset: 3, emoji: '🇹🇷' },
  { city: 'Эр-Рияд', cityEn: 'Riyadh', country: 'Саудовская Аравия', countryEn: 'Saudi Arabia', offset: 3, emoji: '🇸🇦' },
  { city: 'Джидда', cityEn: 'Jeddah', country: 'Саудовская Аравия', countryEn: 'Saudi Arabia', offset: 3, emoji: '🇸🇦' },
  { city: 'Мекка', cityEn: 'Mecca', country: 'Саудовская Аравия', countryEn: 'Saudi Arabia', offset: 3, emoji: '🇸🇦' },
  { city: 'Багдад', cityEn: 'Baghdad', country: 'Ирак', countryEn: 'Iraq', offset: 3, emoji: '🇮🇶' },
  { city: 'Кувейт', cityEn: 'Kuwait City', country: 'Кувейт', countryEn: 'Kuwait', offset: 3, emoji: '🇰🇼' },
  { city: 'Манама', cityEn: 'Manama', country: 'Бахрейн', countryEn: 'Bahrain', offset: 3, emoji: '🇧🇭' },
  { city: 'Доха', cityEn: 'Doha', country: 'Катар', countryEn: 'Qatar', offset: 3, emoji: '🇶🇦' },
  { city: 'Абу-Даби', cityEn: 'Abu Dhabi', country: 'ОАЭ', countryEn: 'UAE', offset: 4, emoji: '🇦🇪' },
  { city: 'Дубай', cityEn: 'Dubai', country: 'ОАЭ', countryEn: 'UAE', offset: 4, emoji: '🇦🇪' },
  { city: 'Мускат', cityEn: 'Muscat', country: 'Оман', countryEn: 'Oman', offset: 4, emoji: '🇴🇲' },
  { city: 'Тегеран', cityEn: 'Tehran', country: 'Иран', countryEn: 'Iran', offset: 3.5, emoji: '🇮🇷' },
  { city: 'Аддис-Абеба', cityEn: 'Addis Ababa', country: 'Эфиопия', countryEn: 'Ethiopia', offset: 3, emoji: '🇪🇹' },
  { city: 'Дар-эс-Салам', cityEn: 'Dar es Salaam', country: 'Танзания', countryEn: 'Tanzania', offset: 3, emoji: '🇹🇿' },

  // UTC+4 to UTC+5:30 (Central Asia, India)
  { city: 'Тбилиси', cityEn: 'Tbilisi', country: 'Грузия', countryEn: 'Georgia', offset: 4, emoji: '🇬🇪' },
  { city: 'Ереван', cityEn: 'Yerevan', country: 'Армения', countryEn: 'Armenia', offset: 4, emoji: '🇦🇲' },
  { city: 'Баку', cityEn: 'Baku', country: 'Азербайджан', countryEn: 'Azerbaijan', offset: 4, emoji: '🇦🇿' },
  { city: 'Ашхабад', cityEn: 'Ashgabat', country: 'Туркменистан', countryEn: 'Turkmenistan', offset: 5, emoji: '🇹🇲' },
  { city: 'Ташкент', cityEn: 'Tashkent', country: 'Узбекистан', countryEn: 'Uzbekistan', offset: 5, emoji: '🇺🇿' },
  { city: 'Душанбе', cityEn: 'Dushanbe', country: 'Таджикистан', countryEn: 'Tajikistan', offset: 5, emoji: '🇹🇯' },
  { city: 'Бишкек', cityEn: 'Bishkek', country: 'Киргизия', countryEn: 'Kyrgyzstan', offset: 6, emoji: '🇰🇬' },
  { city: 'Астана', cityEn: 'Astana', country: 'Казахстан', countryEn: 'Kazakhstan', offset: 6, emoji: '🇰🇿' },
  { city: 'Алматы', cityEn: 'Almaty', country: 'Казахстан', countryEn: 'Kazakhstan', offset: 6, emoji: '🇰🇿' },
  { city: 'Карачи', cityEn: 'Karachi', country: 'Пакистан', countryEn: 'Pakistan', offset: 5, emoji: '🇵🇰' },
  { city: 'Исламабад', cityEn: 'Islamabad', country: 'Пакистан', countryEn: 'Pakistan', offset: 5, emoji: '🇵🇰' },
  { city: 'Нью-Дели', cityEn: 'New Delhi', country: 'Индия', countryEn: 'India', offset: 5.5, emoji: '🇮🇳' },
  { city: 'Мумбаи', cityEn: 'Mumbai', country: 'Индия', countryEn: 'India', offset: 5.5, emoji: '🇮🇳' },
  { city: 'Бангалор', cityEn: 'Bangalore', country: 'Индия', countryEn: 'India', offset: 5.5, emoji: '🇮🇳' },
  { city: 'Коломбо', cityEn: 'Colombo', country: 'Шри-Ланка', countryEn: 'Sri Lanka', offset: 5.5, emoji: '🇱🇰' },
  { city: 'Катманду', cityEn: 'Kathmandu', country: 'Непал', countryEn: 'Nepal', offset: 5.75, emoji: '🇳🇵' },

  // UTC+6 to UTC+7 (Bangladesh, Southeast Asia)
  { city: 'Дакка', cityEn: 'Dhaka', country: 'Бангладеш', countryEn: 'Bangladesh', offset: 6, emoji: '🇧🇩' },
  { city: 'Янгон', cityEn: 'Yangon', country: 'Мьянма', countryEn: 'Myanmar', offset: 6.5, emoji: '🇲🇲' },
  { city: 'Бангкок', cityEn: 'Bangkok', country: 'Таиланд', countryEn: 'Thailand', offset: 7, emoji: '🇹🇭' },
  { city: 'Ханой', cityEn: 'Hanoi', country: 'Вьетнам', countryEn: 'Vietnam', offset: 7, emoji: '🇻🇳' },
  { city: 'Хошимин', cityEn: 'Ho Chi Minh City', country: 'Вьетнам', countryEn: 'Vietnam', offset: 7, emoji: '🇻🇳' },
  { city: 'Пномпень', cityEn: 'Phnom Penh', country: 'Камбоджа', countryEn: 'Cambodia', offset: 7, emoji: '🇰🇭' },
  { city: 'Вьентьян', cityEn: 'Vientiane', country: 'Лаос', countryEn: 'Laos', offset: 7, emoji: '🇱🇦' },
  { city: 'Джакарта', cityEn: 'Jakarta', country: 'Индонезия', countryEn: 'Indonesia', offset: 7, emoji: '🇮🇩' },

  // UTC+8 (China, Singapore, Philippines, Australia West)
  { city: 'Пекин', cityEn: 'Beijing', country: 'Китай', countryEn: 'China', offset: 8, emoji: '🇨🇳' },
  { city: 'Шанхай', cityEn: 'Shanghai', country: 'Китай', countryEn: 'China', offset: 8, emoji: '🇨🇳' },
  { city: 'Гуанчжоу', cityEn: 'Guangzhou', country: 'Китай', countryEn: 'China', offset: 8, emoji: '🇨🇳' },
  { city: 'Шэньчжэнь', cityEn: 'Shenzhen', country: 'Китай', countryEn: 'China', offset: 8, emoji: '🇨🇳' },
  { city: 'Гонконг', cityEn: 'Hong Kong', country: 'Гонконг', countryEn: 'Hong Kong', offset: 8, emoji: '🇭🇰' },
  { city: 'Макао', cityEn: 'Macau', country: 'Макао', countryEn: 'Macau', offset: 8, emoji: '🇲🇴' },
  { city: 'Тайбэй', cityEn: 'Taipei', country: 'Тайвань', countryEn: 'Taiwan', offset: 8, emoji: '🇹🇼' },
  { city: 'Сингапур', cityEn: 'Singapore', country: 'Сингапур', countryEn: 'Singapore', offset: 8, emoji: '🇸🇬' },
  { city: 'Куала-Лумпур', cityEn: 'Kuala Lumpur', country: 'Малайзия', countryEn: 'Malaysia', offset: 8, emoji: '🇲🇾' },
  { city: 'Манила', cityEn: 'Manila', country: 'Филиппины', countryEn: 'Philippines', offset: 8, emoji: '🇵🇭' },
  { city: 'Перт', cityEn: 'Perth', country: 'Австралия', countryEn: 'Australia', offset: 8, emoji: '🇦🇺' },

  // UTC+9 (Japan, Korea)
  { city: 'Токио', cityEn: 'Tokyo', country: 'Япония', countryEn: 'Japan', offset: 9, emoji: '🇯🇵' },
  { city: 'Осака', cityEn: 'Osaka', country: 'Япония', countryEn: 'Japan', offset: 9, emoji: '🇯🇵' },
  { city: 'Киото', cityEn: 'Kyoto', country: 'Япония', countryEn: 'Japan', offset: 9, emoji: '🇯🇵' },
  { city: 'Сеул', cityEn: 'Seoul', country: 'Южная Корея', countryEn: 'South Korea', offset: 9, emoji: '🇰🇷' },
  { city: 'Пусан', cityEn: 'Busan', country: 'Южная Корея', countryEn: 'South Korea', offset: 9, emoji: '🇰🇷' },
  { city: 'Пхеньян', cityEn: 'Pyongyang', country: 'Северная Корея', countryEn: 'North Korea', offset: 9, emoji: '🇰🇵' },

  // UTC+9:30 to UTC+10 (Australia)
  { city: 'Аделаида', cityEn: 'Adelaide', country: 'Австралия', countryEn: 'Australia', offset: 9.5, emoji: '🇦🇺' },
  { city: 'Дарвин', cityEn: 'Darwin', country: 'Австралия', countryEn: 'Australia', offset: 9.5, emoji: '🇦🇺' },
  { city: 'Сидней', cityEn: 'Sydney', country: 'Австралия', countryEn: 'Australia', offset: 10, emoji: '🇦🇺' },
  { city: 'Мельбурн', cityEn: 'Melbourne', country: 'Австралия', countryEn: 'Australia', offset: 10, emoji: '🇦🇺' },
  { city: 'Брисбен', cityEn: 'Brisbane', country: 'Австралия', countryEn: 'Australia', offset: 10, emoji: '🇦🇺' },
  { city: 'Хобарт', cityEn: 'Hobart', country: 'Австралия', countryEn: 'Australia', offset: 10, emoji: '🇦🇺' },
  { city: 'Папуа', cityEn: 'Port Moresby', country: 'Папуа-Новая Гвинея', countryEn: 'Papua New Guinea', offset: 10, emoji: '🇵🇬' },
  { city: 'Владивосток', cityEn: 'Vladivostok', country: 'Россия', countryEn: 'Russia', offset: 10, emoji: '🇷🇺' },

  // UTC+11 to UTC+12 (Pacific Islands)
  { city: 'Соломоновы о-ва', cityEn: 'Honiara', country: 'Соломоновы о-ва', countryEn: 'Solomon Islands', offset: 11, emoji: '🇸🇧' },
  { city: 'Новая Каледония', cityEn: 'Noumea', country: 'Новая Каледония', countryEn: 'New Caledonia', offset: 11, emoji: '🇳🇨' },
  { city: 'Окленд', cityEn: 'Auckland', country: 'Новая Зеландия', countryEn: 'New Zealand', offset: 12, emoji: '🇳🇿' },
  { city: 'Веллингтон', cityEn: 'Wellington', country: 'Новая Зеландия', countryEn: 'New Zealand', offset: 12, emoji: '🇳🇿' },
  { city: 'Фиджи', cityEn: 'Suva', country: 'Фиджи', countryEn: 'Fiji', offset: 12, emoji: '🇫🇯' },
  { city: 'Камчатка', cityEn: 'Petropavlovsk', country: 'Россия', countryEn: 'Russia', offset: 12, emoji: '🇷🇺' },

  // UTC+13 to UTC+14 (Pacific extreme)
  { city: 'Самоа', cityEn: 'Apia', country: 'Самоа', countryEn: 'Samoa', offset: 13, emoji: '🇼🇸' },
  { city: 'Тонга', cityEn: 'Nuku\'alofa', country: 'Тонга', countryEn: 'Tonga', offset: 13, emoji: '🇹🇴' },
  { city: 'Кирибати', cityEn: 'Tarawa', country: 'Кирибати', countryEn: 'Kiribati', offset: 14, emoji: '🇰🇮' },
]

export function TimezoneConverter({ calculator }: Props) {
  const language = useSettingsStore((s) => s.language)
  const [time, setTime] = useState('12:00')
  const [fromCity, setFromCity] = useState('Москва')
  const [toCity, setToCity] = useState('__all__')

  // Получить уникальные страны для фильтра
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(timezones.map(tz => language === 'ru' ? tz.country : tz.countryEn))]
    return uniqueCountries.sort()
  }, [language])

  // Автоматический расчёт
  const result = useMemo(() => {
    const [h, m] = time.split(':').map(Number)
    const fromOffset = timezones.find(t => t.city === fromCity)?.offset || 0
    const fromTz = timezones.find(t => t.city === fromCity)
    
    let targetCities: typeof timezones = []
    
    if (toCity === '__all__') {
      targetCities = timezones
    } else {
      const targetTz = timezones.find(t => t.city === toCity)
      if (targetTz) targetCities = [targetTz]
    }

    const conversions = targetCities.map(tz => {
      const diff = tz.offset - fromOffset
      const totalMinutes = h * 60 + m + diff * 60
      const newMinutes = ((totalMinutes % 1440) + 1440) % 1440
      const newH = Math.floor(newMinutes / 60)
      const newM = Math.round(newMinutes % 60)
      
      // Разница во времени
      const diffHours = diff
      const diffStr = diff === 0 
        ? (language === 'ru' ? 'То же время' : 'Same time')
        : diff > 0 
          ? `+${diff}ч` 
          : `${diff}ч`
      
      return {
        city: tz.city,
        cityEn: tz.cityEn,
        time: `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`,
        offset: tz.offset,
        emoji: tz.emoji,
        country: tz.country,
        countryEn: tz.countryEn,
        diff: diffStr,
      }
    })

    return { 
      fromTime: time, 
      fromCity: fromTz?.city || '', 
      fromEmoji: fromTz?.emoji || '',
      conversions 
    }
  }, [time, fromCity, toCity, language])

  // Данные для диаграммы
  const chartData = useMemo(() => {
    if (!result) return []
    
    return result.conversions.slice(0, 12).map(c => ({
      name: language === 'ru' ? c.city : c.cityEn,
      [language === 'ru' ? 'Час' : 'Hour']: parseInt(c.time.split(':')[0]),
    }))
  }, [result, language])

  // Статистика
  const stats = useMemo(() => {
    if (!result) return []
    
    const current = result.conversions.find(c => c.city === fromCity)
    const ny = result.conversions.find(c => c.city === 'Нью-Йорк')
    const tokyo = result.conversions.find(c => c.city === 'Токио')
    const london = result.conversions.find(c => c.city === 'Лондон')
    const beijing = result.conversions.find(c => c.city === 'Пекин')
    const dubai = result.conversions.find(c => c.city === 'Дубай')
    
    return [
      { label: `${result.fromEmoji} ${fromCity}`, value: result.fromTime },
      { label: `${ny?.emoji || ''} ${language === 'ru' ? 'Нью-Йорк' : 'New York'}`, value: ny?.time || '' },
      { label: `${tokyo?.emoji || ''} ${language === 'ru' ? 'Токио' : 'Tokyo'}`, value: tokyo?.time || '' },
      { label: `${london?.emoji || ''} ${language === 'ru' ? 'Лондон' : 'London'}`, value: london?.time || '' },
    ]
  }, [result, fromCity, language])

  // Группировка по UTC offset
  const groupedByOffset = useMemo(() => {
    if (!result) return {}
    
    const groups: Record<string, typeof result.conversions> = {}
    result.conversions.forEach(c => {
      const key = `UTC${c.offset >= 0 ? '+' : ''}${c.offset}`
      if (!groups[key]) groups[key] = []
      groups[key].push(c)
    })
    return groups
  }, [result])

  return (
    <CalculatorShell calculator={calculator}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Время' : 'Time'}
          </label>
          <input type="time" className="input w-full" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Откуда (город)' : 'From (City)'}
          </label>
          <select className="input w-full" value={fromCity} onChange={(e) => setFromCity(e.target.value)}>
            {timezones.map(tz => (
              <option key={tz.city} value={tz.city}>
                {tz.emoji} {language === 'ru' ? tz.city : tz.cityEn} ({language === 'ru' ? tz.country : tz.countryEn})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            {language === 'ru' ? 'Куда (город)' : 'To (City)'}
          </label>
          <select className="input w-full" value={toCity} onChange={(e) => setToCity(e.target.value)}>
            <option value="__all__">🌍 {language === 'ru' ? 'Все страны' : 'All Countries'}</option>
            {timezones.map(tz => (
              <option key={tz.city} value={tz.city}>
                {tz.emoji} {language === 'ru' ? tz.city : tz.cityEn} ({language === 'ru' ? tz.country : tz.countryEn})
              </option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <div className="space-y-6 mt-6">
          {/* Результат конвертации */}
          {toCity !== '__all__' && result.conversions.length === 1 && (
            <div className="glass-card p-6">
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div className="text-center">
                  <p className="text-4xl mb-2">{result.fromEmoji}</p>
                  <p className="text-sm text-muted">{language === 'ru' ? 'Откуда' : 'From'}</p>
                  <p className="text-lg font-semibold">{fromCity}</p>
                  <p className="text-3xl font-bold text-primary mt-2">{result.fromTime}</p>
                </div>
                <div className="text-4xl text-muted">→</div>
                <div className="text-center">
                  <p className="text-4xl mb-2">{result.conversions[0].emoji}</p>
                  <p className="text-sm text-muted">{language === 'ru' ? 'Куда' : 'To'}</p>
                  <p className="text-lg font-semibold">{language === 'ru' ? result.conversions[0].city : result.conversions[0].cityEn}</p>
                  <p className="text-3xl font-bold text-primary mt-2">{result.conversions[0].time}</p>
                  <p className="text-sm text-muted mt-1">{result.conversions[0].diff}</p>
                </div>
              </div>
            </div>
          )}

          {/* Статистика */}
          {toCity === '__all__' && <StatsCardsWidget stats={stats} />}

          {/* Графики - только для всех стран */}
          {toCity === '__all__' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Диаграмма */}
              <div className="glass-card p-4">
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'ru' ? 'Время по городам' : 'Time by City'}
                </h3>
                <BarChartWidget 
                  data={chartData}
                  dataKeys={[{ key: language === 'ru' ? 'Час' : 'Hour', color: '#6366f1' }]}
                  height={280}
                />
              </div>

              {/* Круговая диаграмма */}
              <div className="glass-card p-4">
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'ru' ? 'Распределение по поясам' : 'Timezone Distribution'}
                </h3>
                <DonutChartWidget 
                  data={Object.keys(groupedByOffset).slice(0, 8).map(key => ({
                    name: key,
                    value: groupedByOffset[key].length,
                  }))}
                  height={280}
                  centerLabel={time}
                  centerValue=""
                />
              </div>
            </div>
          )}

          {/* Группировка по часовым поясам - только для всех стран */}
          {toCity === '__all__' && (
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Время по часовым поясам' : 'Time by Timezone'}
              </h3>
              <div className="space-y-4">
                {Object.entries(groupedByOffset)
                  .sort((a, b) => {
                    const aOffset = parseFloat(a[0].replace('UTC', '').replace('+', ''))
                    const bOffset = parseFloat(b[0].replace('UTC', '').replace('+', ''))
                    return aOffset - bOffset
                  })
                  .map(([offset, cities]) => (
                  <div key={offset} className="border-b border-white/10 pb-3 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-primary">{offset}</span>
                      <span className="text-xs text-muted">
                        ({cities[0]?.time})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cities.map(c => (
                        <span 
                          key={c.city} 
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 text-sm"
                        >
                          {c.emoji} {language === 'ru' ? c.city : c.cityEn}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Все города - только для всех стран */}
          {toCity === '__all__' && (
            <div className="glass-card p-4">
              <h3 className="text-lg font-semibold mb-4">
                {language === 'ru' ? 'Время по всему миру' : 'World Time'} ({result.conversions.length} {language === 'ru' ? 'городов' : 'cities'})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {result.conversions.map(c => (
                  <div key={c.city} className="text-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <p className="text-xl mb-1">{c.emoji}</p>
                    <p className="text-xs text-muted truncate">{language === 'ru' ? c.city : c.cityEn}</p>
                    <p className="text-sm font-bold">{c.time}</p>
                    <p className="text-xs text-muted">{c.diff}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </CalculatorShell>
  )
}
