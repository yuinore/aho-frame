import { useMemo, useState } from 'react';
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
      <h1>アホフレーム</h1>
      <hr />
      フレーム数は電卓で計算するの！ 私・・・、アホだから！
      <br />
      <hr />
      便利ツール →{' '}
      <a href={BPM_COUNTER_URL} target="_blank" rel="noopener noreferrer">
        BPM計測器
      </a>
      <hr />
      <div className="row">
        <div className="col-lg-6">
          <Form className="mb-3">
            <Form.Group as="div" className="mb-2">
              <Form.Label className="me-1">拍数 =</Form.Label>
              <Form.Control
                type="text"
                value={beatInterval}
                onChange={(e) =>
                  setBeatInterval(parseNum(e.target.value, beatInterval))
                }
                className="d-inline-block w-auto me-1"
                style={{ maxWidth: '6em' }}
                aria-label="拍間隔"
              />
              <span className="me-1">* n +</span>
              <Form.Control
                type="text"
                value={beatOffset}
                onChange={(e) =>
                  setBeatOffset(parseNum(e.target.value, beatOffset))
                }
                className="d-inline-block w-auto me-1"
                style={{ maxWidth: '6em' }}
                aria-label="拍オフセット"
              />
              <span>拍</span>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="me-1">FPS =</Form.Label>
              <Form.Control
                type="text"
                value={fps}
                onChange={(e) => setFps(parseNum(e.target.value, fps))}
                className="d-inline-block w-auto"
                style={{ maxWidth: '6em' }}
                aria-label="FPS"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="me-1">BPM =</Form.Label>
              <Form.Control
                type="text"
                value={bpm}
                onChange={(e) => setBpm(parseNum(e.target.value, bpm))}
                className="d-inline-block w-auto"
                style={{ maxWidth: '6em' }}
                aria-label="BPM"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="me-1">フレームオフセット =</Form.Label>
              <Form.Control
                type="text"
                value={frameOffset}
                onChange={(e) =>
                  setFrameOffset(parseNum(e.target.value, frameOffset))
                }
                className="d-inline-block w-auto"
                style={{ maxWidth: '6em' }}
                aria-label="フレームオフセット"
              />
            </Form.Group>
          </Form>
        </div>
        <div className="col-lg-6">
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>拍</th>
                <th>整数フレーム</th>
                <th>フレーム</th>
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
