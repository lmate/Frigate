import { useState } from "react";
import ElementSettings from "./ElementSettings";
import MenuBar from "./MenuBar";
import SlideEditorV2 from "./SlideEditorV2";
import SlideStrip from "./SlideStrip";
import ToolBar from "./ToolBar";

function Editor() {
  const [slides, setSlides] = useState([[]]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedElement, setSelectedElement] = useState(null);

  return (
    <>
      <SlideStrip slides={slides} currentSlide={currentSlide} setCurrentSlide={(setIndex) => {setCurrentSlide(setIndex)}} setSlides={(slides) => {setSlides(slides)}}/>
      <ElementSettings slides={slides} currentSlide={currentSlide} selectedElement={selectedElement} setSlides={(slides) => {setSlides(slides)}}/>
      <MenuBar />
      <SlideEditorV2 slides={slides} currentSlide={currentSlide} setCurrentSlide={(setIndex) => {setCurrentSlide(setIndex)}} setSlides={(slides) => {setSlides(slides)}} setSelectedElement={setSelectedElement}/>
      <ToolBar slides={slides} currentSlide={currentSlide} setSlides={(slides) => {setSlides(slides)}}/>
    </>
  )
}

export default Editor;
