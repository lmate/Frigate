import { useNavigate } from "react-router-dom";

import Header from './Header';
import PresentationList from './PresentationList';
import PresentationPreview from './PresentationPreview';

function Dashboard() {
  const navigate = useNavigate();

  async function test() {
    const response = await fetch('/api/isloggedin', {method: 'GET', headers: {'content-type': 'application/json', 'x-access-token': localStorage.getItem('token')}});
    const data = await response.json();

    if (data.invalidToken) {
      return navigate('/auth');
    }
    
    console.log('All good, you are authenticated');
  }
  test()

  return (
    <>
    {/*
    
    */}
      <PresentationPreview />
      <Header />
      <PresentationList />
    </>
  )
}

export default Dashboard;
