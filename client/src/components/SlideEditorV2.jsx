import interact from 'interactjs';
import { useEffect, useState, useRef } from 'react';

let dragingX = 0;
let dragingY = 0;

const percentFromPxX = (px) => (px / parseFloat(document.querySelector('.SlideEditor > div').offsetWidth)) * 100;
const percentFromPxY = (px) => (px / parseFloat(document.querySelector('.SlideEditor > div').offsetHeight)) * 56.25;

function SlideEditor(props) {

  function generateElement(element, index) {
    switch (element.t) {
      case 'text':
        return <textarea
          key={element.v + index}
          defaultValue={element.v}
          id={`e${index}`}
          onClick={handleElementSelection}
          onDoubleClick={handleElementSelection}
          spellCheck="false" style={{
            marginLeft: element.x + '%',
            marginTop: element.y + '%',
            width: element.w + '%',
            fontSize: element.s + 'vh'
          }}
        />
    }
  }

  function handleDeselectEveryElement() {
    document.querySelectorAll('.selectedElement')?.forEach((element) => { element.removeAttribute('readonly') });
    document.querySelectorAll('.selectedElement')?.forEach((element) => { element.classList.remove('selectedElement') });
    document.querySelectorAll('.editingElement')?.forEach((element) => { element.classList.remove('editingElement') });
    document.querySelectorAll('.movingElement')?.forEach((element) => { element.classList.remove('movingElement') });
  }

  function convertElementPixelToPercentage(target) {
    if (target.getAttribute('data-x') !== '0') {
      target.style.marginLeft = (parseFloat(target.style.marginLeft) + percentFromPxX(parseFloat(target.getAttribute('data-x')))) + '%';
    }
    if (target.getAttribute('data-y') !== '0') {
      target.style.marginTop = (parseFloat(target.style.marginTop) + percentFromPxY(parseFloat(target.getAttribute('data-y')))) + '%';
    }

    if (!target.style.width.includes('%')) {
      target.style.width = percentFromPxX(parseFloat(target.style.width)) + '%';
    }
    if (!target.style.height.includes('%')) {
      target.style.height = (parseFloat(target.style.height) / parseFloat(document.querySelector('.SlideEditor > div').offsetHeight)) * 100 + '%';
    }

    target.style.removeProperty('transform');
    target.removeAttribute('data-x');
    target.removeAttribute('data-y');
  }

  function handleElementSelection(e) {
    e.stopPropagation();
    if (!e.target.classList.contains('selectedElement')) {
      handleDeselectEveryElement();
      e.target.classList.add('selectedElement');
    }

    dragingX = 0;
    dragingY = 0;

    if (e.type === 'click') {
      if (!e.target.classList.contains('editingElement')) {
        e.target.classList.add('movingElement');
        document.querySelectorAll('.editingElement')?.forEach((element) => { element.classList.remove('editingElement') });
        e.target.setAttribute('readonly', 'true');
      }
    } else if (e.type === 'dblclick') {
      e.target.classList.add('editingElement');
      document.querySelectorAll('.movingElement')?.forEach((element) => { element.classList.remove('movingElement') });
      e.target.removeAttribute('readonly');
    }

    handleAddElementKeyboardEventListeners();
  }

  function handleAddElementKeyboardEventListeners() {
    document.querySelector('.selectedElement').removeEventListener("keydown", handleMovingElementKeyboardEvents);
    document.querySelector('.selectedElement').removeEventListener("input", handleEditingElementKeyboardEvents);

    document.querySelector('.selectedElement').addEventListener('keydown', handleMovingElementKeyboardEvents);
    document.querySelector('.selectedElement').addEventListener('input', handleEditingElementKeyboardEvents);
  }

  function handleMovingElementKeyboardEvents(e) {
    if (e.target.classList.contains('movingElement')) {
      console.log('moving')
    }
  }

  function handleEditingElementKeyboardEvents(e) {
    if (e.target.classList.contains('editingElement')) {
      console.log('editing')
    }
  }

  interact('.movingElement').resizable({
    edges: { left: true, right: true, bottom: true, top: true },
    listeners: {
      move(event) {
        const target = event.target;
        let x = (parseFloat(target.getAttribute('data-x')) || 0);
        let y = (parseFloat(target.getAttribute('data-y')) || 0);
        target.style.width = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';
        x += event.deltaRect.left;
        y += event.deltaRect.top;
        target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
        convertElementPixelToPercentage(target);
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
        convertElementPixelToPercentage(event.target);
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
      <div onClick={handleDeselectEveryElement}>
        {props.slides && props.slides[props.currentSlide].map((element, index) => generateElement(element, index))}
      </div>
    </div>
  )
}

export default SlideEditor;
