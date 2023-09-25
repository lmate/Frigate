import interact from 'interactjs';
import { useEffect } from 'react';

let dragingX = 0;
let dragingY = 0;

const percentFromPxX = (px) => (px / parseFloat(document.querySelector('.SlideEditor > div').offsetWidth)) * 100;
const percentFromPxY = (px) => (px / parseFloat(document.querySelector('.SlideEditor > div').offsetHeight)) * 56.25;

let elementKeyboardEventListenerAbortController = new AbortController();

function SlideEditor(props) {

  function generateElement(element, index) {
    switch (element.t) {
      case 'text':
        return <textarea
          key={`${props.currentSlide}-${index}`}
          defaultValue={element.v}
          id={`e${index}`}
          onClick={handleElementSelection}
          onDoubleClick={handleElementSelection}
          spellCheck="false" style={{
            marginLeft: element.x + '%',
            marginTop: element.y + '%',
            width: element.w + '%',
            fontSize: element.s + 'vh',
            color: '#' + element.c,
            textAlign: element.a,
            fontStyle: element.fs,
            fontWeight: element.fw
          }}
        />
      case 'rect':
        return <div
          key={`${props.currentSlide}-${index}`}
          id={`e${index}`}
          onClick={handleElementSelection}
          tabIndex="0"
          style={{
            marginLeft: element.x + '%',
            marginTop: element.y + '%',
            width: element.w + '%',
            height: element.h + '%',
            backgroundColor: '#' + element.c,
          }} />
    }
  }

  function handleDeselectEveryElement() {
    document.querySelectorAll('.selectedElement')?.forEach((element) => { element.removeAttribute('readonly') });
    document.querySelectorAll('.selectedElement')?.forEach((element) => { element.classList.remove('selectedElement') });
    document.querySelectorAll('.editingElement')?.forEach((element) => { element.classList.remove('editingElement') });
    document.querySelectorAll('.movingElement')?.forEach((element) => { element.classList.remove('movingElement') });

    props.setSelectedElement(null);
  }

  function convertElementPixelToPercentage(target) {
    resizeTextareaToFitAllText(target);

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

  function resizeTextareaToFitAllText(target) {
    if (target.tagName === 'TEXTAREA') {
      target.style.height = '0';
      target.style.height = (parseFloat(target.scrollHeight) / parseFloat(document.querySelector('.SlideEditor > div').offsetHeight)) * 100 + '%';
    }
  }

  function saveElementModification(target) {
    const modifiedSlides = structuredClone(props.slides);
    const roundTo1Decimal = (num) => Math.round(num * 10) / 10;

    if (target?.tagName === 'TEXTAREA') {
      modifiedSlides[props.currentSlide][parseInt(target.getAttribute('id').split('e')[1])] = {
        ...modifiedSlides[props.currentSlide][parseInt(target.getAttribute('id').split('e')[1])],
        t: 'text',
        v: target.value,
        x: roundTo1Decimal(parseFloat(target.style.marginLeft)),
        y: roundTo1Decimal(parseFloat(target.style.marginTop)),
        w: roundTo1Decimal(parseFloat(target.style.width)),
        s: roundTo1Decimal(parseFloat(target.style.fontSize)),
      };
    } else if (target?.tagName === 'DIV') {
      modifiedSlides[props.currentSlide][parseInt(target.getAttribute('id').split('e')[1])] = {
        ...modifiedSlides[props.currentSlide][parseInt(target.getAttribute('id').split('e')[1])],
        t: 'rect',
        x: roundTo1Decimal(parseFloat(target.style.marginLeft)),
        y: roundTo1Decimal(parseFloat(target.style.marginTop)),
        w: roundTo1Decimal(parseFloat(target.style.width)),
        h: roundTo1Decimal(parseFloat(target.style.height)),
      };
    }

    // Only save if actual change has occured
    if (JSON.stringify(props.slides) !== JSON.stringify(modifiedSlides)) {
      props.setSlides(modifiedSlides);
    }
  }

  function handleElementSelection(e) {
    e.stopPropagation();
    if (!e.target.classList.contains('selectedElement')) {
      handleDeselectEveryElement();
      e.target.classList.add('selectedElement');
      props.setSelectedElement(e.target);
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
    elementKeyboardEventListenerAbortController.abort();
    elementKeyboardEventListenerAbortController = new AbortController();

    document.querySelector('.selectedElement').addEventListener('keydown', handleMovingElementKeyboardEvents, { signal: elementKeyboardEventListenerAbortController.signal });
    document.querySelector('.selectedElement').addEventListener('input', handleEditingElementKeyboardEvents, { signal: elementKeyboardEventListenerAbortController.signal });
  }

  function handleMovingElementKeyboardEvents(e) {
    if (e.target.classList.contains('movingElement')) {
      console.log('az')
      e.preventDefault();
      if (e.key.slice(0, 5) === 'Arrow') {
        switch (e.key.slice(5)) {
          case 'Up':
            e.target.style.marginTop = parseFloat(e.target.style.marginTop) - .2 + '%';
            break;
          case 'Down':
            e.target.style.marginTop = parseFloat(e.target.style.marginTop) + .2 + '%';
            break;
          case 'Left':
            e.target.style.marginLeft = parseFloat(e.target.style.marginLeft) - .3 + '%';
            break;
          case 'Right':
            e.target.style.marginLeft = parseFloat(e.target.style.marginLeft) + .3 + '%';
            break;
        }
      } else if (e.key === 'Delete') {
        const slidesAfterDelete = structuredClone(props.slides);
        slidesAfterDelete[props.currentSlide].splice(parseInt(e.target.getAttribute('id').split('e')[1]), 1);
        handleDeselectEveryElement();
        props.setSlides(slidesAfterDelete);
      }
      saveElementModification(e.target);
    }
  }

  function handleEditingElementKeyboardEvents(e) {
    if (e.target.classList.contains('editingElement')) {
      resizeTextareaToFitAllText(e.target);
      saveElementModification(e.target);
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
        saveElementModification(target);
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
        saveElementModification(event.target);
      },
    }
  });

  // Set texarea height when loading
  useEffect(() => {
    props.slides[props.currentSlide].forEach((element, index) => {
      resizeTextareaToFitAllText(document.querySelector(`#e${index}`));
    });
  }, [props.currentSlide, props.slides]);

  return (
    <div className="SlideEditor">
      <div onClick={handleDeselectEveryElement}>
        {props.slides && props.slides[props.currentSlide].map((element, index) => generateElement(element, index))}
      </div>
    </div>
  )
}

export default SlideEditor;
