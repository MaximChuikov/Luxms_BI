export const sortingOptions = [
  { label: 'От худших отклонений' },
  { label: 'От наибольшего значения' },
  { label: 'От наименьшего значения' },
  { label: 'Порядок по умолчанию' }
]

export const deviationOptions = [
  { label: 'Все виды отклонений' },
  { label: 'К плану' },
  { label: 'К целевому значению' },
  { label: 'К прошлому году' },
  { label: 'К факту рассл. прошлого года' }
]

export const deviationTypesOptions = [
  { label: 'Все отклонения', value: 'allIndicators' },
  { label: 'Негативные отклонения', value: 'negativeIndicators' },
  { label: 'Позитивные отклонения', value: 'positiveIndicators' },
  { label: 'Индикация не предусмотрена', value: 'neutralIndicators' }
]

export const periodTypes = [
  { label: 'Все периоды' },
  { label: 'Месяц (итог)' },
  { label: 'Квартал (итог)' },
  { label: 'Год (итог)' },
  { label: 'По месяца с начала года (нар.)' },
  { label: 'По месяца с начала квартала (нар.)' },
  { label: 'По кварталам с начала года (нар.)' }
]

export const indicatorsTypes = [
  { label: 'Все типы показателей' },
  { label: 'Мониторинг' },
  { label: 'Контроль' },
  { label: 'Информационно-справочные' }
]

export const evaluationPerspectives = [
  { label: 'Все перспективы оценки' },
  { label: 'Безопасность и надежность' },
  { label: 'Клиенты и рынки' },
  { label: 'Технологические процессы' },
  { label: 'Экономика и финансы' },
  { label: 'Персонал и развитие' },
  { label: 'Цифровая зрелость' }
]

export const perspectivesOrTypes = [{ label: 'По перспективам оценки' }, { label: 'По типам показателей' }]

export const dataFormat = [
  { label: 'Абс. знач.', value: 'absolute' },
  { label: 'Доли', value: 'relative' }
]

export const EASDOptions = [
  { label: 'ЕАСД Ц', value: 'easdC' },
  { label: 'ЕАСД ЦЗ', value: 'easdCZ' }
]

export const EASDСOptions = [
  { label: 'Поручения Президента РФ и Правительства РФ', value: 'gorernmentAssignments' },
  { label: 'Прочие поручения Ц', value: 'otherAssignments' }
]

export const EASDСZOptions = [
  { label: 'Поручения Ц', value: 'cAssignments' },
  { label: 'Прочие поручения Ц', value: 'otherCAssignments' }
]
