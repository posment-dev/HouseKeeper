import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BudgetFileUpload = (props) => {

  //const BUDGET_API_URL = 'http://127.0.0.1:5000/api/v1/budget';
  const BUDGET_API_URL = 'http://192.168.1.221:5000/api/v1/budget';

  const navigate = useNavigate();

  const handleUpload = (ev) => {
    ev.preventDefault();

    const data = new FormData();
    data.append('file', ev.target[0].files[0]);


    axios.post(BUDGET_API_URL + '/fileupload', data)
    .then(alert('File upload successful.'))
    .catch((err) => {
      console.log(err);
      alert('File upload failed. Try again.');
    })

    navigate('/budget');
  }


  return (
    <form onSubmit={(event) => handleUpload(event)}>
      <div>
        <input type="file" />
      </div>
      <br />
      <div>
        <button>Upload</button>
      </div>
    </form>
  );
}

export default BudgetFileUpload;