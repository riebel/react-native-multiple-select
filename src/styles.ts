/*!
 * react-native-multi-select
 * Copyright(c) 2017 Mustapha Babatunde Oluwaleke
 * MIT Licensed
 */

import { StyleSheet } from 'react-native'

export const colorPack = {
  primary: '#00A5FF',
  primaryDark: '#215191',
  light: '#FFF',
  textPrimary: '#525966',
  placeholderTextColor: '#A9A9A9',
  danger: '#C62828',
  borderColor: '#e9e9e9',
  backgroundColor: '#b1b1b1'
} as const

const styles = StyleSheet.create({
  footerWrapper: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  footerWrapperNC: {
    width: 320,
    flexDirection: 'column'
  },
  subSection: {
    backgroundColor: colorPack.light,
    borderBottomWidth: 1,
    borderColor: colorPack.borderColor,
    paddingLeft: 0,
    paddingRight: 20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  greyButton: {
    height: 40,
    borderRadius: 5,
    elevation: 0,
    backgroundColor: colorPack.backgroundColor
  },
  indicator: {
    fontSize: 30,
    color: colorPack.placeholderTextColor
  },
  indicatorPadded: {
    paddingLeft: 15,
    paddingRight: 15
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingTop: 3,
    paddingRight: 3,
    paddingBottom: 3,
    margin: 3,
    borderRadius: 20,
    borderWidth: 2
  },
  button: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: colorPack.light,
    fontSize: 14
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    backgroundColor: colorPack.light
  },
  dropdownView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginBottom: 10
  },
  searchIconMargin: {
    marginRight: 10
  },
  tagLabel: {
    flex: 1,
    fontSize: 15
  },
  tagRemoveIcon: {
    fontSize: 22,
    marginLeft: 10
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  rowItemText: {
    flex: 1,
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 5
  },
  rowPadding: {
    paddingLeft: 20,
    paddingRight: 20
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  disabledText: {
    color: 'grey'
  },
  checkIcon: {
    fontSize: 20
  },
  noItemsText: {
    flex: 1,
    marginTop: 20,
    textAlign: 'center',
    color: colorPack.danger
  },
  noItemsRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchInputFlex: {
    flex: 1
  },
  backArrowMargin: {
    marginLeft: 5
  },
  selectorContent: {
    flexDirection: 'column',
    backgroundColor: '#fafafa'
  },
  subSectionPadded: {
    paddingTop: 10,
    paddingBottom: 10
  },
  dropdownTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  dropdownLabelBase: {
    flex: 1,
    fontSize: 16
  },
  selectedItemLayout: {
    justifyContent: 'center' as const,
    height: 40
  }
})

export const selectorViewStyle = (fixedHeight: boolean) => ({
  flexDirection: 'column' as const,
  marginBottom: 10,
  elevation: 2,
  ...(fixedHeight ? { height: 250 } : {})
})

export default styles
