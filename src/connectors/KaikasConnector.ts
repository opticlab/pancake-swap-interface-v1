import { ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'

export class NoKlaytnProviderError extends Error {
    public constructor() {
      super()
      this.name = this.constructor.name
      this.message = 'No Klaytn provider was found on window.klaytn.'
    }
  }

declare let window: any;

export class KaikasConnector extends AbstractConnector {
    private handleAccountsChanged(accounts: string[]) {
        if (accounts.length === 0) {
            this.emitDeactivate()
            } else {
            this.emitUpdate({ account: accounts[0] })
        }
    }

    private handleNetworkChanged(networkId: string | number) {
        this.emitUpdate({ chainId: networkId, provider: window.klaytn })
    }

    public async activate(): Promise<ConnectorUpdate> {
        const { klaytn } = window
        if (klaytn === undefined) {
            throw new NoKlaytnProviderError()
        }

        klaytn.on('accountsChanged', this.handleAccountsChanged)
        klaytn.on('networkChanged', this.handleNetworkChanged)

        if (klaytn.isKaikas) {
            klaytn.autoRefreshOnNetworkChange = false
        }

        await klaytn.enable()

        const account = klaytn.selectedAddress

        return { provider: klaytn, ...(account ? { account } : {}) }
    }

    public getProvider(): Promise<any> {
        const { klaytn } = window
        if (klaytn === undefined) {
            throw new NoKlaytnProviderError()
        }

        return klaytn
    }

    public getChainId(): Promise<number | string> {
        const { klaytn } = window
        if (klaytn === undefined) {
            throw new NoKlaytnProviderError()
        }

        return klaytn.networkVersion
    }

    public getAccount(): Promise<string | null> {
        const { klaytn } = window
        if (klaytn === undefined) {
            throw new NoKlaytnProviderError()
        }

        return klaytn.selectedAddress
    }

    public deactivate(): void {
        const { klaytn } = window
        if (klaytn === undefined) {
            throw new NoKlaytnProviderError()
        }

        if (klaytn && klaytn.removeListener) {
            klaytn.removeListener('accountsChanged', this.handleAccountsChanged)
            klaytn.removeListener('networkChanged', this.handleNetworkChanged)
        }
    }

    public isAuthorized(): Promise<boolean> {
        const { klaytn } = window
        if (klaytn === undefined) {
            throw new NoKlaytnProviderError()
        }

        return klaytn._kaikas.isEnabled()
    }

}

export default KaikasConnector