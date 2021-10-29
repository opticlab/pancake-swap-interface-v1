import React from 'react'
import { createCaverJsReactRoot, CaverJsReactProvider } from '@sixnetwork/caverjs-react-core'
import { Provider } from 'react-redux'
import { ModalProvider } from '@pancakeswap-libs/uikit'
import { NetworkContextName } from './constants'
import store from './state'
import getLibrary from './utils/getLibrary'
import { ThemeContextProvider } from './ThemeContext'

const CaverJsProviderNetwork = createCaverJsReactRoot(NetworkContextName)

const Providers: React.FC = ({ children }) => {
  return (
    <CaverJsReactProvider getLibrary={getLibrary}>
      <CaverJsProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <ThemeContextProvider>
            <ModalProvider>{children}</ModalProvider>
          </ThemeContextProvider>
        </Provider>
      </CaverJsProviderNetwork>
    </CaverJsReactProvider>
  )
}

export default Providers
