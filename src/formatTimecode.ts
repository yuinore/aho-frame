export function formatTimecode(totalFrames: number, fps: number): string {
  const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, '0');
  const totalSeconds = Math.floor(totalFrames / fps);
  const framePart = Math.round(totalFrames - totalSeconds * fps);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(framePart)}`;
}
