import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

type OptionBtnProps = {
  id: number
  title: String
  category: number
  handleSwitchCategory: (id: number) => void
}

const OptionBtn = ({ id, title, category, handleSwitchCategory }: OptionBtnProps) => {
  return (
    <TouchableOpacity
      onPress={() => handleSwitchCategory(id)}
      className={`py-2 px-2 shadow-md ${
        category === id ? 'bg-[#fad43a] border-2 border-[#000]' : 'bg-black border-2 border-[#fad43a]'
      } rounded-md mt-4`}>
      <View className=''>
        <Text className={`text-sm text-center ${category === id ? 'text-black font-bold' : 'text-[#fad43a]'}`}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default OptionBtn
