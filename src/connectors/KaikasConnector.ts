import { AbstractConnectorArguments, ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import warning from 'tiny-warning'

import { SendReturnResult, SendReturn, Send, SendOld } from './types'

function parseSendReturn(sendReturn: SendReturnResult | SendReturn): any {
    // eslint-disable-next-line no-prototype-builtins
    return sendReturn.hasOwnProperty('result') ? sendReturn.result : sendReturn
  }

export class NoKlaytnProviderError extends Error {
    public constructor() {
        super()
        this.name = this.constructor.name
        this.message = 'No Klaytn provider was found on window.klaytn.'
    }
}

export class UserRejectedRequestError extends Error {
    public constructor() {
        super()
        this.name = this.constructor.name
        this.message = 'The user rejected the request.'
    }
}

export class KaikasConnector extends AbstractConnector {
    constructor(kwargs: AbstractConnectorArguments) {
        super(kwargs)
    
        this.handleNetworkChanged = this.handleNetworkChanged.bind(this)
        this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    }

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
        if (!window.klaytn) {
            throw new NoKlaytnProviderError()
        }

        if (window.klaytn.on) {
            window.klaytn.on('accountsChanged', this.handleAccountsChanged)
            window.klaytn.on('networkChanged', this.handleNetworkChanged)
        }

        if ((window.klaytn as any).isKaikas) {
            (window.klaytn as any).autoRefreshOnNetworkChange = false
        }

        let account
        try {
            account = await window.klaytn.enable().then(sendReturn => sendReturn && parseSendReturn(sendReturn)[0])
        } catch (error) {
            if ((error as any).code === 4001) {
                throw new UserRejectedRequestError()
            }
            warning(false, 'eth_requestAccounts was unsuccessful, falling back to enable')
        }

        return { provider: window.klaytn, ...(account ? { account } : {}) }
    }

    public async getProvider(): Promise<any> {
        return window.klaytn
    }

    public async getChainId(): Promise<number | string> {
        if (!window.klaytn) {
            throw new NoKlaytnProviderError()
        }

        let chainId
        try {
            chainId = await (window.klaytn.send as Send)('klay_chainId').then(parseSendReturn)
        } catch {
            warning(false, 'klay_chainId was unsuccessful, falling back to net_version')
        }
    
        if (!chainId) {
            chainId =
                (window.klaytn as any).chainId ||
                (window.klaytn as any).netVersion ||
                (window.klaytn as any).networkVersion ||
                (window.klaytn as any)._chainId
        }
    
        return chainId
    }

    public async getAccount(): Promise<string | null> {
        if (!window.klaytn) {
            throw new NoKlaytnProviderError()
        }

        let account
        try {
            account = await(window.klaytn.send as Send)('klay_accounts').then((sendReturn) => parseSendReturn(sendReturn)[0])
        } catch {
            warning(false, 'klay_accounts was unsuccessful, falling back to enable')
        }

        if (!account) {
            try {
                account = await window.klaytn.enable().then((sendReturn) => parseSendReturn(sendReturn)[0])
            } catch {
                warning(false, 'enable was unsuccessful, falling back to klay_accounts v2')
            }
        }

        if (!account) {
            account = parseSendReturn((window.klaytn.send as SendOld)({ method: 'klay_accounts' }))[0]
        }

        return account
    }

    public deactivate(): void {
        if (window.klaytn && window.klaytn.removeListener) {
            window.klaytn.removeListener('accountsChanged', this.handleAccountsChanged)
            window.klaytn.removeListener('networkChanged', this.handleNetworkChanged)
        }
    }

    public async isAuthorized(): Promise<boolean> {
        if (!window.klaytn) {
            throw new NoKlaytnProviderError()
        }

        try {
            return await (window.klaytn.send as Send)('klay_accounts').then(sendReturn => {
                return parseSendReturn(sendReturn).length > 0
            })
        } catch {
            return false
        }
    }

}

export default KaikasConnector