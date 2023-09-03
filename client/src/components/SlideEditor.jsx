import interact from 'interactjs';
import { useEffect, useState } from 'react';

let dragingX = 0;
let dragingY = 0;

const percentFromPxX = (px) => (px / parseFloat(document.querySelector('.SlideEditor > div').offsetWidth)) * 100;
const percentFromPxY = (px) => (px / parseFloat(document.querySelector('.SlideEditor > div').offsetHeight)) * 56.25;

function generateElement(element, index) {
  switch (element.type) {
    case 'text':
      return <textarea key={element.value + index} defaultValue={element.value} id={`e${index}`} onClick={() => { handleElementSelection(index) }} spellCheck="false" style={{
        marginLeft: element.x + '%',
        marginTop: element.y + '%',
        width: element.w + '%'
      }} />
  }
}

function convertElementPixelToPercentage(elementIndex) {
  const targetElement = document.querySelector(`#e${elementIndex}`);
  resizeTextareaToFitAllText(targetElement);

  if (targetElement.getAttribute('data-x') !== '0') {
    targetElement.style.marginLeft = (parseFloat(targetElement.style.marginLeft) + percentFromPxX(parseFloat(targetElement.getAttribute('data-x')))) + '%';
  }
  if (targetElement.getAttribute('data-y') !== '0') {
    targetElement.style.marginTop = (parseFloat(targetElement.style.marginTop) + percentFromPxY(parseFloat(targetElement.getAttribute('data-y')))) + '%';
  }

  if (!targetElement.style.width.includes('%')) {
    targetElement.style.width = percentFromPxX(parseFloat(targetElement.style.width)) + '%';
  }
  if (!targetElement.style.height.includes('%')) {
    targetElement.style.height = (parseFloat(targetElement.style.height) / parseFloat(document.querySelector('.SlideEditor > div').offsetHeight)) * 100 + '%';
  }

  targetElement.style.removeProperty('transform');
  targetElement.removeAttribute('data-x');
  targetElement.removeAttribute('data-y');
}

function resizeTextareaToFitAllText(target) {
  if (target.tagName === 'TEXTAREA') {
    target.style.height = '0';
    target.style.height = (parseFloat(target.scrollHeight) / parseFloat(document.querySelector('.SlideEditor > div').offsetHeight)) * 100 + '%';
  }
}

function handleElementSelection(index) {
  console.log(index);
  document.querySelectorAll('.selectedElement').forEach((element) => {
    element.classList.remove('selectedElement');
  });
  dragingX = 0;
  dragingY = 0;

  if (index !== -1) {
    document.querySelector(`#e${index}`).className = 'selectedElement';
    convertElementPixelToPercentage(index);
    setResizableSides(index);

    document.querySelector('.selectedElement').addEventListener('input', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        e.target.focus();
      }
      convertElementPixelToPercentage(index);
    });
  }
}

function handleDeselectEverything(e) {
  if (e.target.tagName === 'DIV') {
    handleElementSelection(-1);
  }
}

function setResizableSides(elementIndex) {
  if (document.querySelector(`#e${elementIndex}`).tagName === 'TEXTAREA') {
    interact('.selectedElement').options.resize.edges = { left: true, right: true, bottom: false, top: false };
  } else {
    interact('.selectedElement').options.resize.edges = { left: true, right: true, bottom: true, top: true };
  }
}

function SlideEditor(props) {

  // Size all texarea properly, when loading
  useEffect(() => {
    props.slides[props.currentSlide].forEach((element, index) => {
      resizeTextareaToFitAllText(document.querySelector(`#e${index}`));
    });
  }, [props.currentSlide]);

  interact('.selectedElement').resizable({
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
        if (dragingX === 0 && dragingY === 0) {
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
      <div onClick={handleDeselectEverything}>
        {props.slides && props.slides[props.currentSlide].map((element, index) => generateElement(element, index))}
      </div>
    </div>
  )
}

export default SlideEditor;
