import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { apiKey, baseId, tableName } from "./envVariables";

const colors = [
  '#0066FF', // Original blue
  '#2D5A27', // Muted forest green
  '#7B506F', // Muted purple
  '#1B365D', // Navy blue
  '#4A6670', // Steel blue-gray
];


const API_URL = `https://api.airtable.com/v0/${baseId}/${tableName}`;

const airtableAxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
});

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // Store the message for the placeholder
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((current) => (current + 1) % colors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Email validation regex
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email format
    if (!validateEmail(email)) {
      setMessage('Email seems incorrect, please try again.');
      return;
    }

    try {
      await airtableAxiosInstance.post('', {
        records: [
          {
            fields: {
              email: email, // Send the email value to Airtable
            },
          },
        ],
      });

      // If email is valid and submitted successfully, show thank you message
      setMessage('Thank you for subscribing.');
      setEmail(''); // Clear the email input field after successful submission

    } catch (error) {
      console.error('Error saving data to Airtable:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1
            className="font-bold text-7xl md:text-8xl mb-4 tracking-tight leading-none transition-colors duration-1000 ease-in-out"
            style={{ color: colors[colorIndex] }}
          >
            NOT A
            <br />
            NEWSLETTER
          </h1>

          <div className="mt-24 md:mt-28 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-black text-xl font-medium mb-1">Data Engineering,</p>
              <p className="text-black text-xl font-medium mb-1">Machine Learning,</p>
              <p className="text-black text-xl font-medium mb-1">User Psychology & more</p>
              <p className="text-black text-xl font-medium mb-1">No spam, ever, only cool stuff</p>
            </div>

            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full bg-transparent border-b-2 border-black p-2 focus:outline-none focus:border-[#0066FF] transition-colors placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  className="group w-full md:w-auto px-8 py-3 relative overflow-hidden transition-all duration-300"
                  style={{ backgroundColor: colors[colorIndex] }}
                >
                  <span className="relative z-10 text-white transition-transform duration-300 group-hover:translate-x-1">
                    Subscribe
                  </span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </button>
              </form>

              {message && (
                <div
                  className="mt-4 font-medium transition-colors duration-1000 ease-in-out"
                  style={{ color: message === 'Thank you for subscribing.' ? colors[colorIndex] : 'red' }}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
