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
  }
}

export default generateNonInteractiveElement;