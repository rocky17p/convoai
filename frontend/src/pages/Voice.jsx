import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import { handleVoiceMessage } from '../api';

const Voice = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responseText, setResponseText] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition API not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      sendVoiceMessage(speechResult);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const sendVoiceMessage = async (text) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User not authenticated');
      return;
    }
    try {
      const data = await handleVoiceMessage(userId, text);
      if (data.text) {
        setResponseText(data.text);
        speakResponse(data.text);
      } else {
        console.error('Error from server:', data.message);
      }
    } catch (error) {
      console.error('Error sending voice message:', error);
    }
  };

  const speakResponse = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis API not supported in this browser.');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleStartVoice = () => {
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setTranscript('');
      setResponseText('');
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900 rounded-lg p-8 text-center text-white fade-in">
      <div className="mb-6 bounce-in">
        <FaMicrophone className={`text-purple-600 text-9xl shadow-lg shadow-purple-600/50 rounded-full p-8 bg-gradient-to-br from-purple-700 to-purple-500 ${listening ? 'pulse-glow' : ''} float`} />
      </div>
      <h1 className="text-3xl font-bold mb-2 slide-in-left">Ready to chat</h1>
      <p className="text-gray-400 mb-6 slide-in-right">Click the button below to start voice conversation</p>
      <button
        onClick={handleStartVoice}
        className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 button-hover pulse-glow"
      >
        <FaMicrophone /> {listening ? 'Stop' : 'Start'} Voice
      </button>
      <div className="mt-6 bg-gray-800 rounded-lg p-4 text-gray-400 max-w-md mx-auto hover-lift fade-in min-h-[100px] overflow-auto max-h-64">
        <p className="whitespace-pre-wrap break-words"><strong>You said:</strong> {transcript}</p>
        <p className="whitespace-pre-wrap break-words"><strong>AI response:</strong> {responseText}</p>
      </div>
    </div>
  );
};

export default Voice;