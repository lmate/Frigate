import { useNavigate } from "react-router-dom";

import logo from '../assets/logo.svg';
import generateNonInteractiveElement from '../generateNonInteractiveElement';

function SlideStrip(props) {

  const navigate = useNavigate();

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
      <div className="SlidesLogo"><img src={logo} onClick={() => navigate('/dashboard')} /></div>
      {props.slides.map((slide, index) => (
        <div key={index} className={props.currentSlide === index ? 'selectedSlide' : ''} onClick={() => handleSelectSlide(index)}>
          <p>{index + 1}</p>
          <div style={props.presentationOptions}>
            {props.slides[index].map((element, index) => generateNonInteractiveElement(element, index))}
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
