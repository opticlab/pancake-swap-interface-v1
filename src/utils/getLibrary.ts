import { CaverProvider } from 'klaytn-providers'

export default function getLibrary(provider: any): CaverProvider {
  const library = new CaverProvider(provider)
  library.pollingInterval = 15000
  return library
}
