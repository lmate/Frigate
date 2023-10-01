import { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import ElementSettings from "./ElementSettings";
import MenuBar from "./MenuBar";
import SlideEditorV2 from "./SlideEditorV2";
import SlideStrip from "./SlideStrip";
import ToolBar from "./ToolBar";

let undoKeyboardEventListenerAbortController = new AbortController();
let lastAddedNewUndoSaveStateAt = Date.now();
let lastSavedAt = Date.now() - 2000;
let autoSaveTimer;

function Editor() {
  const [presentationOptions, setPresentationOptions] = useState({ backgroundColor: '#ffffff' });
  const [slides, setSlides] = useState([[]]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedElement, setSelectedElement] = useState(null);
  const [changeHistory, setChangeHistory] = useState([{ presentationOptions: {}, slides: [[]], currentSlide: 0 }]);
  const [presentationTitle, setPresentationTitle] = useState(null);
  const [isSaved, setIsSaved] = useState(true);
  const [isInSavingProcess, setIsInSavingProcess] = useState(false);
  // Used to force the rerender of textareas, useful when undo does not change the elements key
  const [forceReRender, setForceReRender] = useState(Date.now());

  const navigate = useNavigate();
  const location = useLocation();
  const { presentationid } = useParams();
  
  // Store the always up to date states for the save function, so when saving, we dont have to deal with older state values
  const currentPresentationData = useRef();
  currentPresentationData.current = JSON.stringify({ title: presentationTitle, data: JSON.stringify({ slides, presentationOptions }) });
  const isSavedRef = useRef();
  isSavedRef.current = isSaved;

  // If a presentation is passed from Dashboard, show it, if not (the url was written manually), fetch it 
  useEffect(() => {
    async function decideIfFetchPresentation() {
      if (location.state?.presentation) {
        setSlides(location.state.presentation.data.slides);
        setPresentationOptions(location.state.presentation.data.presentationOptions);
        setPresentationTitle(location.state.presentation.title);

      } else if (presentationid) {
        const response = await fetch(`/api/user/${localStorage.getItem('id')}/presentation/${presentationid}`, { method: 'GET', headers: { 'content-type': 'application/json', 'x-access-token': localStorage.getItem('token') } });
        const presentation = await response.json();

        if (presentation.invalidToken) {
          console.log(presentation.msg);
          localStorage.removeItem('token');
          localStorage.removeItem('id');
          return navigate('/auth');
        }
        setSlides(JSON.parse(presentation.data).slides);
        setPresentationOptions(JSON.parse(presentation.data).presentationOptions);
        setPresentationTitle(presentation.title);
      }
    }
    decideIfFetchPresentation();
    handleSave();
  }, []);

  // Undo state setting event emitters
  undoKeyboardEventListenerAbortController.abort();
  undoKeyboardEventListenerAbortController = new AbortController();
  document.addEventListener('keydown', handleKeyboardShortcuts, { signal: undoKeyboardEventListenerAbortController.signal });
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

  function handleKeyboardShortcuts(e) {
    // Undo
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      if (changeHistory.length > 1 && JSON.stringify(changeHistory.at(-2).presentationOptions) !== '{}') {
        const newChangeHistory = structuredClone(changeHistory);
        newChangeHistory.pop();
        setChangeHistory(newChangeHistory);
        setPresentationOptions(newChangeHistory.at(-1).presentationOptions);
        setSlides(newChangeHistory.at(-1).slides);
        setCurrentSlide(newChangeHistory.at(-1).currentSlide);
        setSelectedElement(null);
        setForceReRender(Date.now());
      }
      // Save
    } else if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  }

  // Listen for presentation changes, know that a new save should happen
  useEffect(() => {
    setIsSaved(false);
  }, [presentationOptions, slides, presentationTitle]);

  async function handleSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(handleSave, 60000);
    if (!isSavedRef.current && lastSavedAt + 1000 < Date.now()) {
      lastSavedAt = Date.now();
      setIsInSavingProcess(true);
      const response = await fetch(`/api/user/${localStorage.getItem('id')}/presentation/${presentationid}`, { method: 'PUT', headers: { 'content-type': 'application/json', 'x-access-token': localStorage.getItem('token') }, body: currentPresentationData.current });
      const saved = await response.json();

      if (saved.invalidToken) {
        console.log(saved.msg);
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        return navigate('/auth');
      }
      setIsSaved(true);
      setIsInSavingProcess(false);
    }
  }

  return (
    <>
      <SlideStrip presentationOptions={presentationOptions} slides={slides} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} setSlides={setSlides} />
      <ElementSettings presentationOptions={presentationOptions} setPresentationOptions={setPresentationOptions} slides={slides} currentSlide={currentSlide} selectedElement={selectedElement} setSlides={setSlides} />
      <MenuBar isSaved={isSaved} isInSavingProcess={isInSavingProcess} handleSave={handleSave} presentationTitle={presentationTitle} setPresentationTitle={setPresentationTitle} />
      <SlideEditorV2 forceReRender={forceReRender} presentationOptions={presentationOptions} slides={slides} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} setSlides={setSlides} setSelectedElement={setSelectedElement} />
      <ToolBar slides={slides} currentSlide={currentSlide} setSlides={setSlides} />
    </>
  )
}

export default Editor;
