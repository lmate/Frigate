function generateElement(element, index) {
  switch (element.type) {
    case 'p':
      return <p key={index} style={{
        position: 'absolute',
        marginLeft: element.x + '%',
        marginTop: element.y + '%',
        width: element.w+'%',
        height: element.h+'%'
      }}>{element.value}</p>
  }
}

function SlideEditor(props) {
  return (
    <div className="SlideEditor">
      <div>
        {props.slides[props.currentSlide].map((element, index) => generateElement(element, index))}
      </div>
    </div>
  )
}

export default SlideEditor;
