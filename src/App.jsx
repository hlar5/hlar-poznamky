import "bootstrap/dist/css/bootstrap.min.css"
import { useMemo } from "react"
import { Container } from "react-bootstrap"
import { Routes, Route, Navigate } from "react-router-dom"
import { NewNote } from "./NewNote.jsx"
import { useLocalStorage } from "./useLocalStorage.js"
import { v4 as uuidV4 } from "uuid"
import { NoteList } from "./NoteList.jsx"
import { NoteLayout } from "./NoteLayout.jsx"
import { Note } from "./Note.jsx"
import { EditNote } from "./EditNote.jsx"
import { GlobalNotes, GlobalNoteView } from "./GlobalNotes.jsx"
import { FavoriteNotes } from "./FavoriteNotes.jsx"
import { TopNav } from "./TopNav.jsx"
import { ContactPage } from "./ContactPage.jsx"

function App() {
  const [notes, setNotes] = useLocalStorage("NOTES", [])
  const [tags, setTags] = useLocalStorage("TAGS", [])

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
    })
  }, [notes, tags])

  function onCreateNote({ tags, ...data }) {
    setNotes(prevNotes => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) },
      ]
    })
  }

  function onUpdateNote(id, { tags, ...data }) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map(tag => tag.id) }
        } else {
          return note
        }
      })
    })
  }

  function onDeleteNote(id) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  }

  function addTag(tag) {
    setTags(prev => [...prev, tag])
  }

  function updateTag(id, label) {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.id === id) {
          return { ...tag, label }
        } else {
          return tag
        }
      })
    })
  }

  function deleteTag(id) {
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id)
    })
  }

  return (
    <Container className="my-4">
      <TopNav />
      <Routes>
        <Route
          path="/hlar-poznamky/"
          element={
            <NoteList
              notes={notesWithTags}
              availableTags={tags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />
          }
        />
        <Route
          path="/hlar-poznamky/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/hlar-poznamky/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route
            path="/hlar-poznamky/edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="/hlar-poznamky/global" element={<GlobalNotes />}></Route>
        <Route path="/hlar-poznamky/global/:id" element={<GlobalNoteView />} />
        <Route path="/hlar-poznamky/favorite" element={<FavoriteNotes />}></Route>
        <Route path="/hlar-poznamky/contact" element={<ContactPage />}></Route>
        <Route path="*" element={<Navigate to="/hlar-poznamky/" />} />
      </Routes>
    </Container>
  )
}

export default App