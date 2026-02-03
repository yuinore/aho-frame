// After Effects JSX Script template
export const ADD_KEYFRAMES_SCRIPT = `// ✓ Add Keyframes
app.beginUndoGroup("Add Keyframes");

function main() {
  var comp = app.project.activeItem;
  if (!(comp instanceof CompItem)) {
    alert("コンポジションを選択してください");
    app.endUndoGroup();
    return;
  }

  var props = comp.selectedProperties;
  if (props.length === 0) {
    alert("プロパティを選択してください");
    app.endUndoGroup();
    return;
  }

  var times = <TIMES_ARRAY>; // seconds
  var fps = <FPS>;

  for (var i = 0; i < props.length; i++) {
    var p = props[i];

    if (p instanceof Property && p.canVaryOverTime) {
      var v = 0;

      for (var t = 0; t < times.length; t++) {
        p.setValueAtTime(times[t] / fps, v);
      }
    }
  }
}

main();

app.endUndoGroup();
`;

export function generateJsxScript(frames: number[], fps: number): string {
  const script = ADD_KEYFRAMES_SCRIPT.replace(
    '<TIMES_ARRAY>',
    JSON.stringify(frames),
  ).replace('<FPS>', String(fps));
  return script;
}
