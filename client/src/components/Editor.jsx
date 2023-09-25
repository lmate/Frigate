import { useState } from "react";
import ElementSettings from "./ElementSettings";
import MenuBar from "./MenuBar";
import SlideEditorV2 from "./SlideEditorV2";
import SlideStrip from "./SlideStrip";
import ToolBar from "./ToolBar";

function Editor() {
  const [presentationOptions, setPresentationOptions] = useState({backgroundColor: '#ffffff'});
  const [slides, setSlides] = useState([[]]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedElement, setSelectedElement] = useState(null);

  return (
    <>
      <SlideStrip presentationOptions={presentationOptions} slides={slides} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} setSlides={setSlides}/>
      <ElementSettings presentationOptions={presentationOptions} setPresentationOptions={setPresentationOptions} slides={slides} currentSlide={currentSlide} selectedElement={selectedElement} setSlides={setSlides}/>
      <MenuBar />
      <SlideEditorV2 presentationOptions={presentationOptions} slides={slides} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} setSlides={setSlides} setSelectedElement={setSelectedElement}/>
      <ToolBar slides={slides} currentSlide={currentSlide} setSlides={setSlides}/>
    </>
  )
}

export default Editor;
