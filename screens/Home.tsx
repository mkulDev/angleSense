import React, { useState, useEffect, useRef } from 'react'
import { Text, TouchableOpacity, View, Image, ImageBackground, TextInput, Dimensions } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { Accelerometer } from 'expo-sensors'
import { Foundation } from '@expo/vector-icons'
import OptionBtn from '../components/OptionBtn'
import ModeBtn from '../components/ModeBtn'
import { SafeAreaView } from 'react-native-safe-area-context'

interface AngleOption {
  titleBtn: string
  angle: number
}

export default function App() {
  const subscriptionRef = useRef(null)
  const speed = () => Accelerometer.setUpdateInterval(50)
  const pointerPosition = useSharedValue(50)
  const [angle, setAngle] = useState<string>('0')
  const [category, setCategory] = useState<number>(0)
  const [mode, setMode] = useState<number>(0)
  const [isModal, setIsModal] = useState(false)
  const [inputData, setInputData] = useState<string | null>(null)
  const [customAngle, setCustomAngle] = useState(180)

  const windowWidth = Dimensions.get('window').width
  const windowHeight = Dimensions.get('window').height

  // Buttons Sectiion
  const angleOption: AngleOption[] = [
    { titleBtn: 'Standard', angle: 0 },
    { titleBtn: 'Vertical', angle: 90 },
    { titleBtn: 'Angle 45°', angle: 45 },
    { titleBtn: `Custom ${customAngle}°`, angle: Number(customAngle) }, // Make sure custom btn always be the last.
  ]

  const switchMeasureMetod = (id: number) => {
    setMode(id)
  }

  const handleSwitchCategory = (id: number) => {
    setCategory(id)
    if (id === angleOption.length - 1) return setIsModal(!isModal)
  }

  // Custom Angle Setup Section
  const handleInput = (e: string) => {
    const numericValue = e.replace(/[^0-9]/g, '')
    if (numericValue === '') {
      setInputData(null)
    } else {
      const intValue = parseInt(numericValue, 10)
      if (intValue >= 0 && intValue <= 180) {
        setInputData(numericValue)
      } else {
        setInputData(null)
      }
    }
  }

  const switchCustomAngle = (inputData: number) => {
    setIsModal(false)
    const inputVeryfication = (inputData: number) => {
      if (inputData >= 0 && inputData <= 180) return inputData
      return
    }
    setCustomAngle(inputVeryfication(inputData))
    setInputData(null)
  }

  const pointerStyle = useAnimatedStyle(() => {
    return {
      top: `${pointerPosition.value}%`,
    }
  })

  //Accelerometr Subscription Section

  const _subscribe = () => {
    speed()
    let angleSum = 0
    let counter = 0

    const normalizeAngle = (angle: number) => {
      if (angle < -135) return 360 + angle
      return angle
    }

    subscriptionRef.current = Accelerometer.addListener((data) => {
      const { x, y, z } = data
      const calculatedAngle =
        mode === 0
          ? normalizeAngle(Math.atan2(y, z) * (180 / Math.PI))
          : normalizeAngle(Math.atan2(y, x) * (180 / Math.PI))

      const currentMode = angleOption[category].angle

      angleSum += calculatedAngle
      counter++

      if (counter === 10) {
        const average = (angleSum / counter).toFixed(1)
        const minPointerPosition = 5
        const maxPointerPosition = 95
        const pointerValue = Math.min(
          Math.max(50 - (Number(average) - currentMode) * 2.5, minPointerPosition),
          maxPointerPosition
        )

        const displayValue = average === '0.0' || average === '-0.0' ? '0°' : `${average}°`
        setAngle(displayValue)

        pointerPosition.value = withSpring(pointerValue, {
          damping: 10,
          stiffness: 40,
        })

        angleSum = 0
        counter = 0
      }
    })
  }
  const _unsubscribe = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove()
      subscriptionRef.current = null
    }
  }

  useEffect(() => {
    _subscribe()
    return () => _unsubscribe()
  }, [category, mode, customAngle])

  return (
    <SafeAreaView className='bg-black'>
      <ImageBackground source={require('../assets/bg1.jpg')} resizeMode='cover' className='h-full bg-black'>
        <View className='relative h-full w-full flex-col '>
          <View className=' flex-1 w-full flex-row justify-center mt-[40px]'>
            <View className='h-full w-1/4 flex-col justify-center mr-2 pt-[10%]'>
              {angleOption.map((button, index) => (
                <OptionBtn
                  key={index}
                  id={index}
                  title={button.titleBtn}
                  handleSwitchCategory={handleSwitchCategory}
                  category={category}
                />
              ))}
            </View>
            <View className='h-full relative'>
              <Animated.View
                style={pointerStyle}
                className={`absolute left-[50%] z-10 translate-x-[-18px] translate-y-[-25px] `}>
                <Foundation name='eye' size={50} color={'#000'} />
              </Animated.View>
              <Image
                source={require('../assets/progressBar2.png')}
                alt='progres-bar'
                className='h-full aspect-[1/6]'></Image>
            </View>
            <View className=' h-full w-1/4 flex justify-between py-5 pl-2 items-start'>
              <Text
                className={`text-sm font-bold text-[#fad43a] ${
                  pointerPosition.value > 51 ? 'opacity-1' : 'opacity-0'
                }`}>
                {mode === 0 ? 'pull up' : 'pull up >>'}
              </Text>
              <Text className='text-2xl font-bold text-[#fad43a]'> {angle}</Text>
              <Text
                className={`text-sm font-bold text-[#fad43a] ${
                  pointerPosition.value < 49 ? 'opacity-1' : 'opacity-0'
                }`}>
                {mode === 0 ? 'pull up' : 'pull up >>'}
              </Text>
            </View>
          </View>
          <View className='flex-col w-full justify-center '>
            <Text className='text-2xl font-bold text-[#fad43a] text-center mt-4 '>Measure By:</Text>
            <View className='w-full flex-row justify-center items-center mb-[40px]'>
              <ModeBtn id={0} mode={mode} title='Back of Phone' switchMeasureMetod={switchMeasureMetod} />
              <ModeBtn id={1} mode={mode} title='Left Edge' switchMeasureMetod={switchMeasureMetod} />
            </View>
          </View>
          {isModal && (
            <View
              className={`flex justify-center items-center absolute z-20 rounded-xl bg-[#1c1c1c]`}
              style={{ width: windowWidth, height: windowHeight }}>
              <Text className='text-lg text-[#fad43a] mb-2'>Provide angle from 0° to 180°</Text>
              <View className='flex-row justify-center items-center'>
                <TextInput
                  value={inputData}
                  keyboardType='numeric'
                  maxLength={3}
                  onChangeText={handleInput}
                  className='px-4 py-2 text-sm w-[100px] border-2 border-r-0 border-[#fad43a] text-[#fad43a] rounded-l-lg'></TextInput>
                <TouchableOpacity
                  className='border-2 border-[#fad43a] rounded-r-lg'
                  onPress={() => switchCustomAngle(Number(inputData))}>
                  <Text className='bg-[#fad43a] text-sm px-4 py-3 font-bold shadow-md '>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}
