import { apiClient } from '@shared/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

/** Proxy требует Bearer-заголовок: получаем Blob клиентом API, URL живёт только в UI. */
export const PictureImage: React.FC<{ pictureId: string; alt: string; className?: string }> = ({
  pictureId,
  alt,
  className,
}) => {
  const query = useQuery({
    queryKey: ['picture-content', pictureId],
    queryFn: ({ signal }) =>
      apiClient.get(`pictures/${encodeURIComponent(pictureId)}/content`, { signal }).blob(),
    staleTime: 300_000,
  })
  const [image, setImage] = useState<{ blob: Blob; url: string } | null>(null)
  useEffect(() => {
    if (!query.data) {
      return
    }
    const url = URL.createObjectURL(query.data)
    setImage({ blob: query.data, url })
    return () => URL.revokeObjectURL(url)
  }, [query.data])
  if (!image || image.blob !== query.data) {
    return (
      <span
        className={className}
        role="img"
        aria-label={query.isError ? 'Не удалось загрузить изображение' : 'Загрузка изображения'}
      />
    )
  }
  return <img className={className} src={image.url} alt={alt} />
}
