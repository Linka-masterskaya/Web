import {
  readSetPageAnswers,
  readSetPageCategories,
  readSetPagePairs,
  readSetPageSequence,
  type TSetPageElement,
  useSet,
} from '@entities/set'
import { ActionIcon, Center, Loader, Text } from '@mantine/core'
import {
  createSetSectionQuery,
  createUrl,
  routerPath,
  useRouteQueryParams,
} from '@shared/lib/routes'
import { CardGrid, type TCardGridItem } from '@shared/ui/card-grid'
import { DistributionGrid, type TDistributionGridItem } from '@shared/ui/distribution-grid'
import { Icon } from '@shared/ui/icon'
import { MatchingGrid, type TMatchingGridItem } from '@shared/ui/matching-grid'
import { PictureImage } from '@shared/ui/picture-image/picture-image'
import { useNavigate, useParams } from 'react-router'
import { z } from 'zod'
import styles from './set-preview-page.module.scss'

const idSchema = z.string().uuid()

const toCards = (elements: TSetPageElement[]): TCardGridItem[] =>
  elements.map((element) => {
    const type = element.card_type
    const cardType = type === 'text' || type === 'empty' || type === 'space' ? type : 'normal'
    const pictureId = element.source_picture_id ?? undefined

    return {
      id: element.id,
      cardType,
      title: element.value,
      media:
        cardType === 'normal' && pictureId ? (
          <PictureImage
            pictureId={pictureId}
            alt={element.value ?? ''}
            className={styles.cardImage}
          />
        ) : undefined,
      imageSrc: cardType === 'normal' && !pictureId ? element.media_url : undefined,
    }
  })

const toDistributionItem = (
  element: TSetPageElement | undefined,
  id: string,
): TDistributionGridItem => {
  if (!element) {
    return { id, cardType: 'text', title: '' }
  }
  const type = element.card_type
  const cardType = type === 'text' || type === 'empty' || type === 'space' ? type : 'normal'
  const pictureId = element.source_picture_id ?? undefined

  return {
    id: element.id,
    cardType,
    title: element.value,
    media:
      cardType === 'normal' && pictureId ? (
        <PictureImage
          pictureId={pictureId}
          alt={element.value ?? ''}
          className={styles.cardImage}
        />
      ) : undefined,
    imageSrc: cardType === 'normal' && !pictureId ? element.media_url : undefined,
  }
}

const getSizeFromCount = (count: number) => {
  const cols = Math.max(1, Math.ceil(Math.sqrt(count)))
  const rows = Math.max(1, Math.ceil(count / cols))
  return { rows, cols }
}

const toMatchingElements = (elements: TSetPageElement[]): TMatchingGridItem[] =>
  elements.map((element) => {
    const type = element.card_type
    const cardType = type === 'text' || type === 'empty' || type === 'space' ? type : 'normal'

    const pictureId = element.source_picture_id ?? undefined

    return {
      id: element.id,
      cardType,
      title: element.value,
      media:
        cardType === 'normal' && pictureId ? (
          <PictureImage
            pictureId={pictureId}
            alt={element.value ?? ''}
            className={styles.cardImage}
          />
        ) : undefined,
      imageSrc: cardType === 'normal' && !pictureId ? element.media_url : undefined,
      ariaLabel: element.value,
    }
  })

export const SetPreviewPage: React.FC = () => {
  const { setId, subsetId } = useParams()

  const parsedSetId = idSchema.safeParse(setId)
  const parsedSubsetId = idSchema.safeParse(subsetId)

  const resolvedSetId = parsedSetId.success ? parsedSetId.data : ''
  const setQuery = useSet(resolvedSetId)
  const navigate = useNavigate()
  const { queryParams } = useRouteQueryParams()
  const sectionQuery = createSetSectionQuery(
    queryParams.section === 'library' ||
      queryParams.section === 'my' ||
      queryParams.section === 'students'
      ? queryParams.section
      : null,
  )
  if (!parsedSetId.success || !parsedSubsetId.success) {
    return (
      <section className={styles.page}>
        <Text c="red.6" role="alert">
          Некорректный адрес страницы
        </Text>
      </section>
    )
  }

  if (setQuery.isLoading) {
    return (
      <Center className={styles.page}>
        <Loader aria-label="Загрузка предпросмотра" />
      </Center>
    )
  }

  if (setQuery.isError) {
    return (
      <section className={styles.page}>
        <Text c="red.6" role="alert">
          Не удалось загрузить набор
        </Text>
      </section>
    )
  }

  const pages = setQuery.data?.pages ?? []
  const activePage = pages.find((page) => page.id === parsedSubsetId.data)
  if (!activePage) {
    return (
      <section className={styles.page}>
        <Text c="red.6" role="alert">
          Страница не найдена в наборе
        </Text>
      </section>
    )
  }
  const activeIndex = pages.findIndex((page) => page.id === activePage.id)
  const prevPage = pages[activeIndex - 1]
  const nextPage = pages[activeIndex + 1]

  const openPage = (pageId: string) => {
    navigate(
      createUrl(
        routerPath.dashboardSubsetId,
        {
          setId: parsedSetId.data,
          subsetId: pageId,
        },
        sectionQuery,
      ),
    )
  }

  const sequence = readSetPageSequence(activePage)
  const orderedElements =
    activePage.type === 'sequence' && sequence.length > 0
      ? [...activePage.elements].sort(
          (left, right) =>
            (sequence.find((item) => item.element_id === left.id)?.order ?? 0) -
            (sequence.find((item) => item.element_id === right.id)?.order ?? 0),
        )
      : activePage.elements
  const cards = toCards(orderedElements)
  const size =
    activePage.type === 'grid' && activePage.layout
      ? {
          rows: activePage.layout.rows,
          cols: activePage.layout.columns,
        }
      : getSizeFromCount(cards.length)
  const renderPage = () => {
    const correctIds = readSetPageAnswers(activePage)
      .filter((answer) => answer.is_correct)
      .map((answer) => answer.element_id)

    switch (activePage.type) {
      case 'grid':
        return <CardGrid mode="plain" size={size} cards={cards} />
      case 'sequence':
        return <CardGrid mode="order" size={size} cards={cards} />
      case 'single_choice':
        return (
          <CardGrid
            mode="single"
            size={size}
            cards={cards}
            value={correctIds[0] ?? ''}
            onChange={() => undefined}
          />
        )
      case 'multi_choice':
        return (
          <CardGrid
            mode="multi"
            size={size}
            cards={cards}
            value={correctIds}
            onChange={() => undefined}
          />
        )
      case 'categories': {
        const categories = readSetPageCategories(activePage)
        const elementById = new Map(activePage.elements.map((element) => [element.id, element]))
        const itemCount = Math.max(1, ...categories.map((category) => category.items.length), 0)

        return (
          <DistributionGrid
            elementCount={itemCount}
            categories={categories.map((category) => ({
              id: category.id,
              header: toDistributionItem(
                elementById.get(category.element_id ?? ''),
                category.element_id ?? '',
              ),
              items: category.items.map((id) => toDistributionItem(elementById.get(id), id)),
            }))}
          />
        )
      }
      case 'matching': {
        const matchingElements = toMatchingElements(activePage.elements)
        const pairs = readSetPagePairs(activePage).map((pair) => ({
          leftId: pair.left_id,
          rightId: pair.right_id,
        }))
        return <MatchingGrid elements={matchingElements} pairs={pairs} />
      }
      default:
        return <Text>Отображение типа «{activePage.type}» добавим следующим шагом</Text>
    }
  }
  return (
    <section className={styles.page} aria-label="Предпросмотр страницы набора">
      <ActionIcon
        className={styles.arrow}
        variant="transparent"
        disabled={!prevPage}
        aria-label="Предыдущая страница"
        onClick={() => prevPage && openPage(prevPage.id)}
      >
        <Icon name="ArrowLeft" size={48} strokeWidth={2} />
      </ActionIcon>

      <div className={styles.stage}>{renderPage()}</div>

      <ActionIcon
        className={styles.arrow}
        variant="transparent"
        disabled={!nextPage}
        aria-label="Следующая страница"
        onClick={() => nextPage && openPage(nextPage.id)}
      >
        <Icon name="ArrowRight" size={48} strokeWidth={2} />
      </ActionIcon>
    </section>
  )
}
