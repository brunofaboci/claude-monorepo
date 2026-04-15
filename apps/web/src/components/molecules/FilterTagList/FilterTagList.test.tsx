import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterTagList } from './FilterTagList'

describe('FilterTagList', () => {
  it('renders nothing when tags are empty', () => {
    const { container } = render(
      <FilterTagList tags={[]} onRemove={() => {}} onClearAll={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders all tags', () => {
    render(<FilterTagList tags={['React', 'CSS']} onRemove={() => {}} onClearAll={() => {}} />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('CSS')).toBeInTheDocument()
  })

  it('calls onRemove with correct tag', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<FilterTagList tags={['React']} onRemove={onRemove} onClearAll={() => {}} />)
    await user.click(screen.getByRole('button', { name: /remover filtro react/i }))
    expect(onRemove).toHaveBeenCalledWith('React')
  })

  it('calls onClearAll when Limpar tudo clicked', async () => {
    const user = userEvent.setup()
    const onClearAll = vi.fn()
    render(<FilterTagList tags={['React']} onRemove={() => {}} onClearAll={onClearAll} />)
    await user.click(screen.getByText('Limpar tudo'))
    expect(onClearAll).toHaveBeenCalledTimes(1)
  })
})
