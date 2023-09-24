import { useEffect, useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

import alignLeftIcon from '../assets/align_left_icon.svg';
import alignCenterIcon from '../assets/align_center_icon.svg';
import alignRightIcon from '../assets/align_right_icon.svg';
import alignJustifyIcon from '../assets/align_justify_icon.svg';
import sideLeftIcon from '../assets/side_left_icon.svg';
import sideCenterIcon from '../assets/side_center_icon.svg';
import sideRightIcon from '../assets/side_right_icon.svg';

let labelSliderStartingValue = 0;

function ElementSettings({ slides, setSlides, currentSlide, selectedElement }) {
  const [selectedElementObj, setSelectedElementObj] = useState(null);
  const [colorPickerValue, setColorPickerValue] = useState("#000000");

  useEffect(() => {
    if (selectedElement) {
      setSelectedElementObj(slides[currentSlide][parseInt(selectedElement.getAttribute('id').split('e')[1])]);
    }
  }, [slides, currentSlide, selectedElement]);

  function handleChangeElement(e, keyToModify) {
    const updatedSlides = structuredClone(slides);
    updatedSlides[currentSlide][parseInt(selectedElement.getAttribute('id').split('e')[1])][keyToModify] = e.target.value;
    setSlides(updatedSlides);
  }

  function handleLabelSlider(e, elementOnSlideKey) {
    let newValue = Math.round((labelSliderStartingValue - ((e.target.getBoundingClientRect().left - e.clientX) / 5)) * 10) / 10;
    if (newValue > -100) {
      handleChangeElement({ target: { value: newValue } }, elementOnSlideKey);
    }
  }

  function handleLabelSliderStart(elementOnSlideKey) {
    labelSliderStartingValue = slides[currentSlide][parseInt(selectedElement.getAttribute('id').split('e')[1])][elementOnSlideKey];
  }

  // Handle color picker value change
  useEffect(() => {
    if (selectedElement) {
      handleChangeElement({ target: { value: colorPickerValue.split('#')[1] } }, 'c');
    }
  }, [colorPickerValue]);

  // Setting initial value of colorpicker
  useEffect(() => {
    if (selectedElement) {
      setColorPickerValue('#' + slides[currentSlide][parseInt(selectedElement.getAttribute('id').split('e')[1])].c);
    }
  }, [selectedElement]);

  function handleAlignToSide(side) {
    if (side === 'left') {
      handleChangeElement({target: {value: 0}}, 'x');
    } else if (side === 'center') {
      handleChangeElement({target: {value: (100 - selectedElementObj.w) / 2}}, 'x');
    } else if (side === 'right') {
      handleChangeElement({target: {value: 99 - selectedElementObj.w}}, 'x');
    }
  }

  return (
    <div className="ElementSettings">
      {selectedElementObj && (
        <>
          <span>Position</span>
          <div className="settingGroup">
            <label htmlFor="x" onDrag={(e) => handleLabelSlider(e, 'x')} onDragStart={() => handleLabelSliderStart('x')} draggable="true">X</label>
            <input type="number" id="x" value={selectedElementObj.x} onChange={(e) => handleChangeElement(e, 'x')} />
            <label htmlFor="y" onDrag={(e) => handleLabelSlider(e, 'y')} onDragStart={() => handleLabelSliderStart('y')} draggable="true">Y</label>
            <input type="number" id="y" value={selectedElementObj.y} onChange={(e) => handleChangeElement(e, 'y')} />
            <label htmlFor="w" onDrag={(e) => handleLabelSlider(e, 'w')} onDragStart={() => handleLabelSliderStart('w')} draggable="true">W</label>
            <input type="number" id="w" value={selectedElementObj.w} onChange={(e) => handleChangeElement(e, 'w')} /><br />
            <label style={{ cursor: 'auto', marginTop: '1vh', marginBottom: '1vh' }}>Align</label>
            <div className="segmentedControl">
              <label><input type="button" value='left' onClick={() => handleAlignToSide('left')} /><img src={sideLeftIcon} /></label>
              <label><input type="button" value='center' onClick={() => handleAlignToSide('center')} /><img src={sideCenterIcon} /></label>
              <label><input type="button" value='right' onClick={() => handleAlignToSide('right')} /><img src={sideRightIcon} /></label>
            </div>
          </div>
          <span>Font</span>
          <div className="settingGroup">
            <label htmlFor="s" onDrag={(e) => handleLabelSlider(e, 's')} onDragStart={() => handleLabelSliderStart('s')} draggable="true">Size</label>
            <input type="number" id="s" value={selectedElementObj.s} onChange={(e) => handleChangeElement(e, 's')} /><br />

            <label style={{ cursor: 'auto', marginTop: '1vh', marginBottom: '1vh' }}>Align</label>
            <div className="segmentedControl" onChange={(e) => handleChangeElement(e, 'a')}>
              <label><input type="radio" value='left' name='textalign' checked={selectedElementObj.a === 'left' && true} readOnly /><img src={alignLeftIcon} /></label>
              <label><input type="radio" value='center' name='textalign' checked={selectedElementObj.a === 'center' && true} readOnly /><img src={alignCenterIcon} /></label>
              <label><input type="radio" value='right' name='textalign' checked={selectedElementObj.a === 'right' && true} readOnly /><img src={alignRightIcon} /></label>
              <label><input type="radio" value='justify' name='textalign' checked={selectedElementObj.a === 'justify' && true} readOnly /><img src={alignJustifyIcon} /></label>
            </div>
          </div>
          <span>Color</span>
          <div className="settingGroup">
            <HexColorPicker className="colorPicker" color={colorPickerValue} onChange={setColorPickerValue} />
            <label htmlFor="c">HEX</label>
            <HexColorInput id="c" className="colorInput" color={colorPickerValue} onChange={setColorPickerValue} />
          </div>
        </>
      )}
    </div>
  )
}

export default ElementSettings;
