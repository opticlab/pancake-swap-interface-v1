import { Currency, ETHER, Token } from '@opticlab/kdex-sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
import CoinLogo from '../pancake/CoinLogo'

const getTokenLogoURL = (symbol: string | undefined) =>
  symbol ? [`https://s.klayswap.com/img/token/ic-${symbol.toLowerCase()}.svg`, `https://s.klayswap.com/img/token/ic-${symbol.toLowerCase()}.png`] : ['/images/coins/token.png']

const StyledBnbLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, `/images/coins/${currency?.address ?? 'token'}.png`, ...getTokenLogoURL(currency.symbol)]
      }

      return [`/images/coins/${currency?.address ?? 'token'}.png`, ...getTokenLogoURL(currency.symbol)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === ETHER) {
    return <StyledBnbLogo src="/images/coins/klay.svg" size={size} style={style} />
  }

  return (currency as any)?.symbol ? (
    <CoinLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  ) : (
    <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  )
}
