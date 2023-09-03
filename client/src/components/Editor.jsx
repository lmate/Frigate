import { useState } from "react";
import ElementSettings from "./ElementSettings";
import MenuBar from "./MenuBar";
import SlideEditor from "./SlideEditor";
import SlideStrip from "./SlideStrip";
import ToolBar from "./ToolBar";

const testData = [
  [
    {type: 'text', value: 'valami1\nvalami\nvalami', x: 10, y: 10, w: 10},
    {type: 'text', value: 'valami2', x: 90, y: 50, w: 10}
  ], [
    {type: 'text', value: 'valami3', x: 20, y: 20, w: 10},
    {type: 'text', value: 'valami4', x: 30, y: 30, w: 10}
  ], [
    {type: 'text', value: 'valami3', x: 20, y: 20, w: 10},
    {type: 'text', value: 'valami4', x: 30, y: 30, w: 10}
  ]
];

function Editor() {
  const [slides, setSlides] = useState(testData);
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <>
      <SlideStrip slides={slides} currentSlide={currentSlide} setCurrentSlide={(setIndex) => {setCurrentSlide(setIndex)}} setSlides={(slides) => {setSlides(slides)}}/>
      <ElementSettings />
      <MenuBar />
      <SlideEditor slides={slides} currentSlide={currentSlide}/>
      <ToolBar />
    </>
  )
}

export default Editor;
