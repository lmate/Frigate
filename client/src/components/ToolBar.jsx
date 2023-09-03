import titleIcon from '../assets/title_icon.svg';
import textIcon from '../assets/text_icon.svg';
import imgIcon from '../assets/img_icon.svg';
import { useEffect } from 'react';

let slidesChangeIsInducedByElementAdding = false;

function ToolBar(props) {

  function handleAddElement(elementType) {
    const modifiedSlides = structuredClone(props.slides);

    if (elementType === 'text') {
      modifiedSlides[props.currentSlide].push({type: 'text', value: '', x: 10, y: 20, w: 80});
      props.setSlides(modifiedSlides);
      slidesChangeIsInducedByElementAdding = true;
    }
  }

  // Set the new element the active element
  useEffect(() => {
    if (slidesChangeIsInducedByElementAdding) {
      document.querySelector('.SlideEditor > div').click();
      document.querySelector(`#e${props.slides[props.currentSlide].length - 1}`).click();
      document.querySelector(`#e${props.slides[props.currentSlide].length - 1}`).focus();
      slidesChangeIsInducedByElementAdding = false;
    }
  }, [props.slides]);

  return (
    <div className="ToolBar">
      <div onClick={() => handleAddElement('text')}><img src={titleIcon}/></div>
      <div><img src={textIcon}/></div>
      <div><img src={imgIcon}/></div>
    </div>
  )
}

export default ToolBar;
