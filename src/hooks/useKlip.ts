import { useContext, useCallback } from 'react'
import { KlipModalContext } from '@sixnetwork/klaytn-use-wallet'

const useKlip = () => {
    const { setShowModal } = useContext(KlipModalContext())
    const showModal = useCallback(() => setShowModal(true), [setShowModal])
    const closeModal = useCallback(() => setShowModal(false), [setShowModal])

  return { showModal, closeModal }
}

export default useKlip