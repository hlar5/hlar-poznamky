import { NoteForm } from "./NoteForm.jsx"
import { Helmet } from 'react-helmet';

const TITLE = 'Nová Poznámka - Hlar Poznámky';

export function NewNote({ onSubmit, onAddTag, availableTags }) {
  return (
    <>
      <Helmet>
        <title>{ TITLE }</title>
      </Helmet>
      <h1 className="mb-4 fw-bold" >📃 Nová Poznámka</h1>
      <NoteForm
        onSubmit={onSubmit}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </>
  )
}