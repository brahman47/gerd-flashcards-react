import React, { useState, useEffect, useCallback } from 'react';
// Assuming lucide-react is available in the environment
// If not, you might need to install it: npm install lucide-react
import { Check, X, RotateCw, ArrowLeft, Play } from 'lucide-react';

// Data extracted from the GERD flashcards document - NOW WITH EMOJIS!
const flashcardsData = [
    // What is GERD?
  { id: 1, front: 'What is GERD?', back: 'Gastroesophageal Reflux Disease: A chronic digestive disorder where stomach acid or content flows back (refluxes) into the esophagus, irritating its lining.', emoji: '🔥' },
  { id: 2, front: 'What is the LES?', back: 'Lower Esophageal Sphincter: A ring of muscle at the bottom of the esophagus that normally acts as a one-way valve to prevent reflux.', emoji: '🚪' },
  { id: 3, front: 'What happens to the LES in GERD?', back: 'The LES may relax abnormally or weaken, allowing stomach contents to flow back into the esophagus.', emoji: '😥' },
  // Causes and Risk Factors
  { id: 4, front: 'What is a hiatal hernia?', back: 'A condition where part of the stomach pushes up through the diaphragm, potentially impairing LES function and increasing GERD risk.', emoji: '⬆️' },
  { id: 5, front: 'How does obesity contribute to GERD?', back: 'Excess abdominal weight increases pressure on the stomach, which can force acid upward.', emoji: '⚖️' },
  { id: 6, front: 'List common dietary triggers for GERD.', back: 'Fatty/fried foods, chocolate, peppermint, coffee/caffeine, alcohol, tomato products, citrus fruits, spicy foods.', emoji: '🍔🌶️🍫☕' },
  { id: 7, front: 'How does smoking affect GERD?', back: 'Nicotine relaxes the LES, reduces acid-neutralizing saliva, and irritates the esophagus.', emoji: '🚬' },
  { id: 8, front: 'Why can pregnancy cause GERD?', back: 'Hormonal changes and increased abdominal pressure can lead to temporary GERD.', emoji: '🤰' },
  { id: 9, front: 'What types of medications can worsen GERD?', back: 'Certain asthma drugs, calcium channel blockers, antihistamines, painkillers, sedatives, and antidepressants.', emoji: '💊' },
  { id: 10, front: 'What is delayed stomach emptying (gastroparesis)?', back: 'A condition where the stomach empties slowly, increasing the risk of reflux.', emoji: '⏳' },
  // Recognizing the Symptoms
  { id: 11, front: 'What is the most common symptom of GERD?', back: 'Heartburn: A burning sensation in the chest, often after eating or when lying down.', emoji: '❤️‍🔥' },
  { id: 12, front: 'What is regurgitation in GERD?', back: 'A sour or bitter taste in the mouth/throat due to backed-up stomach acid or food.', emoji: '🤢' },
  { id: 13, front: 'What is dysphagia?', back: 'Difficulty swallowing or the sensation of food being stuck in the throat.', emoji: '😟' },
  { id: 14, front: 'What are some respiratory/throat symptoms of GERD?', back: 'Chronic cough (especially at night), laryngitis, hoarseness, worsening asthma.', emoji: '😮‍💨' },
  { id: 15, front: 'Can GERD cause chest pain?', back: 'Yes, non-cardiac chest pain that can sometimes mimic heart issues. (Seek medical attention for any chest pain).', emoji: '💔' },
  { id: 16, front: 'List other potential symptoms of GERD.', back: 'Nausea, globus sensation (lump in throat), dental erosion, sleep disturbances.', emoji: '🦷😴' },
  { id: 17, front: 'Do all GERD patients experience heartburn?', back: 'No, some may only have atypical symptoms like chronic cough or hoarseness.', emoji: '🗣️' },
  // Diagnosis
  { id: 18, front: 'How is GERD often initially diagnosed?', back: 'Based on a review of symptoms and medical history.', emoji: '📝' },
  { id: 19, front: 'What is an Upper Endoscopy (EGD)?', back: 'A procedure using a camera on a flexible tube to visually inspect the esophagus, stomach, and duodenum for inflammation, ulcers, strictures, or Barrett\'s esophagus. Biopsies can be taken.', emoji: '🔬' },
  { id: 20, front: 'What is the Ambulatory Acid (pH) Probe Test?', back: 'A test using a monitor in the esophagus to measure acid reflux frequency and duration over 24-48 hours; considered the gold standard for diagnosis, especially with atypical symptoms.', emoji: '🧪' },
  { id: 21, front: 'What does Esophageal Manometry measure?', back: 'Measures muscle contractions (peristalsis) and LES pressure in the esophagus. Often done before surgery.', emoji: '🩺' },
  { id: 22, front: 'What is a Barium Swallow (Esophagram)?', back: 'An X-ray procedure using barium contrast to visualize the upper digestive tract and identify structural issues like hiatal hernias or strictures.', emoji: '☢️' },
  // Treatment: Lifestyle and Dietary Changes
  { id: 23, front: 'What is the first line of defense in treating GERD?', back: 'Lifestyle and dietary modifications.', emoji: '🛡️' },
  { id: 24, front: 'List key lifestyle changes for GERD management.', back: 'Weight management, avoiding trigger foods, eating smaller meals, avoiding late-night eating, elevating the head of the bed, smoking cessation, avoiding tight clothing.', emoji: '🚶‍♀️🥗🚭' },
  // Treatment: Medications
  { id: 25, front: 'How do Antacids work for GERD?', back: 'Neutralize stomach acid for quick, short-term relief. Not for healing damage.', emoji: '🩹' },
  { id: 26, front: 'How do H2 Receptor Blockers work?', back: 'Reduce stomach acid production. Provide longer relief than antacids but are less potent than PPIs. (e.g., famotidine).', emoji: ' H₂' }, // Text emoji as placeholder
  { id: 27, front: 'How do Proton Pump Inhibitors (PPIs) work?', back: 'Strongly reduce stomach acid production, effective for healing esophagitis. (e.g., omeprazole, pantoprazole). Long-term use requires discussion with a doctor.', emoji: ' P+' }, // Text emoji as placeholder
  { id: 28, front: 'What do Prokinetics do?', back: 'Help the stomach empty faster and may strengthen the LES. Used less commonly due to side effects.', emoji: '⏩' },
  // Treatment: Surgery and Procedures
  { id: 29, front: 'When might surgery be considered for GERD?', back: 'When lifestyle changes and medications are insufficient, or if long-term medication is undesirable.', emoji: '❓' },
  { id: 30, front: 'What is Fundoplication?', back: 'Surgery where the top of the stomach (fundus) is wrapped around the lower esophagus to reinforce the LES. Often done laparoscopically.', emoji: '👨‍⚕️' },
  { id: 31, front: 'What is the LINX device?', back: 'A ring of magnetic beads placed around the esophagus-stomach junction to prevent reflux while allowing food passage.', emoji: '🔗' },
  { id: 32, front: 'What is Transoral Incisionless Fundoplication (TIF)?', back: 'A less invasive, endoscopic procedure to reconstruct the valve at the bottom of the esophagus.', emoji: '✨' },
  // Potential Complications
  { id: 33, front: 'What is Esophagitis?', back: 'Inflammation of the esophagus caused by acid reflux, potentially leading to pain, bleeding, or ulcers.', emoji: '💥' },
  { id: 34, front: 'What is an Esophageal Stricture?', back: 'Narrowing of the esophagus due to chronic inflammation and scarring, causing difficulty swallowing.', emoji: '↔️' }, // Narrowed emoji
  { id: 35, front: 'What is Barrett\'s Esophagus?', back: 'A precancerous condition where the esophageal lining changes due to chronic acid exposure, increasing esophageal cancer risk.', emoji: '⚠️' },
  { id: 36, front: 'What serious condition is linked to chronic GERD and Barrett\'s Esophagus?', back: 'Esophageal Adenocarcinoma (a type of esophageal cancer).', emoji: '♋' }, // Cancer sign
  { id: 37, front: 'What respiratory problems can GERD cause?', back: 'Aspiration of acid can cause or worsen asthma, chronic bronchitis, pneumonia, or pulmonary fibrosis.', emoji: '🫁' }, // Lungs
];


// Fisher-Yates (Knuth) Shuffle Algorithm
function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

/**
 * Represents a single flashcard component for the study grid.
 */
function Flashcard({ front, back, emoji }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="flashcard-container w-full h-64 perspective cursor-pointer group" onClick={handleFlip}>
      <div className={`flashcard-inner w-full h-full relative text-center transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front face */}
        <div className="flashcard-face flashcard-front absolute w-full h-full backface-hidden bg-white border border-gray-200 rounded-lg shadow-md group-hover:shadow-xl transition-shadow p-4 flex flex-col items-center justify-center">
           {emoji && <span className="text-4xl mb-2" role="img" aria-label="Flashcard icon">{emoji}</span>}
          <p className="text-lg font-medium text-gray-800">{front}</p>
        </div>
        {/* Back face */}
        <div className="flashcard-face flashcard-back absolute w-full h-full backface-hidden bg-blue-100 border border-blue-200 rounded-lg shadow-md group-hover:shadow-xl transition-shadow p-4 flex items-center justify-center rotate-y-180">
          <p className="text-base text-blue-900">{back}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Represents the display area for a single card during the test mode.
 */
function TestCardDisplay({ front, back, emoji, isFlipped, onFlip }) {
    return (
      // Container takes full width within its parent (max-w-lg in TestMode)
      <div className="flashcard-container w-full perspective cursor-pointer group" onClick={onFlip}>
        <div className={`flashcard-inner w-full h-full relative text-center transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front face */}
          <div className="flashcard-face flashcard-front absolute w-full h-full backface-hidden bg-white border border-gray-300 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center min-h-[10rem]">
             {emoji && <span className="text-5xl mb-3" role="img" aria-label="Flashcard icon">{emoji}</span>}
            <p className="text-xl font-semibold text-gray-800">{front}</p>
          </div>
          {/* Back face */}
          <div className="flashcard-face flashcard-back absolute w-full h-full backface-hidden bg-indigo-100 border border-indigo-200 rounded-lg shadow-lg p-6 flex items-center justify-center rotate-y-180 min-h-[10rem]">
            <p className="text-lg text-indigo-900">{back}</p>
          </div>
        </div>
      </div>
    );
}


/**
 * Component for the Test Mode functionality.
 */
function TestMode({ cards, setView }) {
  const [testCards, setTestCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isTestCardFlipped, setIsTestCardFlipped] = useState(false);

  // Initialize test: Shuffle cards and reset state
  const startTest = useCallback(() => {
    setTestCards(shuffleArray([...cards]));
    setCurrentCardIndex(0);
    setScore(0);
    setShowResults(false);
    setIsTestCardFlipped(false);
  }, [cards]);

  useEffect(() => {
    startTest();
  }, [startTest]);

  // Handle flipping the test card
  const handleFlipTestCard = () => {
    setIsTestCardFlipped(!isTestCardFlipped);
  };

  // Handle marking card as correct or incorrect
  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    if (currentCardIndex < testCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsTestCardFlipped(false);
    } else {
      setShowResults(true);
    }
  };

  // Render results view
  if (showResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 bg-white rounded-lg shadow-xl max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">Test Complete!</h2>
        <p className="text-xl text-gray-700 mb-6">
          Your score: <span className="font-bold text-indigo-600">{score}</span> / {testCards.length}
        </p>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
           <button
            onClick={startTest}
            className="flex items-center justify-center px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 hover:shadow-md transition duration-300 ease-in-out"
          >
            <RotateCw size={18} className="mr-2" /> Restart Test
          </button>
           <button
            onClick={() => setView('study')}
            className="flex items-center justify-center px-5 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 hover:shadow-md transition duration-300 ease-in-out"
          >
             <ArrowLeft size={18} className="mr-2" /> Back to Study
          </button>
        </div>
      </div>
    );
  }

  // Render test view (if cards are loaded)
  if (testCards.length === 0) {
    return <div className="text-center p-10">Loading Test...</div>;
  }

  const currentCard = testCards[currentCardIndex];

  return (
    // Main container for test mode: flex-col, takes min screen height, relative for back button
    <div className="flex flex-col min-h-[calc(100vh-4rem)] p-4 sm:p-6 relative"> {/* Adjust min-h as needed */}
       {/* Back button positioned top-left */}
       <button
          onClick={() => setView('study')}
          className="absolute top-4 left-4 flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-sm hover:shadow-md hover:bg-gray-300 transition duration-300 ease-in-out z-10"
          aria-label="Back to Study Grid"
        >
           <ArrowLeft size={18} className="mr-1" /> Study
        </button>

      {/* Content Area: Takes available space (flex-grow), centers card */}
      <div className="flex-grow flex flex-col items-center justify-center w-full pt-10"> {/* pt-10 to give space below header/back button */}
          <p className="text-lg font-medium text-gray-600 mb-4 text-center">
            Card {currentCardIndex + 1} of {testCards.length} | Score: {score}
          </p>

          {/* Card Container: Constrained width */}
          <div className="w-full max-w-lg">
              <TestCardDisplay
                front={currentCard.front}
                back={currentCard.back}
                emoji={currentCard.emoji}
                isFlipped={isTestCardFlipped}
                onFlip={handleFlipTestCard}
              />
          </div>
      </div>

      {/* Button/Action Area: Pushed to bottom (no flex-grow), centered content */}
      <div className="w-full flex justify-center pt-4 pb-6"> {/* Padding top/bottom */}
          <div className="flex justify-center space-x-4 h-10 items-center"> {/* Fixed height h-10 to prevent jump */}
              {/* Action buttons appear only after flipping the card */}
              {isTestCardFlipped && (
                  <>
                      <button
                        onClick={() => handleAnswer(false)} // Incorrect
                        className="flex items-center justify-center px-5 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 hover:shadow-md transition duration-300 ease-in-out"
                        aria-label="Mark as Incorrect"
                      >
                        <X size={20} className="mr-1.5" /> Incorrect
                      </button>
                      <button
                        onClick={() => handleAnswer(true)} // Correct
                        className="flex items-center justify-center px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 hover:shadow-md transition duration-300 ease-in-out"
                        aria-label="Mark as Correct"
                      >
                         <Check size={20} className="mr-1.5" /> Correct
                      </button>
                  </>
              )}
               {/* Instruction to flip the card (shown when buttons are hidden) */}
               {!isTestCardFlipped && (
                   <p className="text-gray-500 animate-pulse">
                    Click the card to see the answer
                   </p>
               )}
           </div>
       </div>
    </div> // End of main test mode container
  );
}


/**
 * Main application component.
 * Handles view switching between Study and Test modes.
 * *** UPDATED HEADER FOR RESPONSIVE BUTTON PLACEMENT ***
 */
function App() {
  const [view, setView] = useState('study');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-sans relative overflow-hidden"> {/* Changed padding structure */}
      {/* Custom styles */}
      <style>{`
          .perspective { perspective: 1000px; }
          .transform-style-3d { transform-style: preserve-3d; }
          .rotate-y-180 { transform: rotateY(180deg); }
          .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
          /* Ensure the inner card stretches to the container height if needed */
          .flashcard-inner { height: 100%; }
      `}</style>

      {/* Apply padding within each view now */}
      {view === 'study' && (
        <div className="p-4 sm:p-8"> {/* Padding applied here */}
          {/* Header section - NOW handles responsive button */}
          <header className="text-center mb-8 sm:mb-12 relative"> {/* Added relative positioning */}

            {/* Title and Subtitle */}
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-blue-700">GERD Study Flashcards</h1>
                <p className="text-gray-600 mt-2">Click on a card to flip it!</p>
            </div>

             {/* Start Test Button - ABSOLUTE POSITIONED (Desktop - sm and up) */}
             {/* Hidden on mobile (below sm), visible as flex on sm and up */}
             <button
               onClick={() => setView('test')}
               className="absolute top-0 right-0 mt-0 mr-0 hidden sm:flex items-center justify-center px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 hover:shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
               aria-label="Start Test Mode"
             >
                <Play size={18} className="mr-2"/> Start Test
             </button>

             {/* Start Test Button - IN FLOW (Mobile - below sm) */}
             {/* Visible as flex on mobile (below sm), hidden on sm and up */}
             <div className="mt-4 flex justify-center sm:hidden"> {/* Centering container for mobile button */}
                 <button
                   onClick={() => setView('test')}
                   className="flex items-center justify-center px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 hover:shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                   aria-label="Start Test Mode"
                 >
                    <Play size={18} className="mr-2"/> Start Test
                 </button>
             </div>

          </header>

          {/* Grid container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {flashcardsData.map((card) => (
              <Flashcard
                key={card.id}
                front={card.front}
                back={card.back}
                emoji={card.emoji}
              />
            ))}
          </div>

          {/* Footer */}
          <footer className="text-center mt-12 text-gray-500 text-sm">
            Flashcard data based on the provided GERD article.
          </footer>
        </div>
      )}

      {/* Render Test Mode component */}
      {view === 'test' && (
        // TestMode now handles its own internal padding
        <TestMode cards={flashcardsData} setView={setView} />
      )}
    </div>
  );
}

export default App;
