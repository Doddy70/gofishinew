import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LoginModal from './LoginModal'
import { useAuthModal } from '@/store/useAuthModalStore'

// Mock the store
vi.mock('@/store/useAuthModalStore', () => ({
  useAuthModal: vi.fn(),
}))

describe('LoginModal', () => {
  it('should render the Airbnb-style welcome message', () => {
    (useAuthModal as any).mockReturnValue({
      isLoginOpen: true,
      closeLogin: vi.fn(),
    })

    render(<LoginModal />)

    expect(screen.getByText('Selamat datang di GoFishi')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('name@email.com')).toBeInTheDocument()
  })

  it('should have a "Lanjutkan" button', () => {
    (useAuthModal as any).mockReturnValue({
      isLoginOpen: true,
      closeLogin: vi.fn(),
    })

    render(<LoginModal />)
    const button = screen.getByText('Lanjutkan', { selector: 'button' })
    expect(button).toBeInTheDocument()
  })
})
