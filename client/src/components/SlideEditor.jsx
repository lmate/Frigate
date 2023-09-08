import interact from 'interactjs';
import { useEffect, useState } from 'react';

let dragingX = 0;
let dragingY = 0;

const percentFromPxX = (px) => (px / parseFloat(document.querySelector('.SlideEditor > div').offsetWidth)) * 100;
const percentFromPxY = (px) => (px / parseFloat(document.querySelector('.SlideEditor > div').offsetHeight)) * 56.25;

let lastSelectedElementIndex = -1;

function SlideEditor(props) {

  function handleElementSelection(index, clickMethod) {
    /*
    document.querySelectorAll('.selectedElement').forEach((element) => {
      element.classList.remove('selectedElement');
    });
    document.querySelectorAll('.editingElement').forEach((element) => {
      element.classList.remove('editingElement');
    });*/
    dragingX = 0;
    dragingY = 0;

    if (index !== -1) {
      //console.log(index);
      if (clickMethod === 'single') {
        if (!document.querySelector(`#e${index}`).classList.contains('editingElement')) {
          document.querySelector('.selectedElement')?.classList.remove('selectedElement');
          document.querySelector(`#e${index}`).className = 'selectedElement';
          document.querySelector('.selectedElement')?.setAttribute('disabled', true);
        }
      } else if (clickMethod === 'double') {
        document.querySelector('.selectedElement')?.classList.remove('selectedElement');
        document.querySelector('.editingElement')?.classList.remove('editingElement');
        document.querySelector(`#e${index}`).className = 'editingElement';
        document.querySelector('.editingElement')?.removeAttribute('disabled');
        document.querySelector(`#e${index}`).focus();
      }
      convertElementPixelToPercentage(index);

      /*
      document.querySelector('.selectedElement')?.addEventListener('keydown', (e) => {
        console.log(e)
        if (e.key === 'Tab') {
          e.preventDefault();
          e.target.focus();
        } else if (e.key === 'Delete') {
          e.preventDefault();
          lastSelectedElementIndex = -1;
          const slidesAfterDelete = structuredClone(props.slides);
          slidesAfterDelete[props.currentSlide].splice(index, 1);
          props.setSlides(slidesAfterDelete);
        } else if (e.key.slice(0, 5) === 'Arrow') {
          e.preventDefault();
          switch (e.key.slice(5)) {
            case 'Up':
              if (parseFloat(e.target.style.marginTop) > 0) {
                e.target.style.marginTop = parseFloat(e.target.style.marginTop) - .2 + '%';
              }
              break;
            case 'Down':
              //if (parseFloat(e.target.style.marginTop) + parseFloat(e.target.style.height) < 60) {
                e.target.style.marginTop = parseFloat(e.target.style.marginTop) + .2 + '%';
              //}
              break;
            case 'Left':
              console.log('itt')
              e.target.style.marginLeft = parseFloat(e.target.style.marginLeft) - .3 + '%';
              break;
            case 'Right':
              e.target.style.marginLeft = parseFloat(e.target.style.marginLeft) + .3 + '%';
              break;
          }
        } else {
          if (e.key === 'Enter') {
            console.log(e.target.value)
            e.preventDefault();
            e.target.value += '\n';
          }
          convertElementPixelToPercentage(index);
        }
      });
      */
      saveElementModification(index);
    } else {
      saveElementModification(lastSelectedElementIndex);
      document.querySelector('.selectedElement')?.classList.remove('selectedElement');
      document.querySelector('.editingElement')?.classList.remove('editingElement');
    }
    lastSelectedElementIndex = index;
  }

  function generateElement(element, index) {
    switch (element.t) {
      case 'text':
        return <textarea key={element.v + index} defaultValue={element.v} id={`e${index}`} onClick={() => { handleElementSelection(index, 'single') }} onDoubleClick={() => {handleElementSelection(index, 'double')}} spellCheck="false" style={{
          marginLeft: element.x + '%',
          marginTop: element.y + '%',
          width: element.w + '%',
          fontSize: element.s + 'vh'
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

  function handleDeselectEverything(e) {
    if (e.target.tagName === 'DIV') {
      document.querySelector('.selectedElement')?.removeAttribute('disabled');
      document.querySelector('.editingElement')?.removeAttribute('disabled');
      handleElementSelection(-1);
    }
  }

  function saveElementModification(elementIndex) {
    if (elementIndex !== -1) {
      const modifiedSlides = structuredClone(props.slides);
      const modifiedElement = document.querySelector(`#e${elementIndex}`);

      if (modifiedElement.tagName === 'TEXTAREA') {
        modifiedSlides[props.currentSlide][elementIndex] = {
          t: 'text',
          v: modifiedElement.value,
          x: parseFloat(modifiedElement.style.marginLeft),
          y: parseFloat(modifiedElement.style.marginTop),
          w: parseFloat(modifiedElement.style.width),
          s: parseFloat(modifiedElement.style.fontSize)
        };
      }

      // Only save if actual change has occured
      if (JSON.stringify(props.slides) !== JSON.stringify(modifiedSlides)) {
        console.log(modifiedSlides);
        console.log('save', elementIndex)
        props.setSlides(modifiedSlides);
      }
    }
  }

  // Size all texarea properly, when loading
  useEffect(() => {
    props.slides[props.currentSlide].forEach((element, index) => {
      resizeTextareaToFitAllText(document.querySelector(`#e${index}`));
    });
  }, [props.currentSlide, props.slides]);

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
