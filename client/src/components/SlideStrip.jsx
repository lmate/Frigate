import logo from '../assets/logo.svg';

function generateElement(element, index) {
  switch (element.t) {
    case 'text':
      return <p key={element.v + index + 'mini'} style={{
        marginLeft: element.x + '%',
        marginTop: element.y + '%',
        width: element.w + '%',
        fontSize: element.s + 'vh',
        color: '#' + element.c,
        textAlign: element.a,
        fontStyle: element.fs,
        fontWeight: element.fw
      }}>{element.v}</p>
    case 'rect':
      return <div
        key={element.v + index + 'mini'}
        style={{
          marginLeft: element.x + '%',
          marginTop: element.y + '%',
          width: element.w + '%',
          height: element.h + '%',
          backgroundColor: '#' + element.c,
        }} />
  }
}

function SlideStrip(props) {

  function handleSelectSlide(selectedIndex) {
    props.setCurrentSlide(selectedIndex);
  }

  function handleAddNewSlide() {
    const updatedSlides = structuredClone(props.slides);
    updatedSlides.push([]);
    props.setSlides(updatedSlides);
    props.setCurrentSlide(updatedSlides.length - 1);
    document.querySelector('.SlidesBottom').scrollIntoView({ behavior: "smooth" });
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
      <div className='SlidesBottom'></div>
      <div className='SlidesAdd'><button onClick={handleAddNewSlide}>+</button></div>
    </div>
  )
}

export default SlideStrip;
