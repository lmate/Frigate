import titleIcon from '../assets/title_icon.svg';
import textIcon from '../assets/text_icon.svg';
import imgIcon from '../assets/img_icon.svg';
import { useEffect } from 'react';

let slidesChangeIsInducedByElementAdding = false;

function ToolBar(props) {

  function handleAddElement(elementType) {
    const modifiedSlides = structuredClone(props.slides);

    /*
    t = type
    v = value
    x = margin-left (%)
    y = margin-top (%)
    w = width (%)
    s = font-size (vh)
    c = color (hex)
    a = text-align
    */

    if (elementType === 'title') {
      modifiedSlides[props.currentSlide].push({t: 'text', v: 'Title', x: 20, y: 20, w: 60, s: 6, c: '000000', a: 'center'});
    } else if (elementType === 'text') {
      modifiedSlides[props.currentSlide].push({t: 'text', v: 'Text', x: 20, y: 20, w: 60, s: 3, c: '000000', a: 'left'});
    }
    props.setSlides(modifiedSlides);
    slidesChangeIsInducedByElementAdding = true;
  }

  // Set the new element the active element
  useEffect(() => {
    if (slidesChangeIsInducedByElementAdding) {
      document.querySelector(`#e${props.slides[props.currentSlide].length - 1}`).click();
      slidesChangeIsInducedByElementAdding = false;
    }
  }, [props.slides, props.currentSlide]);

  return (
    <div className="ToolBar">
      <div onClick={() => handleAddElement('title')}><img src={titleIcon}/></div>
      <div onClick={() => handleAddElement('text')}><img src={textIcon}/></div>
      <div><img src={imgIcon}/></div>
    </div>
  )
}

export default ToolBar;
