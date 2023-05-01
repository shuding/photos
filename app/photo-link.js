import Link from 'next/link'

export function PhotoLink({ id }) {
  return (
    <Link
      href={`/${id}`}
      className='px-1.5 text-slate-700 hover:text-blue-600 tracking-tight'
    >
      Photo {id}
    </Link>
  )
}
