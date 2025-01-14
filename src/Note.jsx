import { Badge, Button, Col, Row, Stack } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { useNote } from "./NoteLayout.jsx"
import ReactMarkdown from "react-markdown"
import { Helmet } from 'react-helmet';

export function Note({ onDelete }) {
  const note = useNote()
  const navigate = useNavigate()

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: note.title,
          markdown: note.markdown,
          tags: note.tags.map(tag => tag.label),  // Assuming tags are objects with labels
        }),
      });

      if (response.ok) {
        alert("Note saved successfully!");
      } else {
        alert("Error saving note!");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Error saving note!");
    }
  }

  return (
    <>
      <Helmet>
        <title>{ note.title } - Moje Poznámky - Hlar Poznámky</title>
      </Helmet>
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="fw-bold">{note.title}</h1>
          {note.tags.length > 0 && (
            <Stack gap={1} direction="horizontal" className="flex-wrap">
              {note.tags.map(tag => (
                <Badge className="text-truncate" key={tag.id}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to={`/${note.id}/edit`}>
              <Button variant="primary" className="fw-bold">Upravit</Button>
            </Link>
            <Button variant="success" onClick={handleSave} className="fw-bold">
            Nahrát
            </Button>
            <Button className="fw-bold"
              onClick={() => {
                onDelete(note.id)
                navigate("/")
              }}
              variant="outline-danger"
            >
              Smazat
            </Button>
            <Link to="/">
              <Button variant="outline-secondary" className="fw-bold">Zpět</Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      <ReactMarkdown>{note.markdown}</ReactMarkdown>
    </>
  )
}