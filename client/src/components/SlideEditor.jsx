import interact from 'interactjs';
import { useState } from 'react';

function generateElement(element, index, handleElementSelection) {
  switch (element.type) {
    case 'p':
      return <p key={element.value + index} id={`e${index}`} onClick={() => { handleElementSelection(index) }} style={{
        position: 'absolute',
        marginLeft: element.x + '%',
        marginTop: element.y + '%',
        width: element.w + '%',
        height: element.h + '%'
      }}>{element.value}</p>
  }
}

let dragingX = 0;
let dragingY = 0;

function SlideEditor(props) {
  const [selectedElement, setSelectedElement] = useState(null);

  function handleElementSelection(index) {
    console.log(index);
    document.querySelectorAll('.moveable').forEach((element) => {
      element.classList.remove('moveable');
    });
    dragingX = 0;
    dragingY = 0;
    document.querySelector(`#e${index}`).className = 'moveable';
    setSelectedElement(index);
  }

  interact('.moveable').resizable({
    edges: { left: true, right: true, bottom: true, top: true },
    listeners: {
      move(event) {
        var target = event.target
        var x = (parseFloat(target.getAttribute('data-x')) || 0)
        var y = (parseFloat(target.getAttribute('data-y')) || 0)

        target.style.width = event.rect.width + 'px'
        target.style.height = event.rect.height + 'px'

        x += event.deltaRect.left
        y += event.deltaRect.top

        target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
      }
    },
    modifiers: [
      interact.modifiers.restrictEdges({ outer: 'parent' })
    ],
    inertia: true
  }).draggable({
    listeners: {
      move(event) {

        //let x = parseInt(event.target.style.marginLeft);
        //let y = parseInt(event.target.style.marginTop);

        if (dragingX === 0) {

          // TODO: The positioning when first selecting an element is not right, after the first drag, everyhing is good,
          // but the first drag, has to start from an accurate position, which it does not... Fucker...
          // (also, snapback from outside the div, is also not accurate)

          console.log(event.target.getBoundingClientRect().x - event.clientX);

          let xDistanceFromOrigin = (((event.target.getBoundingClientRect().x - event.clientX) / document.querySelector('.SlideEditor > div').offsetWidth) * 100);
          let yDistanceFromOrigin = (((event.target.getBoundingClientRect().y - event.clientY) / document.querySelector('.SlideEditor > div').offsetHeight) * 55);
          console.log(xDistanceFromOrigin)

          dragingX = ((event.clientX / document.querySelector('.SlideEditor > div').offsetWidth) * 100) - 16;
          dragingY = ((event.clientY / document.querySelector('.SlideEditor > div').offsetHeight) * 55) - 10;

          dragingX -= Math.abs(xDistanceFromOrigin);
          dragingY -= Math.abs(yDistanceFromOrigin);

          console.log(dragingX)


          //dragingX -= dragingX / 1.5;
          //dragingY -= dragingY / 1.5;
        }

        dragingX += (event.dx / document.querySelector('.SlideEditor > div').offsetWidth) * 100;
        dragingY += (event.dy / document.querySelector('.SlideEditor > div').offsetHeight) * 55;
        
        event.target.style.marginLeft = dragingX + '%';
        event.target.style.marginTop = dragingY + '%';

        //event.target.style.marginLeft = (document.querySelector('.SlideEditor > div').offsetWidth - x) / document.querySelector('.SlideEditor > div').offsetWidth + '%';
        //event.target.style.marginTop = (document.querySelector('.SlideEditor > div').offsetHeight - y) / document.querySelector('.SlideEditor > div').offsetHeight + '%';
      },
    },
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ]
  });
  /*
  if (document.querySelector('.moveable')) {
    document.querySelector('.moveable').addEventListener('mousemove', (e) => {
      if (e.buttons === 1) {
        console.log('huzogat');
        console.log(e)
        e.target.style.marginLeft = e.offsetX;
      }
    });
  }*/

  return (
    <div className="SlideEditor">
      <div>
        {props.slides && props.slides[props.currentSlide].map((element, index) => generateElement(element, index, handleElementSelection))}
      </div>
    </div>
  )
}

export default SlideEditor;
