import { Outlet } from 'react-router'
import { ModalProvider } from '../context/modal-provider'

export const ModalAppLayout: React.FC = () => (
  <ModalProvider>
    <Outlet />
  </ModalProvider>
)
