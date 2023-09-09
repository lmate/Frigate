import interact from 'interactjs';
import { useEffect, useState, useRef } from 'react';

function SlideEditor(props) {

  function generateElement(element, index) {
    switch (element.t) {
      case 'text':
        return <textarea key={element.v + index} defaultValue={element.v} id={`e${index}`} spellCheck="false" style={{
          marginLeft: element.x + '%',
          marginTop: element.y + '%',
          width: element.w + '%',
          fontSize: element.s + 'vh'
        }}
        />
    }
  }

  return (
    <div className="SlideEditor">
      <div>
        {props.slides && props.slides[props.currentSlide].map((element, index) => generateElement(element, index))}
      </div>
    </div>
  )
}

export default SlideEditor;
