import titleIcon from '../assets/title_icon.svg';
import textIcon from '../assets/text_icon.svg';
import imgIcon from '../assets/img_icon.svg';
import rectIcon from '../assets/rect_icon.svg';
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
    h = height (%)
    s = font-size (vh)
    c = color (hex)
    a = text-align
    fs = font-style
    fw = font-weight
    r = border-radius (vh)
    */

    if (elementType === 'title') {
      modifiedSlides[props.currentSlide].push({t: 'text', v: 'Title', x: 20, y: 20, w: 60, s: 4, c: '000000', a: 'center', fs: '', fw: '700'});
    } else if (elementType === 'text') {
      modifiedSlides[props.currentSlide].push({t: 'text', v: 'Text', x: 20, y: 20, w: 60, s: 1.5, c: '000000', a: 'left', fs: '', fw: '400'});
    } else if (elementType === 'rect') {
      modifiedSlides[props.currentSlide].push({t: 'rect', x: 20, y: 20, w: 60, h: 30, c: '000000', r: 0});
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
      <div onClick={() => handleAddElement('rect')}><img src={rectIcon}/></div>
    </div>
  )
}

export default ToolBar;
