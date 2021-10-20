import { ChainId } from '@opticlab/kdex-sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb', // TODO
  [ChainId.BAOBAB]: '0xc883CE91395247A3595A18245780Bb3a2b614306'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
