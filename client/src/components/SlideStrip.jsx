import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from '../assets/logo.svg';
import arrowUp from '../assets/arrow_up_icon.svg';
import arrowDown from '../assets/arrow_down_icon.svg';
import generateNonInteractiveElement from '../generateNonInteractiveElement';

function SlideStrip(props) {
  const [canMoveUp, setCanMoveUp] = useState(null);
  const [canMoveDown, setCanMoveDown] = useState(null);

  const navigate = useNavigate();

  // Set the up/down slidemove arrow buttons disabled, if first or last is selected
  useEffect(() => {
    if (props.currentSlide === 0) {
      setCanMoveUp(false);
    } else {
      setCanMoveUp(true);
    }

    if (props.currentSlide === props.slides.length - 1) {
      setCanMoveDown(false);
    } else {
      setCanMoveDown(true);
    }
  }, [props.currentSlide, props.slides.length]);

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

  function handleSlideDelete(e) {
    if (e.key === 'Delete') {
      if (props.slides.length > 1) {
        const slidesAfterDelete = structuredClone(props.slides);
        slidesAfterDelete.splice(props.currentSlide, 1);
        if (props.currentSlide === props.slides.length - 1) {
          props.setCurrentSlide(slidesAfterDelete.length - 1);
        }
        props.setSlides(slidesAfterDelete);
        props.setForceReRender(Date.now());
      }
    }
  }

  function handleSlideMove(direction) {
    const slidesAfterMove = structuredClone(props.slides);
    const temp = slidesAfterMove[props.currentSlide];
    slidesAfterMove[props.currentSlide] = slidesAfterMove[props.currentSlide + direction];
    slidesAfterMove[props.currentSlide + direction] = temp;
    props.setCurrentSlide(props.currentSlide + direction);
    props.setSlides(slidesAfterMove);
  }

  return (
    <div className="SlideStrip" onKeyDown={(e) => handleSlideDelete(e)} tabIndex="0">
      <div className="SlidesLogo"><img src={logo} onClick={() => navigate('/present/dashboard')} /></div>
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
      <div onClick={() => handleSlideMove(-1)} className={canMoveUp ? 'SlidesArrowUp' : 'SlidesArrowUp disabled'}><img src={arrowUp}/></div>
      <div onClick={() => handleSlideMove(+1)} className={canMoveDown ? 'SlidesArrowDown' : 'SlidesArrowDown disabled'}><img src={arrowDown}/></div>
    </div>
  )
}

export default SlideStrip;
