import React from 'react';
import Cookies from 'universal-cookie';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Request extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  handleInputChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  logInputValue() {
    const cookies = new Cookies();
    const cookieValue = cookies.get('currentTimeCookie');
    if (cookieValue) {
      const createTime = new Date(cookieValue);
      const currentTime = new Date();
      const differenceInMinutes = (currentTime - createTime) / (1000 * 60);
      console.log(differenceInMinutes)
      if (differenceInMinutes < 5) {
        toast('Request limit');
        return;
      }
    }

    const apiUrl = 'http://192.168.1.12:5000/api/insert_music';
    const data = { url: this.state.inputValue };

    axios.post(apiUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization:localStorage.getItem('token')
      }
    }
    ).then(response => {
      console.log(response.data.Message)
      toast(response.data.Message)
      if(response.data.Message === 'Success')
      {
        const currentTime = new Date();
        const formattedTime = currentTime.toISOString();
        cookies.set('currentTimeCookie', formattedTime, { path: '/', maxAge: 60 * 5 });
      }
    })
    .catch(error => {
        if (error.response && error.response.status === 401) {
          toast('Unauthorized')
        } else {
          toast('An error occurred. Please try again later.')
        }
      });
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.inputValue} onChange={this.handleInputChange.bind(this)} />
        <button onClick={this.logInputValue.bind(this)}>Add</button>
        <ToastContainer />
        <GoogleLogin
          onSuccess={credentialResponse => {
            localStorage.setItem('token', credentialResponse.credential)
            console.log(credentialResponse.credential)
          }}
          onError={() => {
            console.log('Login Failed')
          }}
        />
      </div>
    )
  }
}

export default Request;
