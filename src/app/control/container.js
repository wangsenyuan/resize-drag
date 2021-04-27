

export function Container({state}) {
  let {controls, properties} = state
  let {x1, y1, x2, y2} = properties
  let {top, left, right, bottom} = getRect(x1, y1, x2, y2)

  return <div style={{top, left, right, bottom}}>
    {controls}
  </div>
}