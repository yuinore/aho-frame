export function downloadText(
  text: string,
  filename: string,
  extension = 'jsx',
): void {
  const name = filename.endsWith(`.${extension}`)
    ? filename
    : `${filename}.${extension}`;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
