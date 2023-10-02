import { useNavigate } from "react-router-dom";

import generateNonInteractiveElement from '../generateNonInteractiveElement';

function PresentationList({ presentations, setSelectedPresentationIndex }) {

  const navigate = useNavigate();

  function handleSelectPresentation(presentationIndex) {
    setSelectedPresentationIndex(presentationIndex);
  }

  function handleStartEdit(presentationId, presentation) {
    navigate(`/edit/${presentationId}`, {state: {presentation: {...presentation, data: JSON.parse(presentation.data)}, sentAt: Date.now()}});
  }

  return (
    <div className="PresentationList">
      {presentations.map((presentation, presentationIndex) => (
        <div key={presentation._id} onClick={() => handleSelectPresentation(presentationIndex)} onDoubleClick={() => handleStartEdit(presentation._id, presentation)}>
          <div style={JSON.parse(presentation.data).presentationOptions}>
            {JSON.parse(presentation.data).slides[0].map((element, index) => generateNonInteractiveElement(element, index))}
          </div>
          <span>{presentation.title}</span>
          <span>Last edit: {new Date(presentation.modifiedAt).toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default PresentationList;
