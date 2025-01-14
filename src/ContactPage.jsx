import { Helmet } from 'react-helmet';
import { Card, Stack } from 'react-bootstrap';
import styles from './NoteList.module.css';

const TITLE = 'Kontakt - Hlar Poznámky';

export function ContactPage() {
  const handleCardClick = () => {
    window.location.href = 'mailto:hlavsarobert9@gmail.com';
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <h1 className="mb-5 fw-bold">📞 Kontakt</h1>
      <div className={`${styles.pageContainer}`}>
        <Card
          className={`w-50 text-reset text-decoration-none ${styles.card}`}
          onClick={handleCardClick}
          style={{ cursor: 'pointer' }}
        >
          <Card.Body>
            <Stack gap={2} className="align-items-center justify-content-center">
              <h4>Robert Hlavsa</h4>
              <ul>
                <li><b>Telefon: </b>+421 723 451 170</li>
                <li><b>Email: </b><a href="mailto:hlavsarobert9@gmail.com">hlavsarobert9@gmail.com</a></li>
              </ul>
            </Stack>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
