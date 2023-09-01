import logo from '../assets/logo.svg';

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

function SlideStrip(props) {

  function handleSelectSlide(selectedIndex) {
    props.setCurrentSlide(selectedIndex);
  }

  return (
    <div className="SlideStrip">
      <div className="SlidesLogo"><img src={logo} /></div>
      {props.slides.map((slide, index) => (
        <div key={index} className={props.currentSlide === index ? 'selectedSlide' : ''} onClick={() => handleSelectSlide(index)}>
          <p>{index + 1}</p>
          <div>
            {props.slides[index].map((element, index) => generateElement(element, index))}
          </div>
        </div>
      ))}
      <div></div>
      <div className='SlidesAdd'><button>+</button></div>
    </div>
  )
}

export default SlideStrip;
