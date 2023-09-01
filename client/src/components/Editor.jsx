import { useState } from "react";
import Chat from "./Chat";
import MenuBar from "./MenuBar";
import SlideEditor from "./SlideEditor";
import SlideStrip from "./SlideStrip";
import ToolBar from "./ToolBar";

const testData = [
  [
    {type: 'p', value: 'valami1', x: 10, y: 10},
    {type: 'p', value: 'valami2', x: 90, y: 50}
  ], [
    {type: 'p', value: 'valami3', x: 20, y: 20},
    {type: 'p', value: 'valami4', x: 30, y: 30}
  ], [
    {type: 'p', value: 'valami3', x: 20, y: 20},
    {type: 'p', value: 'valami4', x: 30, y: 30}
  ], [
    {type: 'p', value: 'valami3', x: 20, y: 20},
    {type: 'p', value: 'valami4', x: 30, y: 30}
  ], [
    {type: 'p', value: 'valami3', x: 20, y: 20},
    {type: 'p', value: 'valami4', x: 30, y: 30}
  ], [
    {type: 'p', value: 'valami1', x: 10, y: 10},
    {type: 'p', value: 'valami2', x: 90, y: 50}
  ], [
    {type: 'p', value: 'valami3', x: 20, y: 20},
    {type: 'p', value: 'valami4', x: 30, y: 30}
  ], [
    {type: 'p', value: 'valami3', x: 20, y: 20},
    {type: 'p', value: 'valami4', x: 30, y: 30}
  ], [
    {type: 'p', value: 'valami3', x: 20, y: 20},
    {type: 'p', value: 'valami4', x: 30, y: 30}
  ], [
    {type: 'p', value: 'valami3', x: 20, y: 20},
    {type: 'p', value: 'valami4', x: 30, y: 30}
  ], [
    {type: 'p', value: 'valami1', x: 10, y: 10},
    {type: 'p', value: 'valami2', x: 90, y: 50}
  ], [
    {type: 'p', value: 'valami3', x: 20, y: 20},
    {type: 'p', value: 'valami4', x: 30, y: 30}
  ], [
    {type: 'p', value: 'valami3', x: 20, y: 20},
    {type: 'p', value: 'valami4', x: 30, y: 30}
  ], [
    {type: 'p', value: 'valami3', x: 20, y: 20},
    {type: 'p', value: 'valami4', x: 30, y: 30}
  ], [
    {type: 'p', value: 'valami3', x: 20, y: 20},
    {type: 'p', value: 'valami4', x: 30, y: 30}
  ]
];

function Editor() {
  const [slides, setSlides] = useState(testData);
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <>
      <SlideStrip slides={slides} currentSlide={currentSlide} setCurrentSlide={(setIndex) => {setCurrentSlide(setIndex)}}/>
      <Chat />
      <MenuBar />
      <SlideEditor slides={slides} currentSlide={currentSlide}/>
      <ToolBar />
    </>
  )
}

export default Editor;
