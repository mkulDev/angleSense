import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

type OptionBtnProps = {
  id: number
  title: String
  mode: number
  switchMeasureMetod: (id: number) => void
}

const ModeBtn = ({ id, title, mode, switchMeasureMetod }: OptionBtnProps) => {
  return (
    <TouchableOpacity
      onPress={() => switchMeasureMetod(id)}
      accessibilityRole={'button'}
      className={`py-2 px-2 shadow-md w-[120px] mx-2 ${
        mode === id ? 'bg-[#fad43a] border-2 border-[#000]' : 'bg-black border-2 border-[#fad43a]'
      } rounded-md mt-2`}>
      <View className=''>
        <Text className={`text-sm text-center ${mode === id ? 'text-black font-bold' : 'text-[#fad43a]'}`}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default ModeBtn
