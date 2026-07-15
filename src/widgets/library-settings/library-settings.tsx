import {
  LIBRARY_DEFAULT_CATEGORY_ID,
  type TLibraryCard,
  useLibraryCards,
  useLibraryCategories,
} from '@entities/library'
import { LibraryCards } from '@features/library-cards'
import { LibraryCategories } from '@features/library-categories'
import { LibrarySearch } from '@features/library-search'
import {
  ActionIcon,
  Button,
  Center,
  Flex,
  FocusTrap,
  Loader,
  ScrollArea,
  Text,
  Title,
} from '@mantine/core'
import { useModal } from '@shared/lib/modal'
import { Icon } from '@shared/ui/icon'
import { PopupLayout } from '@shared/ui/popup-layout'
import { useState } from 'react'
import styles from './library-settings.module.scss'
import type { TLibrarySettingsProps } from './types'

export const LibrarySettings: React.FC<TLibrarySettingsProps> = ({ onSelect }) => {
  const { close } = useModal()

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useLibraryCategories()

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    LIBRARY_DEFAULT_CATEGORY_ID,
  )
  const [selectedCards, setSelectedCards] = useState<TLibraryCard[]>([])

  // Карточка, выбранная через поиск: сетка прокручивается так, чтобы её ряд стал первым видимым
  const [searchedCard, setSearchedCard] = useState<TLibraryCard | null>(null)

  // При первом открытии — категория из config или первая из списка
  const activeCategoryId = selectedCategoryId ?? categories[0]?.id ?? null
  const activeCategory = categories.find((category) => category.id === activeCategoryId)

  const {
    data: cards = [],
    isLoading: isCardsLoading,
    isError: isCardsError,
  } = useLibraryCards(activeCategoryId)

  // Одиночный выбор: клик выбирает карточку, повторный клик снимает выбор
  const handleCardSelect = (card: TLibraryCard) => {
    setSelectedCards((prevCards) => (prevCards[0]?.id === card.id ? [] : [card]))
  }

  // Переключение категории
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId)
    setSelectedCards([])
    // Сбрасываем цель прокрутки, чтобы возврат в категорию не скроллил к старому результату поиска
    setSearchedCard(null)
  }

  // Выбор подсказки в поиске: активируем категорию найденной карточки и выделяем её в сетке
  const handleSearchSelect = (card: TLibraryCard) => {
    setSelectedCategoryId(card.categoryId)
    setSelectedCards([card])
    // Копия объекта — чтобы повторный выбор той же карточки снова запускал прокрутку
    setSearchedCard({ ...card })
  }

  const handleConfirm = () => {
    onSelect(selectedCards)
    close()
  }

  const renderCards = () => {
    if (isCardsLoading) {
      return (
        <Center h="100%">
          <Loader />
        </Center>
      )
    }

    if (isCardsError) {
      return <Text c="red.6">Не удалось загрузить карточки. Попробуйте позже.</Text>
    }

    return (
      <LibraryCards
        cards={cards}
        selectedCards={selectedCards}
        onSelect={handleCardSelect}
        scrollToCard={searchedCard}
      />
    )
  }

  const renderBody = () => {
    if (isCategoriesLoading) {
      return (
        <Center className={styles.body}>
          <Loader />
        </Center>
      )
    }

    if (isCategoriesError) {
      return (
        <Center className={styles.body}>
          <Text c="red.6">Не удалось загрузить библиотеку. Попробуйте позже.</Text>
        </Center>
      )
    }

    return (
      <Flex className={styles.body}>
        <Flex direction="column" gap="lg" className={styles.categories}>
          <Text fw={700} ta="center" lh="24px" className={styles.categoriesTitle}>
            Категории
          </Text>
          <ScrollArea
            type="auto"
            className={styles.categoriesScroll}
            classNames={{ viewport: styles.categoriesViewport }}
          >
            <LibraryCategories
              categories={categories}
              selectedCategoryId={activeCategoryId}
              onSelect={handleCategorySelect}
            />
          </ScrollArea>
        </Flex>

        <Flex direction="column" gap="lg" className={styles.cards}>
          {/* styles переопределяет text-align: center из theme/config.ts — по макету заголовок слева */}
          {activeCategory && (
            <Title
              order={1}
              className={styles.cardsTitle}
              styles={{ root: { textAlign: 'left', lineHeight: '40px' } }}
            >
              {activeCategory.name}
            </Title>
          )}
          <ScrollArea
            type="auto"
            className={styles.cardsScroll}
            classNames={{ viewport: styles.cardsViewport }}
          >
            {renderCards()}
          </ScrollArea>
        </Flex>
      </Flex>
    )
  }

  return (
    <PopupLayout>
      <Flex direction="column" className={styles.container}>
        <FocusTrap.InitialFocus />
        <Flex align="center" className={styles.header}>
          <LibrarySearch className={styles.search} onSelect={handleSearchSelect} />
          <Flex align="center" gap="xl" className={styles.headerIcons}>
            <ActionIcon variant="subtle" color="gray" aria-label="Закрыть" onClick={close}>
              <Icon name="X" size={24} />
            </ActionIcon>
          </Flex>
        </Flex>

        {renderBody()}

        <Flex justify="flex-end" gap={12} className={styles.footer}>
          <Button w={240} variant="outline" onClick={close}>
            Отменить
          </Button>
          <Button w={240} onClick={handleConfirm} disabled={selectedCards.length === 0}>
            Выбрать
          </Button>
        </Flex>
      </Flex>
    </PopupLayout>
  )
}
