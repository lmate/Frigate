import generateNonInteractiveElement from '../generateNonInteractiveElement';

function PresentationList({ presentations, setSelectedPresentationIndex }) {

  function handleSelectPresentation(presentationIndex) {
    setSelectedPresentationIndex(presentationIndex);
  }

  return (
    <div className="PresentationList">
      {presentations.map((presentation, presentationIndex) => (
        <div key={presentation._id} onClick={() => handleSelectPresentation(presentationIndex)}>
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
