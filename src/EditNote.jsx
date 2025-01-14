import { NoteForm } from "./NoteForm.jsx"
import { useNote } from "./NoteLayout.jsx"
import { Helmet } from 'react-helmet';

export function EditNote({ onSubmit, onAddTag, availableTags }) {
  const note = useNote()
  return (
    <>
      <Helmet>
        <title> Úprava "{ note.title }" - Hlar Poznámky</title>
      </Helmet>
      <h1 className="mb-4 fw-bold">Úprava Poznámky</h1>
      <NoteForm
        title={note.title}
        markdown={note.markdown}
        tags={note.tags}
        onSubmit={data => onSubmit(note.id, data)}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </>
  )
}