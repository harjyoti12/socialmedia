import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { client } from '../clinet';  // Ensure client is set up to connect to Sanity

const Login = () => {
  const navigate = useNavigate();

  const handleResponse = async (response) => {
    if (response?.credential) {
      try {
        // Decode the Google ID token
        const decodedToken = JSON.parse(atob(response.credential.split('.')[1]));
        const { name, email, picture, sub: googleId } = decodedToken;

        // Store user information in localStorage
        localStorage.setItem('user', JSON.stringify({ name, email, picture,googleId }));

     

        const doc = {
          _id: googleId,
          _type: 'user',
          username: name,
          image: picture,  // Correctly assigning the image URL
        };
        
        // Save the user document to Sanity
        await client.createIfNotExists(doc);

        // Navigate to the home page
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Error processing Google login:', error);
      }
    } else {
      console.error('No credential returned');
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_API_TOKEN}>
      <div className="flex justify-start items-center flex-col h-screen">
        <div className="relative w-full h-full">
          <video
            src={shareVideo}
            type="video/mp4"
            loop
            controls={false}
            muted
            autoPlay
            className="w-full h-full object-cover"
          />

          <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
            <div className="p-5">
              <img src={logo} width="130px" alt="Logo" />
            </div>

            <div className="shadow-2xl">
              <GoogleLogin
                onSuccess={handleResponse}
                onError={(error) =>
                  console.error('Error logging in with Google:', error)
                }
                render={(renderProps) => (
                  <button
                    type="button"
                    className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <FcGoogle className="mr-4" /> Sign in with Google
                  </button>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
