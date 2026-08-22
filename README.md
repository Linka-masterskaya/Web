# Проект React + TypeScript + Vite

Установка проекта:

```bash
npm install
```

## Линт и форматирование [Biome](https://biomejs.dev/)

**Документация**: [Biome](https://biomejs.dev/guides/getting-started/).

Если используете VS Code (или форк с тем же движком): установите [расширение Biome](https://biomejs.dev/guides/editors/first-party-extensions/).

Настроены команды автоформатирования при сохранении файла `.vscode/settings.json`.

Конфигурация форматтера и линтера в файле `biome.json`.

## Стек

### [FSD](https://feature-sliced.design/ru) — архитектура

**Документация**: [Feature-Sliced Design](https://feature-sliced.design/ru).

![FSD visual schema](https://feature-sliced.design/ru/assets/ideal-img/visual_schema.b6c18f6.1030.jpg)

Код разбит по слоям `app`, `pages`, `widgets`, `features`, `entities`, `shared` в каталоге `src/`. Каждую папку в слое нужно рассматривать как изолированный модуль и стараться максимально сокращать количество внешних импортов.

Импортировать можно модули только из нижних слоев (например, модули в `features` нельзя импортировать модули из `pages`) - вертикальные архитектурные границы.

Запрещены импорты между модулями одного слоя (например, если в папке `entities` есть папки `post` и `comment`, то запрещены импорты между ними) - горизонтальные архитектурные границы. Исключением является только слой `shared` - кросс-импорты внутри слоя разрешены.

Жестких правил в линтере нет, но старайтесь это отслеживать самостоятельно. Для удобства в проекте настроены алиасы, указывайте адреса импортов через них (`@features/book-list`).

**Возможная структура слоя** (если файл каждого типа один, можно не создавать папки):

- `index.ts` - файл реэкспорта (либо компонента, если модуль простой)
- `ui` - папка с реализацией ui
- `config` - папка/файл содержащие конфиги/константы в рамках модуля
- `types` - папка/файл содержащие типы
- `hooks` - папка содержащая хуки
- `utils` - папка/файл содержащие вспомогательные функции
- `forms` - папка/файл содержащие формы и все, что с ними связано

### ENV — переменные окружения

Всю работу с переменными окружения описываем в `src/shared/lib/env`.

Типы переменных задаются в `types.ts` (`IImportMetaEnv`). Для чтения переменных используем только `getRequiredEnv` и `getEnv` из `get-env.ts`:

- `getRequiredEnv` - для обязательных переменных, выбрасывает ошибку, если значение не задано или невалидно
- `getEnv` - для необязательных переменных, возвращает `undefined`, если значение не задано
- оба хелпера поддерживают приведение типов `string`, `number`, `boolean`

В коде к env обращаемся только через `config.ts` и объект `env`.

Пример:

```ts
const domain = env.apiDomain()
```

### Роутинг — [react-router-dom](https://reactrouter.com/start/data/installation) (data mode)

**Документация**: [React Router — Data mode](https://reactrouter.com/start/data/installation).

Маршрутизация (роутинг) декларативно описана в `src/app/providers/router/config.ts`. Описываем маршруты через объект с вложенностью (через сегменты роутов и `children`). Сегменты описаны в `routeSegments`.

Всю работу с url маршрутами описываем в `@shared/lib/routes`. В файле конфига перечисляются:

- `routeSegments` - сегменты роутов (используются в конфиге роутера)
- `routeParams` - имена параметров роутов (используются в конфиге роутера)
- `routeQueryParams` - перечень квери параметров (для формирования url)
- `routerPath` - готовые маршруты с параметрами формируются функцией `defineRoute`, возвращают строку вида `/book/:id` (используются для формирования url)

#### Формирование ссылок

Конфиг `src/shared/lib/routes/config.ts` стандартизирует все части строки маршрута, их редактирование должно происходить только в этом файле, а с помощью функций и объектов-хелперов составляем url для ссылок. Не используем прямых строк в коде вида `/books/1/details`.

- `defineRoute` - используется для формирования роута `routerPath`: принимает массив `TRouteSegment` и `TRouteParam`, возвращает строку вида `/book/:id` (**не используем в коде, только в конфиге**)
- `createUrl` - используется для формирования ссылок: принимает `routerPath`, объект значений параметров роута (подставляет значения параметров в роут), объект квери параметров (добавляет квери параметры со значениями в роут)

Пример:

```ts
import { createUrl, routerPath } from '@shared/lib/routes'

const url = createUrl(
  routerPath.card,
  { id: '42' },
  { query: 'iphone', pageNumber: '2', perPage: '16' },
)

// /card/42?query=iphone&page=2&per_page=16
```

#### Управление query параметрами

Для чтения и обновления query параметров используем `useRouteQueryParams` из `@shared/lib/routes`.

Хук возвращает:

- `queryParams` - объект текущих параметров из URL, но только с ключами, перечисленными в `routeQueryParams`
- `setQueryParams` - функция обновления query параметров

Пример:

```ts
const { queryParams, setQueryParams } = useRouteQueryParams()

const perPage = queryParams.perPage

setQueryParams({ perPage: '16' }) // обновит query, скролл включен (по умолчанию)
setQueryParams({ perPage: '8' }, false) // обновит query без сброса скролла
setQueryParams({ perPage: null }, false) // удалит perPage из URL
```

#### Разграничение доступа к страницам

Разграничение доступа в проекте осуществляется через `react-router-dom` (лоадеры). Они описаны в папке `src/app/providers/router/loaders`:

- у неавторизованных пользователей есть возможность посещать только страницы авторизации (`requireGuestLoader` для сегмента `routeSegments.auth` и дочерних роутов) и публичные роуты, авторизованные будут перенаправлены на дашборд
- у авторизованных пользователей есть возможность посещать страницы дашборда (`requireAuthLoader` для сегмента `routeSegments.dashboard` и дочерних роутов)(), и публичные роуты, неавторизованные пользователи будут перенаправлены на страницу авторизации
- `rootRedirectLoader` - делает редирект на страницу дашборда или авторизации в зависимости от того, авторизован пользователь или нет (формально исключает роут `/`)

### [SCSS](https://sass-lang.com/) и [clsx](https://www.npmjs.com/package/clsx) — работа со стилями

**Документация**: [Sass](https://sass-lang.com/documentation/) и [clsx](https://www.npmjs.com/package/clsx).

В проекте используем модульные стили (`*.module.scss`).

Общие стили — `src/app/styles/global.scss`.

clsx позволяет удобно работать с классами стилей в jsx.

Пример:

```tsx
import clsx from 'clsx'
import styles from './button.module.scss'

...

  <button
    className={clsx(styles.button, isActive && styles.active, className)}
  >
...
```

### [Mantine](https://mantine.dev) — UI

**Документация**: [Mantine](https://mantine.dev/getting-started/).

В качестве ui фреймворка выбран Mantine, имеет богатый функционал:

- работа с темой
- любой вид стилизации
- большой набор компонентов (расширяется отдельными модулями по необходимости)
- имеет большой набор хуков из коробки

Компоненты и тема подключаются через `ThemeProvider` в `src/app/providers/theme/`.

Глобальные стили Mantine импортируются в `src/app/main.tsx`.

### [Zod](https://zod.dev) — валидация данных

**Документация**: [Zod basics](https://zod.dev/basics).

Система валидации данных Zod. Используется для описания схем данных для работы с бэкендом (схемы тел запросов и ответов), схемы данных и валидация пользовательских форм.

Схемы лежат рядом с доменом, например `src/entities/user/model/user-form.schema.ts`. В формах подключаются через `zodResolver` из `@hookform/resolvers/zod`.

Пример простого описания схемы:

```ts
import { z } from 'zod'

export const userSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string(),
})

export type TUser = z.infer<typeof userSchema>

const user = userSchema.parse({
  id: 1,
  email: 'user@mail.com',
  name: 'Alex',
})
```

### [ky](https://www.npmjs.com/package/ky) — http-клиент

**Документация**: [ky на npm](https://www.npmjs.com/package/ky).

В проекте используется абстракция над http-клиентом `ky`, конфиг в `src/shared/lib/api/api-client.ts`.

Базовый URL берется из `env.apiDomain()` (`@shared/lib/env`) и нормализуется (добавляется завершающий `/`), после чего создается общий `apiClient` через `ky.create`.

Для запросов используем только `apiClient` из `@shared/lib/api`.

### Локальная работа с API

Для локальной разработки создайте `.env.local` по примеру `.env.example`. Запросы к
`/api/v1` будут направлены Vite proxy на backend, поэтому `HttpOnly` cookie с
`SameSite=Strict` останется first-party для `localhost` и refresh токена можно будет
проверить в браузере. Proxy также передаёт backend-у его origin для совместимости с
CSRF-проверкой refresh cookie.

Пример:

```ts
import { apiClient } from '@shared/lib/api'
import { productsResponseSchema, type TProduct } from '../model/product.schema'

export const getProducts = async (limit = 12): Promise<TProduct[]> => {
  const data = await apiClient
    .get('products', { searchParams: { limit } })
    .json(productsResponseSchema)

  return data.products
}
```

Так мы централизованно используем общий `baseUrl`, а ответ сразу валидируем схемой.

### [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/quick-start) — кеш запросов

**Документация**: [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/quick-start).

Кеширование (работа с кешами) запросов на бэкенд - TanStack Query (есть встроенные devtools для отслеживания состояния кэша).

`QueryClient` и провайдер — `src/shared/lib/query/`.

Хуки сущностей (например, `use-products`) описывают запросы и ключи кеша. В dev доступны React Query Devtools.

Пример описания хука:

```ts
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getProducts } from '../api/get-products'
import { productQueryKeys } from '../lib/query-keys'

const PRODUCTS_LIST_STALE_TIME_MS = 60_000

export const useProducts = (limit = 12) =>
  useQuery({
    queryKey: productQueryKeys.list(limit), // ключ кеша: отдельная запись для каждого limit
    queryFn: () => getProducts(limit), // функция запроса данных с сервера
    placeholderData: keepPreviousData, // сохраняет прошлый список, пока загружается новый
    staleTime: PRODUCTS_LIST_STALE_TIME_MS, // время (мс), пока данные считаются свежими
    gcTime: PRODUCTS_LIST_STALE_TIME_MS * 5, // время (мс) жизни неиспользуемого кеша перед удалением
    refetchOnMount: false, // не запрашивать повторно при новом маунте компонента
    refetchOnWindowFocus: false, // не запрашивать повторно при возврате фокуса на вкладку
    refetchOnReconnect: false, // не запрашивать повторно при восстановлении сети
  })
```

Так хук фиксирует ключ кеша, источник данных и единые правила обновления запроса.

### [React Hook Form](https://react-hook-form.com) — работа с формами

**Документация**: [React Hook Form](https://react-hook-form.com/get-started).

Гибкая работа и управление полями и сабмитом форм.

Пример в фиче `src/features/user-form/user-form.tsx` (`useForm`, `Controller`).

Пример формы c двумя полями и валидацией:

```tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const userFormSchema = z.object({
  name: z.string().min(1, 'Введите имя'), // валидация: обязательное поле (минимум 1 символ)
  email: z.email('Некорректный email'), // валидация: значение должно быть в формате email
})

type TUserFormValues = z.infer<typeof userFormSchema>

export const UserForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TUserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '', // инициализация поля name
      email: '', // инициализация поля email
    },
  })

  const onSubmit = (values: TUserFormValues) => {
    console.log(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Name" />
      {errors.name && <span>{errors.name.message}</span>}

      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <button type="submit">Submit</button>
    </form>
  )
}
```

### [Zustand](https://zustand.site) — клиентский стейт менеджер

**Документация**: [Zustand](https://zustand.site/en/docs/).

В качестве стейт менеджера используется Zustand - гибкость, простота работы, маленький бойлерплейт.

В проекте надо использовать абстракцию для создания и описания слайсов стора — `src/shared/lib/store/create-store.ts` (в нем реализована интеграция с devtools redux).

Пример — `src/entities/auth/model/auth-store.ts` (сессия).

Пример работы:

```ts
import { createStore } from '@shared/lib/store'

type TCounterStore = {
  count: number // текущее значение счетчика
  inc: () => void // увеличить счетчик на 1
  dec: () => void // уменьшить счетчик на 1
}

export const useCounterStore = createStore<TCounterStore>(
  'CounterStore', // имя стора в devtools
)((set) => ({
  count: 0, // стартовое значение состояния
  inc: () => set((state) => ({ count: state.count + 1 }), false, 'counter/inc'), // action: increment
  dec: () => set((state) => ({ count: state.count - 1 }), false, 'counter/dec'), // action: decrement
}))
```

Использование в компоненте:

```tsx
import { useCounterStore } from './counter-store'

export const Counter: React.FC = () => {
  const count = useCounterStore((state) => state.count) // получить значение из стора
  const inc = useCounterStore((state) => state.inc) // получить функцию увеличения
  const dec = useCounterStore((state) => state.dec) // получить функцию уменьшения

  return (
    <div>
      <button type="button" onClick={dec}>
        -
      </button>
      <span>{count}</span>
      <button type="button" onClick={inc}>
        +
      </button>
    </div>
  )
}
```

Так состояние и экшены описываются в одном месте, а действия видны в Redux DevTools.

### Error Boundary — обработка ошибок роутера

Для обработки ошибок маршрутов используется `RouteErrorFallback` в `src/app/providers/router/route-error-fallback.tsx`.

Тексты и типы ошибок централизованы в `src/shared/lib/error/get-error-content.ts` (ошибки роутера, HTTP-ошибки и fallback для неизвестных ошибок).

### Popup — модальные окна

Работу с модальными окнами обеспецивает модуль `src/shared/lib/modal`. Через контекст обеспечива
ся гарантированно единственное открытое модальное окно (как единый инструмент для работы с модальными окнами в любом месте проекта).

Провайдер подключается через `ModalAppLayout` в корневом роуте (`src/app/providers/router/config.ts`).

Для открытия и закрытия используем хук `useModal` из `@shared/lib/modal`:

- `open` — открывает попап с контентом и опциями Mantine `Modal` (`title`, `size`, `transitionProps` и др.)
- `close` — закрывает текущий попап
- `isOpen` — признак, что попап открыт

При смене `pathname` попап закрывается автоматически (`ModalRouteSync`).

Пример:

```tsx
import { Button, Flex, Image } from '@mantine/core'
import { useModal } from '@shared/lib/modal'

export const PopupDemonstration: React.FC = () => {
  const { open, close } = useModal()

  const handleOpen = () => {
    open({
      title: 'Popup title',
      size: 'md',
      content: (
        <Flex direction="column" align="center" gap="md">
          <Image src="/preview.webp" alt="" fit="contain" radius="md" />
          <Button variant="outline" onClick={close}>
            Close
          </Button>
        </Flex>
      ),
      transitionProps: { transition: 'slide-up' },
      onClose: () => console.log('popup closed'),
    })
  }

  return (
    <Button variant="outline" onClick={handleOpen}>
      Open popup
    </Button>
  )
}
```

## Скрипты

```bash
npm run dev    # dev-сервер
npm run build  # сборка
npm run lint   # линт, автофиксы и форматирование (biome check --write)
```

## Договоренности

- файлы именуем в кебаб-кейсе, например, `forgot-password.tsx`
- используем постфиксы, например, `login.page.tsx` (`component.types.ts` или `types.ts`)
- используем стрелочные функции везде, где нет необходимости в другой
- используем префиксы для типов и интерфейсов соответственно `T` и `I`
- предпочтительно используем типы
- записываем типы компонентов в имени, например, `const MyComponent: ReactFC<TMyComponentProps>`

## Статусы задач

- `backlog` - задачи в разработке (только для ПМ и наставника)
- `todo` - можно брать в работу (когда берете задачу в работу, обязательно нужно себя указать как исполнителя)
- `inProgress` - выполняется кем-то (одна задача в одни руки - одновременно только одна задача у человека в работе)
- `blocked` - не может быть выполнена, потому что зависит от выполнения другой задачи (пока задача заблокирована, можно приступать к выполнению другой задачи)
- `inReview` - готова для ревью (после завершения работы над задачей, делаете pr и ставите этот статус, в комментариях к задаче указываете pr)
- `readyToMerge` - можно вливать в ветку develop (прошла ревью минимум 3х человек и наставника)
- `merged` - вмержено в develop ветку (ставит разработчик после мержа)
- `done` - проверена и принята (ставит ПМ после проверки на тестовом стейдже)
- `canceled` - отменена по каким-то причинам и больше не будет делаться (если снова будет возобновлена, то идет в backlog)

## Работа с git

Префиксы веток и комментариев коммитов:

```text
feat: add button
feat/#15-add-feature
```

- `feat` — фичи
- `refactor` — рефакторинг
- `fix` — фикс (hotfix: хотфикс)
- `release` — релиз
