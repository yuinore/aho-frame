import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

const BPM_COUNTER_URL = 'http://www.k3.dion.ne.jp/~kidego/2008/bpmcounter.html';
const ROW_COUNT = 512;

function parseNum(value: string, fallback: number): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

function App() {
  const { t, i18n } = useTranslation();
  const [beatInterval, setBeatInterval] = useState(1);
  const [beatOffset, setBeatOffset] = useState(0);
  const [fps, setFps] = useState(30);
  const [bpm, setBpm] = useState(176);
  const [frameOffset, setFrameOffset] = useState(0);

  const rows = useMemo(() => {
    const result: { beat: number; frameInt: string; frameDec: string }[] = [];
    for (let x = 0; x < ROW_COUNT; x++) {
      const beat = x * beatInterval + beatOffset;
      const frame = ((60 * fps) / (bpm || 1)) * beat + frameOffset;
      const frameInt = Math.round(frame * 1) / 1;
      const frameDec = Math.round(frame * 100) / 100;
      result.push({
        beat,
        frameInt: `${frameInt} f`,
        frameDec: `${frameDec} f`,
      });
    }
    return result;
  }, [beatInterval, beatOffset, fps, bpm, frameOffset]);

  return (
    <Container className="py-3">
      <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
        <h1 className="mb-0">{t('title')}</h1>
        <Form.Select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value as 'ja' | 'en')}
          className="w-auto"
          aria-label={t('ariaLanguage')}
        >
          <option value="ja">{t('langJapanese')}</option>
          <option value="en">{t('langEnglish')}</option>
        </Form.Select>
      </div>
      <hr />
      {t('catchphrase')}
      <br />
      <hr />
      {t('toolsPrefix')}{' '}
      <a href={BPM_COUNTER_URL} target="_blank" rel="noopener noreferrer">
        {t('bpmCounterLink')}
      </a>
      <hr />
      <div className="row">
        <div className="col-lg-6">
          <Form className="mb-3">
            <Form.Group as="div" className="mb-2">
              <Form.Label className="me-1">{t('beatFormulaLabel')}</Form.Label>
              <Form.Control
                type="text"
                value={beatInterval}
                onChange={(e) =>
                  setBeatInterval(parseNum(e.target.value, beatInterval))
                }
                className="d-inline-block w-auto me-1"
                style={{ maxWidth: '6em' }}
                aria-label={t('ariaBeatInterval')}
              />
              <span className="me-1">{t('beatFormulaSuffix')}</span>
              <Form.Control
                type="text"
                value={beatOffset}
                onChange={(e) =>
                  setBeatOffset(parseNum(e.target.value, beatOffset))
                }
                className="d-inline-block w-auto me-1"
                style={{ maxWidth: '6em' }}
                aria-label={t('ariaBeatOffset')}
              />
              <span>{t('beatUnit')}</span>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="me-1">{t('fpsLabel')}</Form.Label>
              <Form.Control
                type="text"
                value={fps}
                onChange={(e) => setFps(parseNum(e.target.value, fps))}
                className="d-inline-block w-auto"
                style={{ maxWidth: '6em' }}
                aria-label={t('ariaFps')}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="me-1">{t('bpmLabel')}</Form.Label>
              <Form.Control
                type="text"
                value={bpm}
                onChange={(e) => setBpm(parseNum(e.target.value, bpm))}
                className="d-inline-block w-auto"
                style={{ maxWidth: '6em' }}
                aria-label={t('ariaBpm')}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="me-1">{t('frameOffsetLabel')}</Form.Label>
              <Form.Control
                type="text"
                value={frameOffset}
                onChange={(e) =>
                  setFrameOffset(parseNum(e.target.value, frameOffset))
                }
                className="d-inline-block w-auto"
                style={{ maxWidth: '6em' }}
                aria-label={t('ariaFrameOffset')}
              />
            </Form.Group>
          </Form>
        </div>
        <div className="col-lg-6">
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>{t('tableBeat')}</th>
                <th>{t('tableFrameInt')}</th>
                <th>{t('tableFrame')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.beat}</td>
                  <td>{row.frameInt}</td>
                  <td>{row.frameDec}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Container>
  );
}

export default App;
