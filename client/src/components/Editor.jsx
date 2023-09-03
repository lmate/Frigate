import { useState } from "react";
import ElementSettings from "./ElementSettings";
import MenuBar from "./MenuBar";
import SlideEditor from "./SlideEditor";
import SlideStrip from "./SlideStrip";
import ToolBar from "./ToolBar";

function Editor() {
  const [slides, setSlides] = useState([[]]);
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <>
      <SlideStrip slides={slides} currentSlide={currentSlide} setCurrentSlide={(setIndex) => {setCurrentSlide(setIndex)}} setSlides={(slides) => {setSlides(slides)}}/>
      <ElementSettings />
      <MenuBar />
      <SlideEditor slides={slides} currentSlide={currentSlide} setCurrentSlide={(setIndex) => {setCurrentSlide(setIndex)}} setSlides={(slides) => {setSlides(slides)}}/>
      <ToolBar slides={slides} currentSlide={currentSlide} setSlides={(slides) => {setSlides(slides)}}/>
    </>
  )
}

export default Editor;
