// frontend/src/pages/home.tsx
import { useNavigate } from "react-router-dom";
import chessboard from "../assets/chessbaord.webp";
import { Button } from "../ui/button";

export const Landing = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-center">
      <div className="pt-8 max-w-screen-lg w-full px-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex justify-center p-8">
            <img className="h-fit" src={chessboard} alt="chess board" />
          </div>
          <div className="pt-16">
            <h1 className="text-3xl font-bold text-white mb-6">
              Welcome to Chess - India's #2 chess site
            </h1>

            <p className="mt-4 text-white text-lg">
              Play chess online against players from around the world or challenge our computer AI at different difficulty levels.
            </p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700 p-6  rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-white mb-3">Play Online</h2>
                <p className="text-gray-300 mb-4">
                  Challenge real players from around the world in real-time matches.
                </p>
                <div className="pt-6">
                <Button
                  varient="primary"
                  onClick={() => navigate("/game")}
                  text="Play Online"
                  size="lg"
                />
                </div>
              </div>
              
              <div className="bg-slate-700 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-white mb-3">Play Computer</h2>
                <p className="text-gray-300 mb-4">
                  Practice your skills against our AI with adjustable difficulty levels.
                </p>
                <Button
                  varient="secondary"
                  onClick={() => navigate("/play-computer")}
                  text="Play Computer"
                  size="lg"
                />
              </div>
            </div>
            
            <div className="mt-8 bg-slate-700 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-white mb-3">Improve Your Game</h2>
              <p className="text-gray-300">
                Whether you're a beginner or an experienced player, our platform offers:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-300">
                <li>Intuitive game interface</li>
                <li>Multiple difficulty levels when playing against AI</li>
                <li>Real-time matches with players worldwide</li>
                <li>Ability to analyze your games</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};