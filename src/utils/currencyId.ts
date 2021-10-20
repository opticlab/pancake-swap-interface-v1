import { Currency, ETHER, Token } from '@opticlab/kdex-sdk'

export function currencyId(currency: Currency): string {
  if (currency === ETHER) return 'KLAY'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

export default currencyId
