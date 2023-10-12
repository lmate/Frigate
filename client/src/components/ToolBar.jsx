import { useEffect, useRef } from 'react';

import titleIcon from '../assets/title_icon.svg';
import textIcon from '../assets/text_icon.svg';
import imgIcon from '../assets/img_icon.svg';
import rectIcon from '../assets/rect_icon.svg';

let slidesChangeIsInducedByElementAdding = false;

function ToolBar(props) {

  const fileInput = useRef(null);

  function handleAddElement(elementType, elementData) {
    const modifiedSlides = structuredClone(props.slides);
    const newZIndex = modifiedSlides[props.currentSlide].length + 1;

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
    src = Base64 image data
    fx = flip on x axis (bool)
    fy = flip on y axis (bool)
    z = z-index
    */

    if (elementType === 'title') {
      modifiedSlides[props.currentSlide].push({ t: 'text', v: 'Title', x: 20, y: 20, w: 60, s: 4, c: '000000', a: 'center', fs: '', fw: '700', z: newZIndex });
    } else if (elementType === 'text') {
      modifiedSlides[props.currentSlide].push({ t: 'text', v: 'Text', x: 20, y: 20, w: 60, s: 1.5, c: '000000', a: 'left', fs: '', fw: '400', z: newZIndex });
    } else if (elementType === 'rect') {
      modifiedSlides[props.currentSlide].push({ t: 'rect', x: 20, y: 20, w: 60, h: 30, c: '000000', r: 0, z: newZIndex });
    } else if (elementType === 'img') {
      modifiedSlides[props.currentSlide].push({ t: 'img', x: 35, y: 20, w: 30, h: 30, r: 0, src: elementData, fx: false, fy: false, z: newZIndex });
    }

    const totalSizeInMB = new Blob([JSON.stringify(modifiedSlides)]).size / 1024 / 1024;
    if (totalSizeInMB < 15) {
      props.setSlides(modifiedSlides);
      slidesChangeIsInducedByElementAdding = true;
    } else {
      alert('You have reached the max size of a presentation');
    }
  }

  function handleAddImage(e) {
    const fileReader = new FileReader();
    if (e.target.files[0]) {
      fileReader.readAsDataURL(e.target.files[0]);
    }

    fileReader.onload = async () => {
      const response = await fetch(`/api/user/${localStorage.getItem('id')}/presentation/${props.presentationid}/image`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-access-token': localStorage.getItem('token') }, body: JSON.stringify({data: fileReader.result}) });
      const img = await response.json();
      handleAddElement('img', img.src);
    };

    fileReader.onerror = (error) => {
      console.log(error);
    };
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
      <div onClick={() => handleAddElement('title')}><img src={titleIcon} /></div>
      <div onClick={() => handleAddElement('text')}><img src={textIcon} /></div>
      <div onClick={() => fileInput.current.click()}><img src={imgIcon} /></div>
      <input type='file' ref={fileInput} style={{ display: 'none' }} onChange={handleAddImage} accept=".jpeg, .jpg, .png, .webp, .gif, .avif, .tiff, .tif, .svg" />
      <div onClick={() => handleAddElement('rect')}><img src={rectIcon} /></div>
    </div>
  )
}

export default ToolBar;
