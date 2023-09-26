import generateNonInteractiveElement from '../generateNonInteractiveElement';

import arrowLeftIcon from '../assets/arrow_left_icon.svg';
import arrowRightIcon from '../assets/arrow_right_icon.svg';
import editIcon from '../assets/edit_icon.svg';
import playIcon from '../assets/play_icon.svg';

function PresentationPreview({ presentations, selectedPresentationIndex }) {
  return (
    <div className="PresentationPreview">
      <div style={JSON.parse(presentations[selectedPresentationIndex].data).presentationOptions}>
        {JSON.parse(presentations[selectedPresentationIndex].data).slides[0].map((element, index) => generateNonInteractiveElement(element, index))}
      </div>
      <div>
        <div><img src={editIcon} /></div>
        <div><img src={playIcon} /></div>
        <div><img src={arrowLeftIcon} /></div>
        <div><img src={arrowRightIcon} /></div>
        <span>{presentations[selectedPresentationIndex].title}</span>
      </div>
    </div>
  )
}

export default PresentationPreview;
