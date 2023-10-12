import Home from './screens/Home'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function App() {
  return (
    <SafeAreaProvider className='bg-black'>
      <Home />
    </SafeAreaProvider>
  )
}
