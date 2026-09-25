import {
  LIBRARY_DEFAULT_CATEGORY_ID,
  type TLibraryCard,
  useImportLibraryPicture,
  useLibraryCards,
  useLibraryCategories,
} from '@entities/library'
import { LibraryCards } from '@features/library-cards'
import { LibraryCategories } from '@features/library-categories'
import { LibrarySearch } from '@features/library-search'
import {
  ActionIcon,
  Blockquote,
  Button,
  Center,
  Flex,
  FocusTrap,
  Loader,
  ScrollArea,
  Text,
  Title,
} from '@mantine/core'
import { getApiErrorMessage } from '@shared/lib/api'
import { useModal } from '@shared/lib/modal'
import { Icon } from '@shared/ui/icon'
import { PopupLayout } from '@shared/ui/popup-layout'
import { useState } from 'react'
import styles from './library-settings.module.scss'
import type { TLibrarySettingsProps } from './types'

export const LibrarySettings: React.FC<TLibrarySettingsProps> = ({
  onSelect,
  selectionOnly = false,
}) => {
  const { close } = useModal()

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useLibraryCategories()

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    LIBRARY_DEFAULT_CATEGORY_ID,
  )
  const [selectedCards, setSelectedCards] = useState<TLibraryCard[]>([])
  const [searchedCard, setSearchedCard] = useState<TLibraryCard | null>(null)
  const [selectError, setSelectError] = useState<string | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)

  const activeCategoryId = selectedCategoryId ?? categories[0]?.id ?? null
  const activeCategory = categories.find((category) => category.id === activeCategoryId)

  const {
    data: cards = [],
    isLoading: isCardsLoading,
    isError: isCardsError,
  } = useLibraryCards(activeCategoryId)

  const importMutation = useImportLibraryPicture()
  const isPending = importMutation.isPending || isSelecting

  const handleCardSelect = (card: TLibraryCard) => {
    importMutation.reset()
    setSelectError(null)
    setSelectedCards((prevCards) => (prevCards[0]?.id === card.id ? [] : [card]))
  }

  const handleCategorySelect = (categoryId: string) => {
    importMutation.reset()
    setSelectError(null)
    setSelectedCategoryId(categoryId)
    setSelectedCards([])
    setSearchedCard(null)
  }

  const handleSearchSelect = (card: TLibraryCard) => {
    importMutation.reset()
    setSelectError(null)
    setSelectedCategoryId(card.categories[0]?.id ?? null)
    setSelectedCards([card])
    setSearchedCard({ ...card })
  }

  const applySelection = async (imports: Parameters<TLibrarySettingsProps['onSelect']>[1]) => {
    setSelectError(null)
    setIsSelecting(true)

    try {
      await onSelect(selectedCards, imports)
      close()
    } catch (error) {
      setSelectError(await getApiErrorMessage(error))
    } finally {
      setIsSelecting(false)
    }
  }

  const handleConfirm = () => {
    const [selectedCard] = selectedCards

    if (!selectedCard || isPending) {
      return
    }

    if (selectionOnly) {
      void applySelection([])
      return
    }

    importMutation.mutate(selectedCard.id, {
      onSuccess: (importResult) => {
        void applySelection([importResult])
      },
      onError: async (error) => {
        setSelectError(await getApiErrorMessage(error))
      },
    })
  }

  const errorMessage =
    selectError ??
    (importMutation.isError ? 'Не удалось выбрать изображение. Попробуйте ещё раз.' : null)

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
          {errorMessage && (
            <Blockquote
              className={styles.cardsFeedback}
              color="red"
              icon={<Icon name="Info" aria-hidden="true" />}
              iconSize={32}
              role="alert"
            >
              {errorMessage}
            </Blockquote>
          )}
          {activeCategory && (
            <Title
              order={2}
              className={errorMessage ? styles.cardsTitleAfterFeedback : styles.cardsTitle}
              size={30}
            >
              {activeCategory.name}
            </Title>
          )}
          <ScrollArea
            type="scroll"
            scrollbars="y"
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
          <Button w={240} variant="outline" onClick={close} disabled={isPending}>
            Отменить
          </Button>
          <Button
            w={240}
            onClick={handleConfirm}
            disabled={selectedCards.length === 0 || isPending}
            loading={isPending}
          >
            Выбрать
          </Button>
        </Flex>
      </Flex>
    </PopupLayout>
  )
}
