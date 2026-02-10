import type { ComponentType, ReactNode } from 'react'
import type {
  ViewStyle,
  TextStyle,
  TextInputProps,
  StyleProp,
  FlatListProps
} from 'react-native'

export interface IconProps {
  name: string
  size?: number
  color?: string
  style?: StyleProp<TextStyle | ViewStyle>
  onPress?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IconComponentType = ComponentType<any> & ComponentType<IconProps>

export interface IconNames {
  search?: string
  close?: string
  check?: string
  arrowDown?: string
  arrowRight?: string
  arrowLeft?: string
}

export interface MultiSelectItem {
  [key: string]: unknown
  disabled?: boolean
}

export interface MultiSelectProps {
  items: MultiSelectItem[]
  iconComponent: IconComponentType
  iconNames?: Partial<IconNames>
  onSelectedItemsChange: (items: string[]) => void
  single?: boolean
  selectedItems?: string[]
  uniqueKey?: string
  displayKey?: string
  tagBorderColor?: string
  tagTextColor?: string
  tagRemoveIconColor?: string
  tagContainerStyle?: StyleProp<ViewStyle>
  fontFamily?: string
  selectedItemFontFamily?: string
  selectedItemTextColor?: string
  selectedItemIconColor?: string
  itemFontFamily?: string
  itemTextColor?: string
  itemFontSize?: number
  searchIcon?: ReactNode
  searchInputPlaceholderText?: string
  searchInputStyle?: StyleProp<TextStyle>
  selectText?: string
  selectedText?: string
  altFontFamily?: string
  fontSize?: number
  textColor?: string
  fixedHeight?: boolean
  hideTags?: boolean
  hideSubmitButton?: boolean
  hideDropdown?: boolean
  submitButtonColor?: string
  submitButtonText?: string
  canAddItems?: boolean
  removeSelected?: boolean
  noItemsText?: string
  filterMethod?: 'partial' | 'full'
  onAddItem?: (newItems: MultiSelectItem[]) => void
  onChangeInput?: (text: string) => void
  onClearSelector?: () => void
  onToggleList?: () => void
  textInputProps?: TextInputProps
  flatListProps?: Partial<FlatListProps<MultiSelectItem>>
  styleDropdownMenu?: StyleProp<ViewStyle>
  styleDropdownMenuSubsection?: StyleProp<ViewStyle>
  styleInputGroup?: StyleProp<ViewStyle>
  styleItemsContainer?: StyleProp<ViewStyle>
  styleListContainer?: StyleProp<ViewStyle>
  styleMainWrapper?: StyleProp<ViewStyle>
  styleRowList?: StyleProp<ViewStyle>
  styleSelectorContainer?: StyleProp<ViewStyle>
  styleTextDropdown?: StyleProp<TextStyle>
  styleTextDropdownSelected?: StyleProp<TextStyle>
  styleTextTag?: StyleProp<TextStyle>
  styleIndicator?: StyleProp<ViewStyle>
}

export interface MultiSelectRef {
  getSelectedItemsExt: (items?: string[]) => ReactNode
}
