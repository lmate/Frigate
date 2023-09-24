import { useEffect, useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

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
      handleChangeElement({target: {value: newValue}}, elementOnSlideKey);
    }
  }

  function handleLabelSliderStart(elementOnSlideKey) {
    labelSliderStartingValue = slides[currentSlide][parseInt(selectedElement.getAttribute('id').split('e')[1])][elementOnSlideKey];
  }

  // Handle color picker value change
  useEffect(() => {
    if (selectedElement) {
      handleChangeElement({target: {value: colorPickerValue.split('#')[1]}}, 'c');
    }
  }, [colorPickerValue]);

  // Setting initial value of colorpicker
  useEffect(() => {
    if (selectedElement) {
      setColorPickerValue('#' + slides[currentSlide][parseInt(selectedElement.getAttribute('id').split('e')[1])].c);
    }
  }, [selectedElement]);

  return (
    <div className="ElementSettings">
      {selectedElementObj && (
        <>
          <span>Position</span>
          <div className="settingGroup">
            <label htmlFor="x" onDrag={(e) => handleLabelSlider(e, 'x')} onDragStart={() => handleLabelSliderStart('x')} draggable="true">X</label>
            <input type="number" id="x" value={selectedElementObj.x} onChange={(e) => handleChangeElement(e, 'x')}/>
            <label htmlFor="y" onDrag={(e) => handleLabelSlider(e, 'y')} onDragStart={() => handleLabelSliderStart('y')} draggable="true">Y</label>
            <input type="number" id="y" value={selectedElementObj.y} onChange={(e) => handleChangeElement(e, 'y')} />
            <label htmlFor="w" onDrag={(e) => handleLabelSlider(e, 'w')} onDragStart={() => handleLabelSliderStart('w')} draggable="true">W</label>
            <input type="number" id="w" value={selectedElementObj.w} onChange={(e) => handleChangeElement(e, 'w')} />
          </div>
          <span>Font</span>
          <div className="settingGroup">
            <label htmlFor="s" onDrag={(e) => handleLabelSlider(e, 's')} onDragStart={() => handleLabelSliderStart('s')} draggable="true">Size</label>
            <input type="number" id="s" value={selectedElementObj.s} onChange={(e) => handleChangeElement(e, 's')} />
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
