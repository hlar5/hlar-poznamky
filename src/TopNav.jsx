import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export function TopNav() {
  return (
    <Navbar bg="primary" expand="lg" className="p-3 mb-5 rounded-5">
      <Container>
        <Navbar.Toggle aria-controls="navbar-nav" className="mb-3 mt-3" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-3 gap-4">
            <Nav.Item>
              <Nav.Link as={Link} to="/" className="text-light fw-bold" style={{ fontSize: '19px' }}>📑 Moje Poznámky</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/global" className="text-light fw-bold" style={{ fontSize: '19px' }}>🌍 Globální Poznámky</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/favorite" className="text-light fw-bold" style={{ fontSize: '19px' }}>❤ Oblíbené Poznámky</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/contact" className="text-light fw-bold" style={{ fontSize: '19px' }}>📞 Kontakt</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Brand href="/" className="fw-bold text-light ms-3 mt-3 mb-3" style={{ fontSize: '25px' }}>🎈 Hlar Poznámky</Navbar.Brand>
      </Container>
    </Navbar>
  );
}
