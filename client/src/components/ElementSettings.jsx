import { useEffect, useState } from "react";

function ElementSettings({ slides, setSlides, currentSlide, selectedElement }) {
  const [selectedElementObj, setSelectedElementObj] = useState(null);

  useEffect(() => {
    if (selectedElement) {
      setSelectedElementObj(slides[currentSlide][parseInt(selectedElement.getAttribute('id').split('e')[1])]);
    }
  }, [slides, currentSlide, selectedElement]);

  function handleChange(e, keyToModify) {
    const updatedSlides = structuredClone(slides);
    updatedSlides[currentSlide][parseInt(selectedElement.getAttribute('id').split('e')[1])][keyToModify] = e.target.value;
    setSlides(updatedSlides);
  }


  return (
    <div className="ElementSettings">
      {selectedElementObj && (
        <>
          <span>Position</span>
          <div className="settingGroup">
            <label htmlFor="x">X</label>
            <input type="number" id="x" value={selectedElementObj.x} onChange={(e) => handleChange(e, 'x')}/>
            <label htmlFor="y">Y</label>
            <input type="number" id="y" value={selectedElementObj.y} onChange={(e) => handleChange(e, 'y')} />
            <label htmlFor="w">W</label>
            <input type="number" id="w" value={selectedElementObj.w} onChange={(e) => handleChange(e, 'w')} />
          </div>
          <span>Font</span>
          <div className="settingGroup">
            <label htmlFor="s">Size</label>
            <input type="number" id="s" value={selectedElementObj.s} onChange={(e) => handleChange(e, 's')} />
          </div>
        </>
      )}
    </div>
  )
}

export default ElementSettings;
