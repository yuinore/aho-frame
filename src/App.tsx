import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { generateJsxScript } from './downloadScript.ts';
import { downloadText } from './downloadText.ts';
import { getDefaultForm, readSettings, writeSettings } from './cookie.ts';
import { formatTimecode } from './formatTimecode.ts';
import { NumericTextInput } from './components/NumericTextInput.tsx';

const BPM_COUNTER_URL = 'https://yuinore.moe/bayes_bpm_counter.html';
const ROW_COUNT = 512;

interface FrameRow {
  beat: number;
  frameInt: string;
  frameDec: string;
  frameIntNum: number;
  timecode: string;
}

function parseNum(value: string, fallback: number): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

function getInitialForm(): {
  lang: 'ja' | 'en';
  beatInterval: number;
  beatOffset: number;
  fps: number;
  bpm: number;
  frameOffset: number;
} {
  try {
    const s = readSettings();
    if (s) {
      return {
        lang: s.lang,
        beatInterval: s.beatInterval,
        beatOffset: s.beatOffset,
        fps: s.fps,
        bpm: s.bpm,
        frameOffset: s.frameOffset,
      };
    }
  } catch {
    console.error('Failed to read settings');
    // use defaults
  }
  return getDefaultForm();
}

function App() {
  const { t, i18n } = useTranslation();
  const initialForm = useMemo(() => getInitialForm(), []);
  const [lang, setLang] = useState(initialForm.lang);
  const [beatIntervalInput, setBeatIntervalInput] = useState(
    String(initialForm.beatInterval),
  );
  const [beatOffsetInput, setBeatOffsetInput] = useState(
    String(initialForm.beatOffset),
  );
  const [fpsInput, setFpsInput] = useState(String(initialForm.fps));
  const [bpmInput, setBpmInput] = useState(String(initialForm.bpm));
  const [frameOffsetInput, setFrameOffsetInput] = useState(
    String(initialForm.frameOffset),
  );
  const beatInterval = parseNum(beatIntervalInput, initialForm.beatInterval);
  const beatOffset = parseNum(beatOffsetInput, initialForm.beatOffset);
  const fps = parseNum(fpsInput, initialForm.fps);
  const bpm = parseNum(bpmInput, initialForm.bpm);
  const frameOffset = parseNum(frameOffsetInput, initialForm.frameOffset);

  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }

  const isFirstWrite = useRef(true);
  useEffect(() => {
    console.log('useEffect[writeSettings]');
    if (isFirstWrite.current) {
      isFirstWrite.current = false;
      return;
    }
    const lang =
      i18n.language === 'ja' || i18n.language === 'en' ? i18n.language : 'ja';
    writeSettings({
      beatInterval,
      beatOffset,
      fps,
      bpm,
      frameOffset,
      lang,
    });
  }, [beatInterval, beatOffset, fps, bpm, frameOffset, i18n.language]);

  const rows = useMemo(() => {
    console.log(
      'useMemo[rows]',
      beatInterval,
      beatOffset,
      fps,
      bpm,
      frameOffset,
    );
    const result: FrameRow[] = [];
    for (let x = 0; x < ROW_COUNT; x++) {
      const beat = x * beatInterval + beatOffset;
      const frame = ((60 * fps) / (bpm || 1)) * beat + frameOffset;
      const frameIntNum = Math.round(frame * 1) / 1;
      const frameDec = Math.round(frame * 100) / 100;
      result.push({
        beat,
        frameInt: `${frameIntNum} f`,
        frameDec: `${frameDec.toFixed(2)} f`,
        frameIntNum,
        timecode: formatTimecode(frameIntNum, fps),
      });
    }
    return result;
  }, [beatInterval, beatOffset, fps, bpm, frameOffset]);

  const handleDownloadScript = () => {
    const frames = rows.map((row) => row.frameIntNum);
    const script = generateJsxScript(frames, fps);
    downloadText(script, 'AddKeyframes', 'jsx');
  };

  const handleChangeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'ja' || e.target.value === 'en') {
      const newLang = e.target.value;
      setLang(newLang);
      i18n.changeLanguage(newLang);
      writeSettings({
        lang: newLang,
        beatInterval,
        beatOffset,
        fps,
        bpm,
        frameOffset,
      });
    }
  };

  console.log('render', beatInterval, beatOffset, fps, bpm, frameOffset);

  return (
    <Container fluid className="py-3 px-3 px-lg-4">
      <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
        <h1 className="mb-0">{t('title')}</h1>
        <Form.Select
          value={lang}
          onChange={handleChangeLanguage}
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
              <NumericTextInput
                value={beatIntervalInput}
                onChange={setBeatIntervalInput}
                className="d-inline-block w-auto me-1"
                style={{ maxWidth: '6em' }}
                aria-label={t('ariaBeatInterval')}
              />
              <span className="me-1">{t('beatFormulaSuffix')}</span>
              <NumericTextInput
                value={beatOffsetInput}
                onChange={setBeatOffsetInput}
                className="d-inline-block w-auto me-1"
                style={{ maxWidth: '6em' }}
                aria-label={t('ariaBeatOffset')}
              />
              <span>{t('beatUnit')}</span>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="me-1">{t('fpsLabel')}</Form.Label>
              <NumericTextInput
                value={fpsInput}
                onChange={setFpsInput}
                className="d-inline-block w-auto"
                style={{ maxWidth: '6em' }}
                aria-label={t('ariaFps')}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="me-1">{t('bpmLabel')}</Form.Label>
              <NumericTextInput
                value={bpmInput}
                onChange={setBpmInput}
                className="d-inline-block w-auto"
                style={{ maxWidth: '6em' }}
                aria-label={t('ariaBpm')}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="me-1">{t('frameOffsetLabel')}</Form.Label>
              <NumericTextInput
                value={frameOffsetInput}
                onChange={setFrameOffsetInput}
                className="d-inline-block w-auto"
                style={{ maxWidth: '6em' }}
                aria-label={t('ariaFrameOffset')}
              />
            </Form.Group>
            <Button
              variant="secondary"
              className="mt-3"
              onClick={handleDownloadScript}
            >
              {t('downloadScript')}
            </Button>
          </Form>
        </div>
        <div className="col-lg-6">
          <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr>
                <th>{t('tableBeat')}</th>
                <th>{t('tableFrameInt')}</th>
                <th>{t('tableFrame')}</th>
                <th>{t('tableTimecode')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.beat}</td>
                  <td>{row.frameInt}</td>
                  <td>{row.frameDec}</td>
                  <td>{row.timecode}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      <footer className="mt-1 pt-3 text-muted small text-center">
        Directed & Built by yuinore / See GitHub →{' '}
        <a
          href="https://github.com/yuinore/aho-frame"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/yuinore/aho-frame
        </a>
      </footer>
    </Container>
  );
}

export default App;
