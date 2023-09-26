import { useState } from "react";

function PresentationList({ presentations }) {

  function generateElement(element, index) {
    switch (element.t) {
      case 'text':
        return <p key={element.v + index + 'mini'} style={{
          marginLeft: element.x + '%',
          marginTop: element.y + '%',
          width: element.w + '%',
          fontSize: element.s + 'vh',
          color: '#' + element.c,
          textAlign: element.a,
          fontStyle: element.fs,
          fontWeight: element.fw
        }}>{element.v}</p>
      case 'rect':
        return <div
          key={element.t + index + 'mini'}
          style={{
            marginLeft: element.x + '%',
            marginTop: element.y + '%',
            width: element.w + '%',
            height: element.h + '%',
            backgroundColor: '#' + element.c,
            borderRadius: element.r + 'vh'
          }} />
    }
  }


  return (
    <div className="PresentationList">
      {presentations.map((presentation) => (
        <div key={presentation._id}>
          <div style={JSON.parse(presentation.data).presentationOptions}>
            {JSON.parse(presentation.data).slides[0].map((element, index) => generateElement(element, index))}
          </div>
          <span>{presentation.title}</span>
          <span>Last edit: {new Date(presentation.modifiedAt).toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default PresentationList;
