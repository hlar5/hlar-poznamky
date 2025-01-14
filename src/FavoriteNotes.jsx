import { useState, useEffect, useMemo } from 'react'
import { Row, Col, Card, Badge, Button, Stack, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import styles from './NoteList.module.css'
import { Helmet } from 'react-helmet'
import ReactSelect from 'react-select'

const TITLE = 'Oblíbené Poznámky - Hlar Poznámky'

export function FavoriteNotes() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])
  const [title, setTitle] = useState("")

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || []
    setFavorites(storedFavorites)
    setLoading(false)
  }, [])

  const allTags = useMemo(() => {
    const tags = new Set()
    favorites.forEach(note => {
      note.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  }, [favorites])

  const filteredFavorites = useMemo(() => {
    return favorites.filter(note => {
      const matchesTitle = title === "" || note.title.toLowerCase().includes(title.toLowerCase())

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every(tag =>
          note.tags.includes(tag)
        )

      return matchesTitle && matchesTags
    })
  }, [title, selectedTags, favorites])

  if (loading) {
    return <div>Loading favorites...</div>
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
          <h2 className="fw-bold">❤ Oblíbené Poznámky</h2>
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
        {filteredFavorites.map(note => (
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
      className={`h-100 text-reset text-decoration-none ${styles.card}`}>
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100">
          <span className="fs-5">{title}</span>
          {Array.isArray(tags) && tags.length > 0 ? (
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap">
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