import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import RegisterModal from './RegisterModal'
import { useAuthModal } from '@/store/useAuthModalStore'

// Mock the store
vi.mock('@/store/useAuthModalStore', () => ({
  useAuthModal: vi.fn(),
}))

describe('RegisterModal', () => {
  it('should render the Airbnb-style welcome message', () => {
    (useAuthModal as any).mockReturnValue({
      isRegisterOpen: true,
      closeRegister: vi.fn(),
    })

    render(<RegisterModal />)

    expect(screen.getByText('Selamat datang di GoFishi')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Nama sesuai identitas')).toBeInTheDocument()
  })

  it('should have a "Setuju dan Lanjutkan" button', () => {
    (useAuthModal as any).mockReturnValue({
      isRegisterOpen: true,
      closeRegister: vi.fn(),
    })

    render(<RegisterModal />)

    const button = screen.getByText('Setuju dan Lanjutkan', { selector: 'button' })
    expect(button).toBeInTheDocument()
  })
})
