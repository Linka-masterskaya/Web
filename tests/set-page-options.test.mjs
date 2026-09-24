import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getSequenceElements,
  moveSequenceCard,
  resizeSetPageStructure,
  toggleSetPageAnswer,
} from '../src/entities/set/lib/set-page-structure.ts'

const choice = (type = 'single_choice') => ({
  id: 'page',
  type,
  elements: ['a', 'b', 'c'].map((id) => ({ id, kind: 'text', value: id })),
  answers: ['a', 'b', 'c'].map((element_id) => ({ element_id, is_correct: element_id === 'a' })),
})
const correctIds = (page) =>
  page.answers.filter((answer) => answer.is_correct).map((answer) => answer.element_id)

test('single choice replaces the correct answer without modifying card content', () => {
  const page = choice()
  const next = toggleSetPageAnswer(page, 'c')
  assert.deepEqual(correctIds(next), ['c'])
  assert.deepEqual(correctIds(page), ['a'])
  assert.equal(next.elements, page.elements)
  assert.deepEqual(correctIds(toggleSetPageAnswer(next, 'c')), ['c'])
})

test('multi choice toggles answers and retains the last correct answer', () => {
  const page = choice('multi_choice')
  const next = toggleSetPageAnswer(page, 'b')
  assert.deepEqual(correctIds(next), ['a', 'b'])
  const remaining = toggleSetPageAnswer(next, 'a')
  assert.deepEqual(correctIds(remaining), ['b'])
  assert.equal(toggleSetPageAnswer(remaining, 'b'), remaining)
  assert.equal(toggleSetPageAnswer(page, 'missing'), page)
})

test('shrinking choices removes stale answers and supplies a correct remaining answer', () => {
  const page = toggleSetPageAnswer(choice(), 'c')
  const next = resizeSetPageStructure(page, 2)
  assert.deepEqual(next.answers, [
    { element_id: 'a', is_correct: true },
    { element_id: 'b', is_correct: false },
  ])
  const grown = resizeSetPageStructure(next, 4)
  assert.equal(grown.elements.length, 4)
  assert.equal(new Set(grown.elements.map((card) => card.id)).size, 4)
  assert.deepEqual(correctIds(grown), ['a'])
})

const sequence = () => ({
  ...choice('sequence'),
  sequence: ['c', 'a', 'b'].map((element_id, index) => ({ element_id, order: index + 1 })),
})

test('sequence reads saved order and moves cards without mutating the source', () => {
  const page = sequence()
  assert.deepEqual(
    getSequenceElements(page).map((card) => card.id),
    ['c', 'a', 'b'],
  )
  const next = moveSequenceCard(page, 'a', -1)
  assert.deepEqual(
    next.sequence,
    ['a', 'c', 'b'].map((element_id, index) => ({ element_id, order: index + 1 })),
  )
  assert.deepEqual(
    getSequenceElements(page).map((card) => card.id),
    ['c', 'a', 'b'],
  )
  assert.equal(moveSequenceCard(page, 'c', -1), page)
  assert.equal(moveSequenceCard(page, 'b', 1), page)
  assert.equal(moveSequenceCard(page, 'missing', 1), page)
})

test('sequence resizing preserves saved order and appends new cards', () => {
  const smaller = resizeSetPageStructure(sequence(), 2)
  assert.deepEqual(
    smaller.elements.map((card) => card.id),
    ['c', 'a'],
  )
  const larger = resizeSetPageStructure(smaller, 4)
  assert.deepEqual(larger.sequence.slice(0, 2), smaller.sequence)
  assert.deepEqual(
    larger.sequence.map((item) => item.order),
    [1, 2, 3, 4],
  )
  assert.deepEqual(
    larger.sequence.map((item) => item.element_id),
    larger.elements.map((card) => card.id),
  )
})
