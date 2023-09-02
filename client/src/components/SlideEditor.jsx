import interact from 'interactjs';
import { useState } from 'react';

let dragingX = 0;
let dragingY = 0;

const percentFromPxX = (px) => (px / parseFloat(document.querySelector('.SlideEditor > div').offsetWidth)) * 100;
const percentFromPxY = (px) => (px / parseFloat(document.querySelector('.SlideEditor > div').offsetHeight)) * 56.25;

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

function convertElementPixelToPercentage(elementIndex) {
  // Transform values to percentages after resize
  if (document.querySelector(`#e${elementIndex}`).getAttribute('data-x') !== '0') {
    document.querySelector(`#e${elementIndex}`).style.marginLeft = (parseFloat(document.querySelector(`#e${elementIndex}`).style.marginLeft) + percentFromPxX(parseFloat(document.querySelector(`#e${elementIndex}`).getAttribute('data-x')))) + '%';
  }
  if (document.querySelector(`#e${elementIndex}`).getAttribute('data-y') !== '0') {
    document.querySelector(`#e${elementIndex}`).style.marginTop = (parseFloat(document.querySelector(`#e${elementIndex}`).style.marginTop) + percentFromPxY(parseFloat(document.querySelector(`#e${elementIndex}`).getAttribute('data-y')))) + '%';
  }

  if (!document.querySelector(`#e${elementIndex}`).style.width.includes('%')) {
    document.querySelector(`#e${elementIndex}`).style.width = percentFromPxX(parseFloat(document.querySelector(`#e${elementIndex}`).style.width)) + '%';
  }
  if (!document.querySelector(`#e${elementIndex}`).style.height.includes('%')) {
    document.querySelector(`#e${elementIndex}`).style.height = (parseFloat(document.querySelector(`#e${elementIndex}`).style.height) / parseFloat(document.querySelector('.SlideEditor > div').offsetHeight)) * 100 + '%';
  }

  document.querySelector(`#e${elementIndex}`).style.removeProperty('transform');
  document.querySelector(`#e${elementIndex}`).removeAttribute('data-x');
  document.querySelector(`#e${elementIndex}`).removeAttribute('data-y');
}

function SlideEditor(props) {
  const [selectedElement, setSelectedElement] = useState(null);

  function handleElementSelection(index) {
    console.log(index);
    document.querySelectorAll('.moveable').forEach((element) => {
      element.classList.remove('moveable');
    });
    dragingX = 0;
    dragingY = 0;

    convertElementPixelToPercentage(index);

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
    inertia: false
  }).draggable({
    listeners: {
      move(event) {
        if (dragingX === 0) {
          const editorCoords = document.querySelector('.SlideEditor > div').getBoundingClientRect();
          const targetCoords = event.target.getBoundingClientRect();
          dragingX = percentFromPxX(event.clientX0) - percentFromPxX(editorCoords.x) - percentFromPxX(event.clientX0 - targetCoords.x);
          dragingY = percentFromPxY(event.clientY0) - percentFromPxY(editorCoords.y) - percentFromPxY(event.clientY0 - targetCoords.y);
        }
        dragingX += percentFromPxX(event.dx);
        dragingY += percentFromPxY(event.dy);
        event.target.style.marginLeft = dragingX + '%';
        event.target.style.marginTop = dragingY + '%';
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

  return (
    <div className="SlideEditor">
      <div>
        {props.slides && props.slides[props.currentSlide].map((element, index) => generateElement(element, index, handleElementSelection))}
      </div>
    </div>
  )
}

export default SlideEditor;
