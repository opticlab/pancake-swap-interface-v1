import { ConnectorNames } from '@pancakeswap-libs/uikit'
import { CaverProvider } from 'klaytn-providers'
import { InjectedConnector } from '@sixnetwork/caverjs-react-injected-connector'
import { NetworkConnector } from '@sixnetwork/caverjs-react-network-connector'
import { KlipConnector } from '@sixnetwork/klip-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL

export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '8217')

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL },
})

let networkLibrary: CaverProvider | undefined
export function getNetworkLibrary(): CaverProvider {
  // eslint-disable-next-line no-return-assign
  return (networkLibrary = networkLibrary ?? new CaverProvider(network.getProvider() as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [1001],
})

export const klipConnector = new KlipConnector({ showModal: () => { console.log("Show") }, closeModal: () => { console.log("Close") } })

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { [NETWORK_CHAIN_ID]: NETWORK_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000,
})

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: klipConnector,
}
