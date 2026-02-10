import React, { createRef } from 'react'
import { Text } from 'react-native'
import { render, fireEvent, screen } from '@testing-library/react-native'
import MultiSelect from '../MultiSelect'
import type {
  MultiSelectProps,
  MultiSelectRef,
  MultiSelectItem,
  IconProps
} from '../types'

const MockIcon = (props: IconProps) => (
  <Text testID={`icon-${props.name}`} style={props.style}>
    {props.name}
  </Text>
)

const sampleItems: MultiSelectItem[] = [
  { _id: '1', name: 'Apple' },
  { _id: '2', name: 'Banana' },
  { _id: '3', name: 'Cherry' },
  { _id: '4', name: 'Date' },
  { _id: '5', name: 'Elderberry', disabled: true }
]

const defaultProps: MultiSelectProps = {
  items: sampleItems,
  iconComponent: MockIcon,
  onSelectedItemsChange: jest.fn()
}

const renderMultiSelect = (overrides: Partial<MultiSelectProps> = {}) =>
  render(<MultiSelect {...defaultProps} {...overrides} />)

beforeEach(() => {
  jest.clearAllMocks()
})

describe('MultiSelect', () => {
  describe('rendering', () => {
    it('renders with default select text', () => {
      renderMultiSelect()
      expect(screen.getByText('Select')).toBeTruthy()
    })

    it('renders with custom select text', () => {
      renderMultiSelect({ selectText: 'Pick items' })
      expect(screen.getByText('Pick items')).toBeTruthy()
    })

    it('shows selected count in label when items are selected', () => {
      renderMultiSelect({ selectedItems: ['1', '2'] })
      expect(screen.getByText('Select (2 selected)')).toBeTruthy()
    })

    it('shows item name in label for single mode', () => {
      renderMultiSelect({
        single: true,
        selectedItems: ['1']
      })
      expect(screen.getByText('Apple')).toBeTruthy()
    })

    it('displays tags for selected items', () => {
      renderMultiSelect({ selectedItems: ['1', '2'] })
      expect(screen.getByText('Apple')).toBeTruthy()
      expect(screen.getByText('Banana')).toBeTruthy()
    })

    it('hides tags when hideTags is true', () => {
      renderMultiSelect({
        selectedItems: ['1'],
        hideTags: true
      })
      expect(screen.queryByText('Apple')).toBeNull()
    })

    it('does not show tags in single mode', () => {
      renderMultiSelect({
        single: true,
        selectedItems: ['1']
      })
      // In single mode the label shows the name, but no tag row
      const apples = screen.getAllByText('Apple')
      expect(apples.length).toBe(1)
    })
  })

  describe('dropdown toggle', () => {
    it('opens dropdown on press', () => {
      renderMultiSelect()
      fireEvent.press(screen.getByText('Select'))
      expect(screen.getByPlaceholderText('Search')).toBeTruthy()
    })

    it('calls onToggleList when toggled', () => {
      const onToggleList = jest.fn()
      renderMultiSelect({ onToggleList })
      fireEvent.press(screen.getByText('Select'))
      expect(onToggleList).toHaveBeenCalledTimes(1)
    })

    it('shows all items in the dropdown list', () => {
      renderMultiSelect()
      fireEvent.press(screen.getByText('Select'))
      for (const item of sampleItems) {
        const label = String(item.name)
        expect(screen.getByText(label)).toBeTruthy()
      }
    })
  })

  describe('item selection', () => {
    it('calls onSelectedItemsChange when an item is pressed', () => {
      const onSelectedItemsChange = jest.fn()
      renderMultiSelect({ onSelectedItemsChange })
      fireEvent.press(screen.getByText('Select'))
      fireEvent.press(screen.getByText('Apple'))
      expect(onSelectedItemsChange).toHaveBeenCalledWith(['1'])
    })

    it('adds to existing selection in multi mode', () => {
      const onSelectedItemsChange = jest.fn()
      renderMultiSelect({
        onSelectedItemsChange,
        selectedItems: ['1']
      })
      fireEvent.press(screen.getByText('Select (1 selected)'))
      fireEvent.press(screen.getByText('Banana'))
      expect(onSelectedItemsChange).toHaveBeenCalledWith(['1', '2'])
    })

    it('deselects an already selected item in multi mode', () => {
      const onSelectedItemsChange = jest.fn()
      renderMultiSelect({
        onSelectedItemsChange,
        selectedItems: ['1', '2']
      })
      fireEvent.press(screen.getByText('Select (2 selected)'))
      fireEvent.press(screen.getByText('Apple'))
      expect(onSelectedItemsChange).toHaveBeenCalledWith(['2'])
    })

    it('replaces selection in single mode', () => {
      const onSelectedItemsChange = jest.fn()
      renderMultiSelect({
        onSelectedItemsChange,
        single: true,
        selectedItems: ['1']
      })
      fireEvent.press(screen.getByText('Apple'))
      fireEvent.press(screen.getByText('Banana'))
      expect(onSelectedItemsChange).toHaveBeenCalledWith(['2'])
    })
  })

  describe('tag removal', () => {
    it('removes a selected item when tag close icon is pressed', () => {
      const onSelectedItemsChange = jest.fn()
      renderMultiSelect({
        onSelectedItemsChange,
        selectedItems: ['1', '2']
      })
      const closeIcons = screen.getAllByTestId('icon-close-circle')
      fireEvent.press(closeIcons[0])
      expect(onSelectedItemsChange).toHaveBeenCalledWith(['2'])
    })
  })

  describe('search / filtering', () => {
    it('filters items with partial match by default', () => {
      renderMultiSelect()
      fireEvent.press(screen.getByText('Select'))
      fireEvent.changeText(screen.getByPlaceholderText('Search'), 'app')
      expect(screen.getByText('Apple')).toBeTruthy()
      expect(screen.queryByText('Banana')).toBeNull()
    })

    it('filters items with full match when filterMethod is full', () => {
      renderMultiSelect({ filterMethod: 'full' })
      fireEvent.press(screen.getByText('Select'))
      fireEvent.changeText(screen.getByPlaceholderText('Search'), 'an')
      expect(screen.getByText('Banana')).toBeTruthy()
      expect(screen.queryByText('Apple')).toBeNull()
    })

    it('calls onChangeInput when search text changes', () => {
      const onChangeInput = jest.fn()
      renderMultiSelect({ onChangeInput })
      fireEvent.press(screen.getByText('Select'))
      fireEvent.changeText(screen.getByPlaceholderText('Search'), 'test')
      expect(onChangeInput).toHaveBeenCalledWith('test')
    })

    it('shows no items text when filter yields no results', () => {
      renderMultiSelect({ noItemsText: 'Nothing found.' })
      fireEvent.press(screen.getByText('Select'))
      fireEvent.changeText(screen.getByPlaceholderText('Search'), 'zzzzz')
      expect(screen.getByText('Nothing found.')).toBeTruthy()
    })
  })

  describe('removeSelected', () => {
    it('hides already selected items from the dropdown', () => {
      renderMultiSelect({
        selectedItems: ['1'],
        removeSelected: true
      })
      fireEvent.press(screen.getByText('Select (1 selected)'))
      expect(screen.queryByText('Apple')).toBeNull()
      expect(screen.getByText('Banana')).toBeTruthy()
    })
  })

  describe('canAddItems', () => {
    it('shows add item row when search has no exact match', () => {
      renderMultiSelect({ canAddItems: true })
      fireEvent.press(screen.getByText('Select'))
      fireEvent.changeText(screen.getByPlaceholderText('Search'), 'Mango')
      expect(screen.getByText(/Add Mango/)).toBeTruthy()
    })

    it('calls onAddItem and onSelectedItemsChange when adding', () => {
      const onAddItem = jest.fn()
      const onSelectedItemsChange = jest.fn()
      renderMultiSelect({
        canAddItems: true,
        onAddItem,
        onSelectedItemsChange
      })
      fireEvent.press(screen.getByText('Select'))
      fireEvent.changeText(screen.getByPlaceholderText('Search'), 'Mango')
      fireEvent.press(screen.getByText(/Add Mango/))
      expect(onAddItem).toHaveBeenCalledTimes(1)
      expect(onSelectedItemsChange).toHaveBeenCalled()
    })

    it('does not show add row when search matches an existing item', () => {
      renderMultiSelect({ canAddItems: true })
      fireEvent.press(screen.getByText('Select'))
      fireEvent.changeText(screen.getByPlaceholderText('Search'), 'Apple')
      expect(screen.queryByText(/Add Apple/)).toBeNull()
    })
  })

  describe('submit button', () => {
    it('shows submit button by default', () => {
      renderMultiSelect()
      fireEvent.press(screen.getByText('Select'))
      expect(screen.getByText('Submit')).toBeTruthy()
    })

    it('renders custom submit button text', () => {
      renderMultiSelect({ submitButtonText: 'Done' })
      fireEvent.press(screen.getByText('Select'))
      expect(screen.getByText('Done')).toBeTruthy()
    })

    it('hides submit button when hideSubmitButton is true', () => {
      renderMultiSelect({ hideSubmitButton: true })
      fireEvent.press(screen.getByText('Select'))
      expect(screen.queryByText('Submit')).toBeNull()
    })

    it('closes selector on submit press', () => {
      renderMultiSelect()
      fireEvent.press(screen.getByText('Select'))
      expect(screen.getByPlaceholderText('Search')).toBeTruthy()
      fireEvent.press(screen.getByText('Submit'))
      expect(screen.queryByPlaceholderText('Search')).toBeNull()
    })
  })

  describe('custom keys', () => {
    it('supports custom uniqueKey and displayKey', () => {
      const customItems: MultiSelectItem[] = [
        { id: 'a', label: 'First' },
        { id: 'b', label: 'Second' }
      ]
      renderMultiSelect({
        items: customItems,
        uniqueKey: 'id',
        displayKey: 'label',
        selectedItems: ['a']
      })
      expect(screen.getByText('First')).toBeTruthy()
    })
  })

  describe('disabled items', () => {
    it('renders disabled items with disabled styling', () => {
      renderMultiSelect()
      fireEvent.press(screen.getByText('Select'))
      // Elderberry is disabled — it still renders but should be non-interactive
      expect(screen.getByText('Elderberry')).toBeTruthy()
    })
  })

  describe('imperative handle (ref)', () => {
    it('exposes getSelectedItemsExt via ref', () => {
      const ref = createRef<MultiSelectRef>()
      render(
        <MultiSelect
          {...defaultProps}
          selectedItems={['1', '2']}
          ref={ref}
        />
      )
      expect(ref.current).not.toBeNull()
      const result = ref.current?.getSelectedItemsExt()
      expect(result).toBeTruthy()
    })

    it('getSelectedItemsExt accepts optional items override', () => {
      const ref = createRef<MultiSelectRef>()
      render(
        <MultiSelect
          {...defaultProps}
          selectedItems={['1']}
          ref={ref}
        />
      )
      const result = ref.current?.getSelectedItemsExt(['2'])
      expect(result).toBeTruthy()
    })
  })

  describe('custom search placeholder', () => {
    it('uses custom searchInputPlaceholderText', () => {
      renderMultiSelect({ searchInputPlaceholderText: 'Find...' })
      fireEvent.press(screen.getByText('Select'))
      expect(screen.getByPlaceholderText('Find...')).toBeTruthy()
    })
  })

  describe('iconNames', () => {
    it('uses custom icon names when provided', () => {
      renderMultiSelect({
        iconNames: { arrowLeft: 'arrow-back' },
        selectedItems: ['1', '2']
      })
      fireEvent.press(screen.getByText('Select (2 selected)'))
      expect(screen.getByTestId('icon-arrow-back')).toBeTruthy()
      expect(screen.queryByTestId('icon-arrow-left')).toBeNull()
    })

    it('uses custom close icon name on tags', () => {
      renderMultiSelect({
        iconNames: { close: 'x-circle' },
        selectedItems: ['1']
      })
      expect(screen.getByTestId('icon-x-circle')).toBeTruthy()
      expect(screen.queryByTestId('icon-close-circle')).toBeNull()
    })
  })

  describe('hideDropdown', () => {
    it('hides the back arrow when hideDropdown is true', () => {
      renderMultiSelect({ hideDropdown: true })
      fireEvent.press(screen.getByText('Select'))
      expect(screen.queryByTestId('icon-arrow-left')).toBeNull()
    })

    it('shows the back arrow by default', () => {
      renderMultiSelect()
      fireEvent.press(screen.getByText('Select'))
      expect(screen.getByTestId('icon-arrow-left')).toBeTruthy()
    })
  })
})
