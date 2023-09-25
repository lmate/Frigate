import { useEffect, useState } from "react";
import ElementSettings from "./ElementSettings";
import MenuBar from "./MenuBar";
import SlideEditorV2 from "./SlideEditorV2";
import SlideStrip from "./SlideStrip";
import ToolBar from "./ToolBar";

let undoKeyboardEventListenerAbortController = new AbortController();
let lastAddedNewUndoSaveStateAt = Date.now();

function Editor() {
  const [presentationOptions, setPresentationOptions] = useState({ backgroundColor: '#ffffff' });
  const [slides, setSlides] = useState([[]]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedElement, setSelectedElement] = useState(null);
  const [changeHistory, setChangeHistory] = useState([{ presentationOptions: {}, slides: [[]], currentSlide: 0 }]);
  // Used to force the rerender of textareas, useful when undo does not change the elements key
  const [forceReRender, setForceReRender] = useState(Date.now());

  // Undo state setting event emitters
  undoKeyboardEventListenerAbortController.abort();
  undoKeyboardEventListenerAbortController = new AbortController();
  document.addEventListener('keydown', restoreToLastChangeHistoryState, { signal: undoKeyboardEventListenerAbortController.signal });
  useEffect(() => {
    createNewChangeHistoryState();
  }, [presentationOptions, slides, currentSlide]);

  function createNewChangeHistoryState() {
    if (lastAddedNewUndoSaveStateAt + 500 < Date.now()) {
      lastAddedNewUndoSaveStateAt = Date.now();
      const newChangeHistory = structuredClone(changeHistory);
      if (JSON.stringify(newChangeHistory.at(-1)) !== JSON.stringify({ presentationOptions, slides, currentSlide })) {
        if (newChangeHistory.length > 500) {
          newChangeHistory.shift();
        }
        setChangeHistory([...newChangeHistory, { presentationOptions, slides, currentSlide }]);
      }
    }
  }

  function restoreToLastChangeHistoryState(e) {
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      if (changeHistory.length > 1) {
        const newChangeHistory = structuredClone(changeHistory);
        newChangeHistory.pop();
        setChangeHistory(newChangeHistory);
        setPresentationOptions(newChangeHistory.at(-1).presentationOptions);
        setSlides(newChangeHistory.at(-1).slides);
        setCurrentSlide(newChangeHistory.at(-1).currentSlide);
        setSelectedElement(null);
        setForceReRender(Date.now());
      }
    }
  }

  return (
    <>
      <SlideStrip presentationOptions={presentationOptions} slides={slides} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} setSlides={setSlides} />
      <ElementSettings presentationOptions={presentationOptions} setPresentationOptions={setPresentationOptions} slides={slides} currentSlide={currentSlide} selectedElement={selectedElement} setSlides={setSlides} />
      <MenuBar />
      <SlideEditorV2 forceReRender={forceReRender} presentationOptions={presentationOptions} slides={slides} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} setSlides={setSlides} setSelectedElement={setSelectedElement} />
      <ToolBar slides={slides} currentSlide={currentSlide} setSlides={setSlides} />
    </>
  )
}

export default Editor;
