import React, { useState } from 'react';

const SRMProjectExpo = () => {
  const [title, setTitle] = useState('Automated Smart Wheelchair');
  const [abstract, setAbstract] = useState(
    'The Automated Smart Wheelchair is designed to enhance mobility for individuals with disabilities. It integrates Arduino-controlled automation, Bluetooth communication for mobile app-based control, and ultrasonic sensors for obstacle detection and decision-making. This cost-effective and user-friendly solution ensures both manual and autonomous control, improving accessibility and safety.'
  );
  const [introduction, setIntroduction] = useState(
    'Mobility challenges faced by individuals with disabilities require innovative solutions. The Automated Smart Wheelchair leverages IoT and embedded systems to provide an affordable, scalable, and intelligent mobility aid. By integrating wireless control, obstacle detection, and safety features, this project aims to address the limitations of traditional wheelchairs.'
  );
  const [methodology, setMethodology] = useState(
    'The wheelchair uses an Arduino UNO as the main controller. Ultrasonic sensors detect obstacles and send data to the Arduino for processing. A Bluetooth module (HC-05) enables wireless control via a mobile app. Servo motors provide precise movement. The system includes a buzzer for safety alerts when obstacles are detected. Decision-making logic ensures smooth navigation by scanning left and right for clear paths.'
  );
  const [systemArchitecture, setSystemArchitecture] = useState(
    'The system architecture consists of an Arduino UNO as the central controller connected to ultrasonic sensors for obstacle detection, servo motors for movement, a Bluetooth module for mobile app communication, and a buzzer for alerts. The architecture ensures real-time obstacle detection and navigation decisions.'
  );
  const [result, setResult] = useState(
    'The prototype successfully demonstrated its ability to navigate autonomously while avoiding obstacles. It provided seamless wireless control via a mobile app and ensured safety through real-time obstacle detection and buzzer alerts. The system proved to be cost-effective and reliable.'
  );
  const [conclusion, setConclusion] = useState(
    'The Automated Smart Wheelchair is a cost-effective and user-friendly solution that enhances mobility for individuals with disabilities. Its integration of IoT components ensures both manual and autonomous operation while maintaining safety and reliability. Future enhancements could include voice control, GPS navigation, and health monitoring features.'
  );
  const [teamMembers, setTeamMembers] = useState(
    'RA2311026010780\nRA2311026010805\nRA2311026010806\nRA2311026010808'
  );

  return (
    <div className="flex flex-col w-full h-screen max-h-screen bg-gradient-to-r from-green-100 to-blue-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 p-2 bg-white rounded-lg">
        <div className="flex items-center">
          <img 
            src="/api/placeholder/60/60" 
            alt="SRM Logo" 
            className="w-16 h-16 mr-2"
          />
          <h1 className="text-4xl font-bold text-teal-700">SRM</h1>
          <p className="text-xs max-w-xs ml-2">
            INSTITUTE OF SCIENCE & TECHNOLOGY
            <br />
            (Deemed to be University) u/s 3 of UGC Act, 1956
          </p>
        </div>
        <h1 className="text-4xl font-bold text-center">SRM Project Expo - 2025</h1>
      </div>
      
      {/* Title Section */}
      <div className="mb-4">
        <div className="flex items-center bg-white rounded-lg p-2">
          <span className="font-bold mr-2">Title :</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-grow p-1 border border-gray-300 rounded"
            placeholder="Enter project title"
          />
        </div>
      </div>
      
      {/* Content Grid */}
      <div className="flex flex-grow gap-4">
        {/* Left Column */}
        <div className="flex flex-col w-1/3 gap-4">
          {/* Abstract */}
          <div className="bg-white rounded-lg p-2 flex-1">
            <h2 className="font-bold mb-2">Abstract</h2>
            <textarea
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              className="w-full h-full border border-gray-300 rounded p-2 resize-none text-justify"
              placeholder="Enter abstract"
              style={{ height: 'calc(100% - 30px)' }}
            />
          </div>
          
          {/* Introduction */}
          <div className="bg-white rounded-lg p-2 flex-1">
            <h2 className="font-bold mb-2">Introduction</h2>
            <textarea
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              className="w-full h-full border border-gray-300 rounded p-2 resize-none text-justify"
              placeholder="Enter introduction"
              style={{ height: 'calc(100% - 30px)' }}
            />
          </div>
        </div>
        
        {/* Middle Column */}
        <div className="w-1/3">
          <div className="bg-white rounded-lg p-2 h-full">
            <h2 className="font-bold mb-2">Methodology</h2>
            <textarea
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
              className="w-full h-full border border-gray-300 rounded p-2 resize-none text-justify"
              placeholder="Enter methodology"
              style={{ height: 'calc(100% - 30px)' }}
            />
          </div>
        </div>
        
        {/* Right Column */}
        <div className="flex flex-col w-1/3 gap-4">
          {/* System Architecture */}
          <div className="bg-white rounded-lg p-2 flex-1">
            <h2 className="font-bold mb-2 text-center">System architecture / Model</h2>
            <textarea
              value={systemArchitecture}
              onChange={(e) => setSystemArchitecture(e.target.value)}
              className="w-full h-full border border-gray-300 rounded p-2 resize-none text-justify"
              placeholder="Enter system architecture or upload diagram"
              style={{ height: 'calc(100% - 30px)' }}
            />
          </div>
          
          {/* Result */}
          <div className="bg-white rounded-lg p-2 flex-1">
            <h2 className="font-bold mb-2">Result</h2>
            <textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="w-full h-full border border-gray-300 rounded p-2 resize-none text-justify"
              placeholder="Enter results"
              style={{ height: 'calc(100% - 30px)' }}
            />
          </div>
          
          {/* Conclusion */}
          <div className="bg-white rounded-lg p-2 flex-1">
            <h2 className="font-bold mb-2">Conclusion</h2>
            <textarea
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              className="w-full h-full border border-gray-300 rounded p-2 resize-none text-justify"
              placeholder="Enter conclusion"
              style={{ height: 'calc(100% - 30px)' }}
            />
          </div>
          
          {/* Team Members */}
          <div className="bg-white rounded-lg p-2 flex-1">
            <h2 className="font-bold mb-2">Team Members</h2>
            <textarea
              value={teamMembers}
              onChange={(e) => setTeamMembers(e.target.value)}
              className="w-full h-full border border-gray-300 rounded p-2 resize-none text-center"
              placeholder="Enter team member names"
              style={{ height: 'calc(100% - 30px)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SRMProjectExpo;
