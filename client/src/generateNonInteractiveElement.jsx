function generateNonInteractiveElement(element, index) {
  switch (element.t) {
    case 'text':
      return <p key={element.v + index + 'mini'} style={{
        marginLeft: element.x + '%',
        marginTop: element.y + '%',
        width: element.w + '%',
        fontSize: element.s + 'vw',
        color: '#' + element.c,
        textAlign: element.a,
        fontStyle: element.fs,
        fontWeight: element.fw
      }}>{element.v}</p>
    case 'rect':
      return <div
        key={element.t + index + 'mini'}
        style={{
          marginLeft: element.x + '%',
          marginTop: element.y + '%',
          width: element.w + '%',
          height: element.h + '%',
          backgroundColor: '#' + element.c,
          borderRadius: element.r + 'vw'
        }} />
    case 'img':
      return <img
        key={element.t + index + 'mini'}
        src={element.src && `data:image/webp;base64,${element.src}`}
        style={{
          marginLeft: element.x + '%',
          marginTop: element.y + '%',
          width: element.w + '%',
          height: element.h + '%',
          borderRadius: element.r + 'vw',
          transform: `scaleX(${element.fx ? -1 : 1}) scaleY(${element.fy ? -1 : 1})`
        }} />
  }
}

export default generateNonInteractiveElement;