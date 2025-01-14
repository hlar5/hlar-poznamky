import { useEffect, useState, useMemo } from 'react'
import { Row, Col, Card, Badge, Button, Stack, Form } from 'react-bootstrap'
import { Link, useParams, useNavigate } from 'react-router-dom'
import ReactSelect from 'react-select'
import styles from './NoteList.module.css'
import { Helmet } from 'react-helmet'
import ReactMarkdown from 'react-markdown'

const TITLE = 'Globální Poznámky - Hlar Poznámky'

export function GlobalNotes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])
  const [title, setTitle] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        console.log('Fetching notes...')
        const response = await fetch('http://localhost:5000/api/notes')
        if (!response.ok) {
          throw new Error('Failed to fetch notes')
        }
        const data = await response.json()
        console.log('Fetched notes:', data)
        setNotes(data)
      } catch (err) {
        console.error('Error fetching notes:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [])

  const allTags = useMemo(() => {
    const tags = new Set()
    notes.forEach(note => {
      note.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  }, [notes])

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesTitle = title === "" || note.title.toLowerCase().includes(title.toLowerCase())
      
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every(tag =>
          note.tags.includes(tag)
        )

      return matchesTitle && matchesTags
    })
  }, [title, selectedTags, notes])

  if (loading) {
    return <div>Poznámky se načítají...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="fw-bold">🌍 Globální Poznámky</h2>
        </Col>
      </Row>

      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label className="fw-bold">🔎 Název poznámky</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Hledej poznámku..."
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label className="fw-bold">🏷 Štítky</Form.Label>
              <ReactSelect
                placeholder="Vyberte štítky..."
                value={selectedTags.map(tag => {
                  return { label: tag, value: tag }
                })}
                options={allTags.map(tag => ({
                  label: tag,
                  value: tag,
                }))}
                onChange={tags => {
                  setSelectedTags(
                    tags.map(tag => tag.value)
                  )
                }}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map(note => (
          <Col key={note._id}>
            <NoteCard id={note._id} title={note.title} tags={note.tags || []} />
          </Col>
        ))}
      </Row>
    </>
  )
}

function NoteCard({ id, title, tags }) {
  return (
    <Card
      as={Link}
      to={`/global/${id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100"
        >
          <span className="fs-5">{title}</span>
          {Array.isArray(tags) && tags.length > 0 ? (
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              {tags.map((tag, index) => (
                <Badge key={tag.id || `${tag}-${index}`} className="text-truncate">
                  {tag}
                </Badge>
              ))}
            </Stack>
          ) : (
            <span><Badge className='text-truncate bg-secondary'>Bez štítků</Badge></span>
          )}
        </Stack>
      </Card.Body>
    </Card>
  )
}

export function GlobalNoteView() {
  const { id } = useParams()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/notes/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch note')
        }
        const data = await response.json()
        setNote(data)

        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || []
        const isAlreadyFavorite = storedFavorites.some(favNote => favNote._id === data._id)
        setIsFavorite(isAlreadyFavorite)
      } catch (err) {
        console.error('Error fetching note:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNote()
  }, [id])

  const saveToFavorites = () => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || []
    const isAlreadyFavorite = storedFavorites.some(favNote => favNote._id === note._id)

    if (!isAlreadyFavorite) {
      storedFavorites.push(note)
      localStorage.setItem('favorites', JSON.stringify(storedFavorites))
      setIsFavorite(true)
    }
  }

  const removeFromFavorites = () => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || []
    const updatedFavorites = storedFavorites.filter(favNote => favNote._id !== note._id)

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
    setIsFavorite(false)
  }

  if (loading) {
    return <div>Poznámky se načítají...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!note) {
    return <div>Poznámka nenalezena</div>
  }

  return (
    <>
      <Helmet>
        <title>{note.title} - Globální Poznámky - Hlar Poznámky</title>
      </Helmet>
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="fw-bold">{note.title}</h1>
          {note.tags && note.tags.length > 0 ? (
            <Stack gap={1} direction="horizontal" className="flex-wrap">
              {note.tags.map((tag, index) => (
                <Badge key={tag.id || `${tag}-${index}`} className="text-truncate">
                  {tag}
                </Badge>
              ))}
            </Stack>
          ) : (
            <span><Badge className='text-truncate bg-secondary'>Bez štítků</Badge></span>
          )}
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            {!isFavorite ? (
              <Button variant="outline-danger" className="fw-bold" onClick={saveToFavorites}>
                ❤ Oblíbit
              </Button>
            ) : (
              <Button variant="outline-danger" className="fw-bold" onClick={removeFromFavorites}>
                💔 Odebrat
              </Button>
            )}
            <Link to="/global">
              <Button variant="outline-secondary" className="fw-bold">Zpět</Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      <ReactMarkdown>{note.markdown}</ReactMarkdown>
    </>
  )
}