import { useEffect, useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

import alignLeftIcon from '../assets/align_left_icon.svg';
import alignCenterIcon from '../assets/align_center_icon.svg';
import alignRightIcon from '../assets/align_right_icon.svg';
import alignJustifyIcon from '../assets/align_justify_icon.svg';
import sideLeftIcon from '../assets/side_left_icon.svg';
import sideCenterIcon from '../assets/side_center_icon.svg';
import sideRightIcon from '../assets/side_right_icon.svg';
import styleNormalIcon from '../assets/style_normal_icon.svg';
import styleItalicIcon from '../assets/style_italic_icon.svg';
import flipHorizontalIcon from '../assets/flip_horizontal_icon.svg';
import flipVerticalIcon from '../assets/flip_vertical_icon.svg';
import arrowUpIcon from '../assets/arrow_up_icon.svg';
import arrowDownIcon from '../assets/arrow_down_icon.svg';

let labelSliderStartingValue = 0;

function ElementSettings({ slides, setSlides, currentSlide, selectedElement, presentationOptions, setPresentationOptions }) {
  const [selectedElementObj, setSelectedElementObj] = useState(null);
  const [colorPickerValue, setColorPickerValue] = useState("#000000");
  const [bgColorPickerValue, setBgColorPickerValue] = useState("#ffffff");

  useEffect(() => {
    if (selectedElement) {
      setSelectedElementObj(slides[currentSlide][parseInt(selectedElement.getAttribute('id').split('e')[1])]);
    } else {
      setSelectedElementObj(null);
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
      // radius value cant go below 0
      if (elementOnSlideKey === 'r' && newValue < 0) { newValue = 0 }

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
    } else {
      setPresentationOptions({ ...presentationOptions, backgroundColor: bgColorPickerValue });
    }
  }, [colorPickerValue, bgColorPickerValue]);

  // Setting initial value of colorpicker
  useEffect(() => {
    if (selectedElement) {
      setColorPickerValue('#' + slides[currentSlide][parseInt(selectedElement.getAttribute('id').split('e')[1])].c);
    } else {
      setBgColorPickerValue(presentationOptions.backgroundColor);
    }
  }, [selectedElement]);

  function handleAlignToSide(side) {
    if (side === 'left') {
      handleChangeElement({ target: { value: 0 } }, 'x');
    } else if (side === 'center') {
      handleChangeElement({ target: { value: Math.round(((100 - selectedElementObj.w) / 2) * 10) / 10 } }, 'x');
    } else if (side === 'right') {
      handleChangeElement({ target: { value: Math.round((99 - selectedElementObj.w) * 10) / 10 } }, 'x');
    }
  }

  function handleFlip(axis) {
    if (axis === 'horizontal') {
      handleChangeElement({ target: { value: !selectedElementObj.fx } }, 'fx');
    } else if (axis === 'vertical') {
      handleChangeElement({ target: { value: !selectedElementObj.fy } }, 'fy');
    }
  }

  function handleControlZIndex(direction) {
    if (direction === 'up') {
      if (slides[currentSlide].length > parseInt(selectedElementObj.z)) {
        handleChangeElement({ target: { value: parseInt(selectedElementObj.z) + 1 } }, 'z');
      }
    } else if (direction === 'down') {
      if (parseInt(selectedElementObj.z) > 0) {
        handleChangeElement({ target: { value: parseInt(selectedElementObj.z) - 1 } }, 'z');
      }
    }
  }

  return (
    <div className="ElementSettings">
      {!selectedElementObj && (
        <>
          <span>Color</span>
          <div className="settingGroup">
            <HexColorPicker className="colorPicker" color={bgColorPickerValue} onChange={setBgColorPickerValue} />
            <label htmlFor="bgc">HEX</label>
            <HexColorInput id="bgc" className="colorInput" color={bgColorPickerValue} onChange={setBgColorPickerValue} />
          </div>
        </>
      )}
      {selectedElementObj && (
        <>
          {(selectedElementObj.t === 'title' || selectedElementObj.t === 'text') && (
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
                </div><br/>
                <label style={{ cursor: 'auto', marginTop: '1vh', marginBottom: '1vh' }}>Depth</label>
                <div className="segmentedControl">
                  <label><input type="button" value='up' onClick={() => handleControlZIndex('up')} /><img src={arrowUpIcon} /></label>
                  <label><input type="button" value='down' onClick={() => handleControlZIndex('down')} /><img src={arrowDownIcon} /></label>
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
                </div><br />

                <label>Weight</label>
                <select onChange={(e) => handleChangeElement(e, 'fw')} value={selectedElementObj.fw}>
                  {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select><br />

                <label style={{ cursor: 'auto', marginTop: '1vh', marginBottom: '1vh' }}>Style</label>
                <div className="segmentedControl" onChange={(e) => handleChangeElement(e, 'fs')}>
                  <label><input type="radio" value='' name='textstyle' checked={selectedElementObj.fs === '' && true} readOnly /><img src={styleNormalIcon} /></label>
                  <label><input type="radio" value='italic' name='textstyle' checked={selectedElementObj.fs === 'italic' && true} readOnly /><img src={styleItalicIcon} /></label>
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
          {selectedElementObj.t === 'rect' && (
            <>
              <span>Position</span>
              <div className="settingGroup">
                <label htmlFor="x" onDrag={(e) => handleLabelSlider(e, 'x')} onDragStart={() => handleLabelSliderStart('x')} draggable="true">X</label>
                <input type="number" id="x" value={selectedElementObj.x} onChange={(e) => handleChangeElement(e, 'x')} />
                <label htmlFor="y" onDrag={(e) => handleLabelSlider(e, 'y')} onDragStart={() => handleLabelSliderStart('y')} draggable="true">Y</label>
                <input type="number" id="y" value={selectedElementObj.y} onChange={(e) => handleChangeElement(e, 'y')} />
                <label htmlFor="w" onDrag={(e) => handleLabelSlider(e, 'w')} onDragStart={() => handleLabelSliderStart('w')} draggable="true">W</label>
                <input type="number" id="w" value={selectedElementObj.w} onChange={(e) => handleChangeElement(e, 'w')} />
                <label htmlFor="h" onDrag={(e) => handleLabelSlider(e, 'h')} onDragStart={() => handleLabelSliderStart('h')} draggable="true">H</label>
                <input type="number" id="h" value={selectedElementObj.h} onChange={(e) => handleChangeElement(e, 'h')} /><br />
                <label style={{ cursor: 'auto', marginTop: '1vh', marginBottom: '1vh' }}>Align</label>
                <div className="segmentedControl">
                  <label><input type="button" value='left' onClick={() => handleAlignToSide('left')} /><img src={sideLeftIcon} /></label>
                  <label><input type="button" value='center' onClick={() => handleAlignToSide('center')} /><img src={sideCenterIcon} /></label>
                  <label><input type="button" value='right' onClick={() => handleAlignToSide('right')} /><img src={sideRightIcon} /></label>
                </div><br/>
                <label style={{ cursor: 'auto', marginTop: '1vh', marginBottom: '1vh' }}>Depth</label>
                <div className="segmentedControl">
                  <label><input type="button" value='up' onClick={() => handleControlZIndex('up')} /><img src={arrowUpIcon} /></label>
                  <label><input type="button" value='down' onClick={() => handleControlZIndex('down')} /><img src={arrowDownIcon} /></label>
                </div>
              </div>
              <span>Style</span>
              <div className="settingGroup">
                <label htmlFor="r" onDrag={(e) => handleLabelSlider(e, 'r')} onDragStart={() => handleLabelSliderStart('r')} draggable="true">Radius</label>
                <input type="number" min={0} id="r" value={selectedElementObj.r} onChange={(e) => handleChangeElement(e, 'r')} />
              </div>
              <span>Color</span>
              <div className="settingGroup">
                <HexColorPicker className="colorPicker" color={colorPickerValue} onChange={setColorPickerValue} />
                <label htmlFor="c">HEX</label>
                <HexColorInput id="c" className="colorInput" color={colorPickerValue} onChange={setColorPickerValue} />
              </div>
            </>
          )}
          {selectedElementObj.t === 'img' && (
            <>
              <span>Position</span>
              <div className="settingGroup">
                <label htmlFor="x" onDrag={(e) => handleLabelSlider(e, 'x')} onDragStart={() => handleLabelSliderStart('x')} draggable="true">X</label>
                <input type="number" id="x" value={selectedElementObj.x} onChange={(e) => handleChangeElement(e, 'x')} />
                <label htmlFor="y" onDrag={(e) => handleLabelSlider(e, 'y')} onDragStart={() => handleLabelSliderStart('y')} draggable="true">Y</label>
                <input type="number" id="y" value={selectedElementObj.y} onChange={(e) => handleChangeElement(e, 'y')} />
                <label htmlFor="w" onDrag={(e) => handleLabelSlider(e, 'w')} onDragStart={() => handleLabelSliderStart('w')} draggable="true">W</label>
                <input type="number" id="w" value={selectedElementObj.w} onChange={(e) => handleChangeElement(e, 'w')} />
                <label htmlFor="h" onDrag={(e) => handleLabelSlider(e, 'h')} onDragStart={() => handleLabelSliderStart('h')} draggable="true">H</label>
                <input type="number" id="h" value={selectedElementObj.h} onChange={(e) => handleChangeElement(e, 'h')} /><br />
                <label style={{ cursor: 'auto', marginTop: '1vh', marginBottom: '1vh' }}>Align</label>
                <div className="segmentedControl">
                  <label><input type="button" value='left' onClick={() => handleAlignToSide('left')} /><img src={sideLeftIcon} /></label>
                  <label><input type="button" value='center' onClick={() => handleAlignToSide('center')} /><img src={sideCenterIcon} /></label>
                  <label><input type="button" value='right' onClick={() => handleAlignToSide('right')} /><img src={sideRightIcon} /></label>
                </div><br/>
                <label style={{ cursor: 'auto', marginTop: '1vh', marginBottom: '1vh' }}>Depth</label>
                <div className="segmentedControl">
                  <label><input type="button" value='up' onClick={() => handleControlZIndex('up')} /><img src={arrowUpIcon} /></label>
                  <label><input type="button" value='down' onClick={() => handleControlZIndex('down')} /><img src={arrowDownIcon} /></label>
                </div>
              </div>
              <span>Style</span>
              <div className="settingGroup">
                <label htmlFor="r" onDrag={(e) => handleLabelSlider(e, 'r')} onDragStart={() => handleLabelSliderStart('r')} draggable="true">Radius</label>
                <input type="number" min={0} id="r" value={selectedElementObj.r} onChange={(e) => handleChangeElement(e, 'r')} />
              </div>
              <span>Format</span>
              <div className="settingGroup">
              <label style={{ cursor: 'auto', marginTop: '1vh', marginBottom: '1vh' }}>Flip</label>
                <div className="segmentedControl">
                  <label><input type="button" value='horizontal' onClick={() => handleFlip('horizontal')} /><img src={flipHorizontalIcon} /></label>
                  <label><input type="button" value='vertical' onClick={() => handleFlip('vertical')} /><img src={flipVerticalIcon} /></label>
                </div>
              </div>
            </>
          )}

        </>
      )}
    </div>
  )
}

export default ElementSettings;
