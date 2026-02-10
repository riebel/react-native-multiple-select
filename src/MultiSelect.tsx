/*!
 * react-native-multi-select
 * Copyright(c) 2017 Mustapha Babatunde Oluwaleke
 * MIT Licensed
 */

import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  UIManager
} from 'react-native'
import styles, { colorPack, selectorViewStyle } from './styles'
import type { MultiSelectProps, MultiSelectItem, MultiSelectRef } from './types'

// set UIManager LayoutAnimationEnabledExperimental
if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const getDisplayValue = (item: MultiSelectItem, key: string): string => {
  const val = item[key]
  if (val == null) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'number' || typeof val === 'boolean') return String(val)
  return ''
}

const MultiSelect = forwardRef<MultiSelectRef, MultiSelectProps>(
  (
    {
      single = false,
      selectedItems = [],
      items,
      iconComponent: Icon,
      iconNames,
      uniqueKey = '_id',
      displayKey = 'name',
      tagBorderColor = colorPack.primary,
      tagTextColor = colorPack.primary,
      tagRemoveIconColor = colorPack.danger,
      tagContainerStyle,
      fontFamily = '',
      selectedItemFontFamily = '',
      selectedItemTextColor = colorPack.primary,
      selectedItemIconColor = colorPack.primary,
      itemFontFamily = '',
      itemTextColor = colorPack.textPrimary,
      itemFontSize = 16,
      searchIcon,
      searchInputPlaceholderText = 'Search',
      searchInputStyle = { color: colorPack.textPrimary },
      selectText = 'Select',
      selectedText = 'selected',
      altFontFamily = '',
      fontSize = 14,
      textColor = colorPack.textPrimary,
      fixedHeight = false,
      hideTags = false,
      hideSubmitButton = false,
      hideDropdown = false,
      submitButtonColor = '#CCC',
      submitButtonText = 'Submit',
      canAddItems = false,
      removeSelected = false,
      noItemsText = 'No items to display.',
      filterMethod = 'partial',
      onSelectedItemsChange,
      onAddItem,
      onChangeInput,
      onClearSelector: onClearSelectorProp,
      onToggleList,
      textInputProps,
      flatListProps,
      styleDropdownMenu,
      styleDropdownMenuSubsection,
      styleInputGroup,
      styleItemsContainer,
      styleListContainer,
      styleMainWrapper,
      styleRowList,
      styleSelectorContainer,
      styleTextDropdown,
      styleTextDropdownSelected,
      styleTextTag,
      styleIndicator
    },
    ref
  ) => {
    const [selector, setSelector] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const names = React.useMemo(
      () => ({
        search: iconNames?.search ?? 'magnify',
        close: iconNames?.close ?? 'close-circle',
        check: iconNames?.check ?? 'check',
        arrowDown: iconNames?.arrowDown ?? 'menu-down',
        arrowRight: iconNames?.arrowRight ?? 'menu-right',
        arrowLeft: iconNames?.arrowLeft ?? 'arrow-left'
      }),
      [iconNames]
    )

    const resolvedSearchIcon = searchIcon ?? (
      <Icon
        name={names.search}
        size={20}
        color={colorPack.placeholderTextColor}
        style={styles.searchIconMargin}
      />
    )

    const getItemKey = useCallback(
      (item: MultiSelectItem): string => getDisplayValue(item, uniqueKey),
      [uniqueKey]
    )

    const findItem = useCallback(
      (itemKey: string): MultiSelectItem =>
        items.find((singleItem) => singleItem[uniqueKey] === itemKey) ?? {},
      [items, uniqueKey]
    )

    const itemSelected = useCallback(
      (item: MultiSelectItem): boolean => selectedItems.indexOf(getItemKey(item)) !== -1,
      [selectedItems, getItemKey]
    )

    const handleChangeInput = useCallback(
      (value: string) => {
        onChangeInput?.(value)
        setSearchTerm(value)
      },
      [onChangeInput]
    )

    const getSelectLabel = useCallback((): string => {
      if (selectedItems.length === 0) {
        return selectText
      }
      if (single) {
        const foundItem = findItem(selectedItems[0])
        return getDisplayValue(foundItem, displayKey) || selectText
      }
      return `${selectText} (${String(selectedItems.length)} ${selectedText})`
    }, [selectedItems, selectText, single, findItem, displayKey, selectedText])

    const clearSearchTerm = useCallback(() => {
      setSearchTerm('')
    }, [])

    const toggleSelector = useCallback(() => {
      setSelector((prev) => !prev)
      onToggleList?.()
    }, [onToggleList])

    const submitSelection = useCallback(() => {
      toggleSelector()
      clearSearchTerm()
    }, [toggleSelector, clearSearchTerm])

    const clearSelectorCallback = useCallback(() => {
      setSelector(false)
      onClearSelectorProp?.()
    }, [onClearSelectorProp])

    const removeItem = useCallback(
      (item: MultiSelectItem) => {
        const key = getItemKey(item)
        const newItems = selectedItems.filter((singleItem) => key !== singleItem)
        onSelectedItemsChange(newItems)
      },
      [selectedItems, getItemKey, onSelectedItemsChange]
    )

    const toggleItem = useCallback(
      (item: MultiSelectItem) => {
        const key = getItemKey(item)
        if (single) {
          submitSelection()
          onSelectedItemsChange([key])
        } else {
          const isSelected = itemSelected(item)
          const newItems = isSelected
            ? selectedItems.filter((singleItem) => key !== singleItem)
            : [...selectedItems, key]
          onSelectedItemsChange(newItems)
        }
      },
      [
        single,
        getItemKey,
        selectedItems,
        onSelectedItemsChange,
        itemSelected,
        submitSelection
      ]
    )

    const addItem = useCallback(() => {
      const newItemName = searchTerm
      if (newItemName) {
        const newItemId = newItemName
          .split(' ')
          .filter((word) => word.length)
          .join('-')
        const newItems = [...items, { [uniqueKey]: newItemId, name: newItemName }]
        const newSelectedItems = [...selectedItems, newItemId]
        onAddItem?.(newItems)
        onSelectedItemsChange(newSelectedItems)
        clearSearchTerm()
      }
    }, [
      searchTerm,
      items,
      uniqueKey,
      selectedItems,
      onAddItem,
      onSelectedItemsChange,
      clearSearchTerm
    ])

    const itemStyle = useCallback(
      (item: MultiSelectItem) => {
        const isSelected = itemSelected(item)
        const ff: { fontFamily?: string } = {}
        if (isSelected && selectedItemFontFamily) {
          ff.fontFamily = selectedItemFontFamily
        } else if (!isSelected && itemFontFamily) {
          ff.fontFamily = itemFontFamily
        }
        const color = isSelected
          ? { color: selectedItemTextColor }
          : { color: itemTextColor }
        return { ...ff, ...color, fontSize: itemFontSize }
      },
      [
        itemSelected,
        selectedItemFontFamily,
        itemFontFamily,
        selectedItemTextColor,
        itemTextColor,
        itemFontSize
      ]
    )

    const displaySelectedItems = useCallback(
      (optionalSelectedItems?: string[]) => {
        const actualSelectedItems = optionalSelectedItems ?? selectedItems
        return actualSelectedItems.map((singleSelectedItem) => {
          const item = findItem(singleSelectedItem)
          const label = getDisplayValue(item, displayKey)
          if (!label) return null
          return (
            <View
              style={[
                styles.selectedItem,
                styles.selectedItemLayout,
                {
                  width: label.length * 8 + 60,
                  borderColor: tagBorderColor
                },
                tagContainerStyle ?? {}
              ]}
              key={getItemKey(item)}
            >
              <Text
                style={[
                  styles.tagLabel,
                  { color: tagTextColor },
                  styleTextTag ?? {},
                  fontFamily ? { fontFamily } : {}
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  removeItem(item)
                }}
              >
                <Icon
                  name={names.close}
                  style={[styles.tagRemoveIcon, { color: tagRemoveIconColor }]}
                />
              </TouchableOpacity>
            </View>
          )
        })
      },
      [
        Icon,
        names,
        selectedItems,
        findItem,
        displayKey,
        getItemKey,
        tagBorderColor,
        tagTextColor,
        tagRemoveIconColor,
        tagContainerStyle,
        styleTextTag,
        fontFamily,
        removeItem
      ]
    )

    useImperativeHandle(
      ref,
      () => ({
        getSelectedItemsExt: (optionalItems?: string[]) => (
          <View style={styles.rowWrap}>{displaySelectedItems(optionalItems)}</View>
        )
      }),
      [displaySelectedItems]
    )

    const filterItemsPartial = useCallback(
      (term: string): MultiSelectItem[] => {
        const parts = term.trim().split(/[ \-:]+/)
        const regex = new RegExp(`(${parts.join('|')})`, 'ig')
        return items.filter((item) => regex.test(getDisplayValue(item, displayKey)))
      },
      [items, displayKey]
    )

    const filterItemsFull = useCallback(
      (term: string): MultiSelectItem[] => {
        const lower = term.trim().toLowerCase()
        return items.filter(
          (item) => getDisplayValue(item, displayKey).toLowerCase().indexOf(lower) >= 0
        )
      },
      [items, displayKey]
    )

    const filterItems = useCallback(
      (term: string): MultiSelectItem[] => {
        if (filterMethod === 'full') return filterItemsFull(term)
        return filterItemsPartial(term)
      },
      [filterMethod, filterItemsFull, filterItemsPartial]
    )

    const getRow = useCallback(
      (item: MultiSelectItem) => (
        <TouchableOpacity
          disabled={Boolean(item.disabled)}
          onPress={() => {
            toggleItem(item)
          }}
          style={[styleRowList, styles.rowPadding]}
        >
          <View>
            <View style={styles.rowAlignCenter}>
              <Text
                style={[
                  styles.rowItemText,
                  itemStyle(item),
                  item.disabled ? styles.disabledText : {}
                ]}
              >
                {getDisplayValue(item, displayKey)}
              </Text>
              {itemSelected(item) ? (
                <Icon
                  name={names.check}
                  style={[styles.checkIcon, { color: selectedItemIconColor }]}
                />
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      ),
      [
        Icon,
        names,
        toggleItem,
        styleRowList,
        itemStyle,
        displayKey,
        itemSelected,
        selectedItemIconColor
      ]
    )

    const getRowNew = useCallback(
      (item: MultiSelectItem) => (
        <TouchableOpacity
          disabled={Boolean(item.disabled)}
          onPress={() => {
            addItem()
          }}
          style={styles.rowPadding}
        >
          <View>
            <View style={styles.rowAlignCenter}>
              <Text
                style={[
                  styles.rowItemText,
                  itemStyle(item),
                  item.disabled ? styles.disabledText : {}
                ]}
              >
                Add {getDisplayValue(item, 'name')} (tap or press return)
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ),
      [addItem, itemStyle]
    )

    const renderItems = useCallback(() => {
      let renderList = searchTerm ? filterItems(searchTerm) : items

      if (removeSelected) {
        renderList = renderList.filter(
          (item) => !selectedItems.includes(getItemKey(item))
        )
      }

      let itemList: React.ReactNode = null
      let searchTermMatch = false

      if (renderList.length) {
        itemList = (
          <FlatList
            data={renderList}
            extraData={selectedItems}
            keyExtractor={(_item: MultiSelectItem, index: number) => index.toString()}
            renderItem={(rowData: { item: MultiSelectItem }) => getRow(rowData.item)}
            {...flatListProps}
            nestedScrollEnabled
          />
        )
        searchTermMatch = renderList.some((item) => item.name === searchTerm)
      } else if (!canAddItems) {
        itemList = (
          <View style={styles.noItemsRow}>
            <Text style={[styles.noItemsText, fontFamily ? { fontFamily } : {}]}>
              {noItemsText}
            </Text>
          </View>
        )
      }

      let addItemRow: React.ReactNode = null
      if (canAddItems && !searchTermMatch && searchTerm.length) {
        addItemRow = getRowNew({ name: searchTerm })
      }

      return (
        <View style={styleListContainer}>
          {itemList}
          {addItemRow}
        </View>
      )
    }, [
      searchTerm,
      filterItems,
      items,
      removeSelected,
      selectedItems,
      getItemKey,
      getRow,
      flatListProps,
      canAddItems,
      fontFamily,
      noItemsText,
      getRowNew,
      styleListContainer
    ])

    return (
      <View style={styleMainWrapper}>
        {selector ? (
          <View style={[selectorViewStyle(fixedHeight), styleSelectorContainer]}>
            <View style={[styles.inputGroup, styleInputGroup]}>
              {resolvedSearchIcon}
              <TextInput
                autoFocus
                onChangeText={handleChangeInput}
                onSubmitEditing={addItem}
                placeholder={searchInputPlaceholderText}
                placeholderTextColor={colorPack.placeholderTextColor}
                underlineColorAndroid="transparent"
                style={[searchInputStyle, styles.searchInputFlex]}
                value={searchTerm}
                {...textInputProps}
              />
              {hideSubmitButton && (
                <TouchableOpacity onPress={submitSelection}>
                  <Icon
                    name={names.arrowDown}
                    style={[styles.indicator, styles.indicatorPadded, styleIndicator]}
                  />
                </TouchableOpacity>
              )}
              {!hideDropdown && (
                <Icon
                  name={names.arrowLeft}
                  size={20}
                  onPress={clearSelectorCallback}
                  color={colorPack.placeholderTextColor}
                  style={styles.backArrowMargin}
                />
              )}
            </View>
            <View style={styles.selectorContent}>
              <View style={styleItemsContainer}>{renderItems()}</View>
              {!single && !hideSubmitButton && (
                <TouchableOpacity
                  onPress={submitSelection}
                  style={[styles.button, { backgroundColor: submitButtonColor }]}
                >
                  <Text style={[styles.buttonText, fontFamily ? { fontFamily } : {}]}>
                    {submitButtonText}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <View>
            <View style={[styles.dropdownView, styleDropdownMenu]}>
              <View
                style={[
                  styles.subSection,
                  styles.subSectionPadded,
                  styleDropdownMenuSubsection
                ]}
              >
                <TouchableWithoutFeedback onPress={toggleSelector}>
                  <View style={styles.dropdownTouchable}>
                    <Text
                      style={
                        selectedItems.length === 0
                          ? [
                              styles.dropdownLabelBase,
                              {
                                fontSize,
                                color: textColor || colorPack.placeholderTextColor
                              },
                              styleTextDropdown,
                              altFontFamily
                                ? { fontFamily: altFontFamily }
                                : fontFamily
                                  ? { fontFamily }
                                  : {}
                            ]
                          : [
                              styles.dropdownLabelBase,
                              {
                                fontSize,
                                color: textColor || colorPack.placeholderTextColor
                              },
                              styleTextDropdownSelected
                            ]
                      }
                      numberOfLines={1}
                    >
                      {getSelectLabel()}
                    </Text>
                    <Icon
                      name={hideSubmitButton ? names.arrowRight : names.arrowDown}
                      style={[styles.indicator, styleIndicator]}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            {!single && !hideTags && selectedItems.length ? (
              <View style={styles.rowWrap}>{displaySelectedItems()}</View>
            ) : null}
          </View>
        )}
      </View>
    )
  }
)

MultiSelect.displayName = 'MultiSelect'

export default MultiSelect
