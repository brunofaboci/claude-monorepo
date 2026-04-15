import { Tag } from '../../atoms/Tag'
import { TextLink } from '../../atoms/TextLink'

interface FilterTagListProps {
  tags: string[]
  onRemove: (tag: string) => void
  onClearAll: () => void
}

export function FilterTagList({ tags, onRemove, onClearAll }: FilterTagListProps) {
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <Tag key={tag} label={tag} variant="filter" onRemove={() => onRemove(tag)} />
      ))}
      <TextLink variant="accent" onClick={onClearAll} className="text-xs cursor-pointer">
        Limpar tudo
      </TextLink>
    </div>
  )
}
