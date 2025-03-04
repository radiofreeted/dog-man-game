// Game environments and their background images
const ENVIRONMENTS = [
    {name: 'Downtown', color: 'bg-blue-200', image: 'downtown.jpg'},
    {name: 'Forest', color: 'bg-green-100', image: 'forest.jpg'},
    {name: 'Beach', color: 'bg-yellow-100', image: 'beach.jpg'},
    {name: 'Restaurant', color: 'bg-amber-50', image: 'restaurant.jpg'},
    {name: 'School', color: 'bg-orange-50', image: 'school.jpg'},
    {name: 'Farm', color: 'bg-green-200', image: 'farm.jpg'},
    {name: 'Bathroom', color: 'bg-blue-50', image: 'bathroom.jpg'},
    {name: 'Space', color: 'bg-gray-900', image: 'space.jpg'},
    {name: 'Jungle', color: 'bg-green-300', image: 'jungle.jpg'},
    {name: 'Toy Store', color: 'bg-purple-100', image: 'toy-store.jpg'},
    {name: 'Castle', color: 'bg-gray-300', image: 'castle.jpg'},
    {name: 'Underwater', color: 'bg-blue-300', image: 'underwater.jpg'},
    {name: 'Desert', color: 'bg-yellow-200', image: 'desert.jpg'},
    {name: 'Candy Land', color: 'bg-pink-100', image: 'candy-land.jpg'},
    {name: 'Police Station', color: 'bg-gray-100', image: 'police-station.jpg'},
    {name: 'Volcano', color: 'bg-red-200', image: 'volcano.jpg'},
    {name: 'Movie Theater', color: 'bg-gray-800', image: 'movie-theater.jpg'},
    {name: 'Ice World', color: 'bg-blue-50', image: 'ice-world.jpg'},
    {name: 'Construction', color: 'bg-yellow-50', image: 'construction.jpg'},
    {name: 'Museum', color: 'bg-amber-100', image: 'museum.jpg'}
];

// Main game component
const DogManGame = () => {
    // Game state
    const [level, setLevel] = React.useState(1);
    const [gameStarted, setGameStarted] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 50, y: 300 });
    const [isJumping, setIsJumping] = React.useState(false);
    const [isAttacking, setIsAttacking] = React.useState(false);
    const [showMap, setShowMap] = React.useState(true);
    const [villainPosition, setVillainPosition] = React.useState({ x: 300, y: 300 });
    const [villainType, setVillainType] = React.useState('lobster');
    const [villainDefeated, setVillainDefeated] = React.useState(false);
    const [showNextButton, setShowNextButton] = React.useState(false);
    const [showVictory, setShowVictory] = React.useState(false);
    const [showFinalBoss, setShowFinalBoss] = React.useState(false);
    const [finalBossDefeated, setFinalBossDefeated] = React.useState(false);
    
    // Get environment/location based on level
    const getEnvironment = () => {
        return ENVIRONMENTS[(level - 1) % ENVIRONMENTS.length];
    };
    
    // Start the game
    const startGame = () => {
        setGameStarted(true);
        setShowMap(true);
    };
    
    // Handle jump - making character go UP, not fall
    const jump = () => {
        if (!isJumping) {
            setIsJumping(true);
            
            // Make character jump upward (decrease Y value)
            setPosition(prev => ({
                ...prev,
                y: prev.y - 70 // Move character UP by 70px
            }));
            
            // Return to original position after jump animation
            setTimeout(() => {
                setPosition(prev => ({
                    ...prev,
                    y: 300 // Return to ground level
                }));
                setIsJumping(false);
            }, 500);
        }
    };
    
    // Handle attack
    const attack = () => {
        if (!isAttacking) {
            setIsAttacking(true);
            
            // Check if close to villain to defeat
            const distance = Math.abs(position.x - villainPosition.x);
            
            if (showFinalBoss && distance < 100 && !finalBossDefeated) {
                setTimeout(() => {
                    setFinalBossDefeated(true);
                    setShowVictory(true);
                }, 1000);
            } else if (distance < 70 && !villainDefeated && !showFinalBoss) {
                setVillainDefeated(true);
                setShowNextButton(true);
            }
            
            setTimeout(() => {
                setIsAttacking(false);
            }, 300);
        }
    };
    
    // Move character
    const moveCharacter = (direction) => {
        setPosition(prev => {
            let newX = prev.x;
            
            if (direction === 'left') {
                newX = Math.max(50, prev.x - 30);
            } else if (direction === 'right') {
                newX = Math.min(window.innerWidth - 50, prev.x + 30);
            }
            
            return { ...prev, x: newX };
        });
    };
    
    // Go to next level
    const nextLevel = () => {
        if (level >= 55) {
            // Show final boss
            setShowFinalBoss(true);
            setVillainDefeated(false);
            setShowNextButton(false);
            setVillainPosition({ x: window.innerWidth / 2, y: 300 });
        } else {
            // Next regular level
            setLevel(prev => prev + 1);
            setVillainDefeated(false);
            setShowNextButton(false);
            
            // Set new villain type based on level
            const villainTypes = ['lobster', 'bear', 'cheetah', 'llama'];
            setVillainType(villainTypes[Math.floor(Math.random() * 4)]);
            
            // Set new villain position
            const newX = Math.floor(Math.random() * (window.innerWidth - 200)) + 200;
            setVillainPosition({ x: newX, y: 300 });
            
            // Show map for new level
            setShowMap(true);
        }
    };
    
    // Restart game
    const restartGame = () => {
        setLevel(1);
        setVillainDefeated(false);
        setShowNextButton(false);
        setShowVictory(false);
        setShowFinalBoss(false);
        setFinalBossDefeated(false);
        setPosition({ x: 50, y: 300 });
        setVillainPosition({ x: 300, y: 300 });
        setVillainType('lobster');
        setShowMap(true);
    };
    
    // Get current environment
    const currentEnvironment = getEnvironment();
    
    // Apply background image or fallback to color
    const getBackgroundStyle = () => {
        try {
            return {
                backgroundImage: `url('images/${currentEnvironment.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            };
        } catch (error) {
            // If image fails to load, use the color as fallback
            return {};
        }
    };
    
    return (
        <div className="flex flex-col h-screen">
            {!gameStarted ? (
                <div className="flex flex-col items-center justify-center h-full bg-blue-100">
                    <h1 className="text-3xl font-bold mb-6">Dog-Man Police Adventure</h1>
                    <div className="mb-8">
                        <svg width="150" height="200" viewBox="0 0 100 140">
                            <g stroke="black" strokeWidth="2" fill="none">
                                {/* Triangle hat with crown pattern */}
                                <path d="M40,20 L60,20 L50,5 Z" />
                                <path d="M45,15 L50,10 L55,15" />
                                
                                {/* Dog head with elongated snout */}
                                <path d="M40,20 L35,40 L50,55 L65,40 L60,20" />
                                
                                {/* Dog nose */}
                                <circle cx="50" cy="55" r="5" fill="black" />
                                
                                {/* Eyes - simple lines */}
                                <line x1="43" y1="35" x2="43" y2="40" />
                                <line x1="57" y1="35" x2="57" y2="40" />
                                
                                {/* Ears */}
                                <path d="M35,25 L25,20 L30,30" />
                                <path d="M65,25 L75,20 L70,30" />
                                
                                {/* Neck lines */}
                                <path d="M43,55 L43,65" />
                                <path d="M47,55 L47,65" />
                                <path d="M53,55 L53,65" />
                                <path d="M57,55 L57,65" />
                                
                                {/* Triangular police uniform/cape */}
                                <path d="M30,65 L50,85 L70,65" />
                                
                                {/* Badge on uniform */}
                                <path d="M45,75 L50,70 L55,75 L50,80 Z" />
                                
                                {/* Arms */}
                                <path d="M30,50 L15,50" />
                                <path d="M70,50 L85,50" />
                                
                                {/* Legs */}
                                <line x1="40" y1="85" x2="40" y2="105" />
                                <line x1="60" y1="85" x2="60" y2="105" />
                                
                                {/* Feet */}
                                <ellipse cx="40" cy="110" rx="8" ry="4" />
                                <ellipse cx="60" cy="110" rx="8" ry="4" />
                            </g>
                        </svg>
                    </div>
                    <button
                        onClick={startGame}
                        className="bg-blue-500 text-white px-6 py-3 text-xl rounded-lg hover:bg-blue-600"
                    >
                        Start Game
                    </button>
                </div>
            ) : (
                <>
                    {/* Game header */}
                    <div className="bg-blue-500 text-white p-2 flex justify-between items-center">
                        <div>
                            <span className="font-bold">Level {level}</span> - {currentEnvironment.name}
                        </div>
                        <button 
                            onClick={() => setShowMap(true)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                            Map
                        </button>
                    </div>
                    
                    {/* Game area */}
                    <div className={`flex-1 relative overflow-hidden game-area ${currentEnvironment.color}`} style={getBackgroundStyle()}>
                        {/* Dog-Man character */}
                        <div 
                            className={`absolute transition-transform ${isJumping ? 'animate-bounce' : ''} ${isAttacking ? 'animate-pulse' : ''}`} 
                            style={{ 
                                left: `${position.x}px`, 
                                top: `${position.y}px`,
                                transform: 'translate(-50%, -100%)',
                                zIndex: 10
                            }}
                        >
                            <svg width="70" height="90" viewBox="0 0 100 140">
                                <g stroke="black" strokeWidth="2" fill="none">
                                    {/* Triangle hat with crown pattern */}
                                    <path d="M40,20 L60,20 L50,5 Z" />
                                    <path d="M45,15 L50,10 L55,15" />
                                    
                                    {/* Dog head with elongated snout */}
                                    <path d="M40,20 L35,40 L50,55 L65,40 L60,20" />
                                    
                                    {/* Dog nose */}
                                    <circle cx="50" cy="55" r="5" fill="black" />
                                    
                                    {/* Eyes - simple lines */}
                                    <line x1="43" y1="35" x2="43" y2="40" />
                                    <line x1="57" y1="35" x2="57" y2="40" />
                                    
                                    {/* Ears */}
                                    <path d="M35,25 L25,20 L30,30" />
                                    <path d="M65,25 L75,20 L70,30" />
                                    
                                    {/* Neck lines */}
                                    <path d="M43,55 L43,65" />
                                    <path d="M47,55 L47,65" />
                                    <path d="M53,55 L53,65" />
                                    <path d="M57,55 L57,65" />
                                    
                                    {/* Triangular police uniform/cape */}
                                    <path d="M30,65 L50,85 L70,65" />
                                    
                                    {/* Badge on uniform */}
                                    <path d="M45,75 L50,70 L55,75 L50,80 Z" />
                                    
                                    {/* Arms */}
                                    <path d="M30,50 L15,50" />
                                    <path d="M70,50 L85,50" />
                                    
                                    {/* Legs */}
                                    <line x1="40" y1="85" x2="40" y2="105" />
                                    <line x1="60" y1="85" x2="60" y2="105" />
                                    
                                    {/* Feet */}
                                    <ellipse cx="40" cy="110" rx="8" ry="4" />
                                    <ellipse cx="60" cy="110" rx="8" ry="4" />
                                </g>
                            </svg>
                        </div>
                        
                        {/* Villain */}
                        {!villainDefeated && !showFinalBoss && (
                            <div 
                                className="absolute"
                                style={{ 
                                    left: `${villainPosition.x}px`, 
                                    top: `${villainPosition.y}px`,
                                    transform: 'translate(-50%, -100%)',
                                    zIndex: 5
                                }}
                            >
                                <svg width="70" height="90" viewBox="0 0 100 140">
                                    <g stroke="black" strokeWidth="2" fill={
                                        villainType === 'lobster' ? "#ff6b6b" : 
                                        villainType === 'bear' ? "#a0522d" : 
                                        villainType === 'cheetah' ? "#f9ca24" : 
                                        "#dfe6e9"
                                    }>
                                        {/* Villain head */}
                                        <path d="M40,30 L50,10 L60,30 Z" />
                                        
                                        {/* Villain body */}
                                        <rect x="40" y="30" width="20" height="50" />
                                        
                                        {/* Villain features based on type */}
                                        {villainType === 'lobster' && (
                                            <path d="M30,40 L10,50 M70,40 L90,50" strokeWidth="3" fill="none" />
                                        )}
                                        
                                        {villainType === 'bear' && (
                                            <g>
                                                <circle cx="35" cy="15" r="8" />
                                                <circle cx="65" cy="15" r="8" />
                                            </g>
                                        )}
                                        
                                        {villainType === 'cheetah' && (
                                            <g fill="black">
                                                <circle cx="45" cy="40" r="3" />
                                                <circle cx="55" cy="40" r="3" />
                                                <circle cx="50" cy="50" r="3" />
                                            </g>
                                        )}
                                        
                                        {villainType === 'llama' && (
                                            <path d="M50,30 C40,10 60,10 50,30" fill="none" />
                                        )}
                                        
                                        {/* Villain arms */}
                                        <line x1="40" y1="40" x2="25" y2="50" />
                                        <line x1="60" y1="40" x2="75" y2="50" />
                                        
                                        {/* Villain legs */}
                                        <line x1="45" y1="80" x2="40" y2="100" />
                                        <line x1="55" y1="80" x2="60" y2="100" />
                                    </g>
                                </svg>
                            </div>
                        )}
                        
                        {/* Final Boss */}
                        {showFinalBoss && !finalBossDefeated && (
                            <div 
                                className="absolute"
                                style={{ 
                                    left: `${villainPosition.x}px`, 
                                    top: `${villainPosition.y}px`,
                                    transform: 'translate(-50%, -100%)',
                                    zIndex: 5
                                }}
                            >
                                <svg width="100" height="120" viewBox="0 0 100 140">
                                    <g stroke="black" strokeWidth="3" fill="purple">
                                        {/* 100 55s - combination of all villains */}
                                        <path d="M30,30 L50,10 L70,30 Z" />
                                        
                                        {/* Multiple arms */}
                                        <line x1="30" y1="50" x2="10" y2="40" strokeWidth="3" />
                                        <line x1="30" y1="60" x2="10" y2="70" strokeWidth="3" />
                                        <line x1="70" y1="50" x2="90" y2="40" strokeWidth="3" />
                                        <line x1="70" y1="60" x2="90" y2="70" strokeWidth="3" />
                                        
                                        {/* Boss body */}
                                        <rect x="30" y="30" width="40" height="60" />
                                        
                                        {/* Boss text */}
                                        <text x="50" y="60" textAnchor="middle" fill="white" fontSize="12">100</text>
                                        <text x="50" y="75" textAnchor="middle" fill="white" fontSize="12">55s</text>
                                        
                                        {/* Boss legs */}
                                        <line x1="40" y1="90" x2="30" y2="120" strokeWidth="3" />
                                        <line x1="60" y1="90" x2="70" y2="120" strokeWidth="3" />
                                    </g>
                                </svg>
                            </div>
                        )}
                        
                        {/* "Next" button when villain is defeated */}
                        {showNextButton && (
                            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
                                <button
                                    onClick={nextLevel}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-lg animate-bounce"
                                >
                                    Next Level!
                                </button>
                            </div>
                        )}
                        
                        {/* Victory screen */}
                        {showVictory && (
                            <div className="absolute inset-0 bg-blue-500 bg-opacity-80 flex flex-col items-center justify-center">
                                <h2 className="text-3xl font-bold text-white mb-4">YOU ARE THE CHAMPION!</h2>
                                <p className="text-white text-lg mb-6">You defeated all 55 levels and 100 55s!</p>
                                <button
                                    onClick={restartGame}
                                    className="bg-yellow-500 text-white px-6 py-3 rounded-lg text-xl"
                                >
                                    Play Again
                                </button>
                            </div>
                        )}
                        
                        {/* Treasure map */}
                        {showMap && (
                            <div className="absolute inset-0 bg-yellow-100 bg-opacity-90 flex items-center justify-center z-50">
                                <div className="bg-yellow-200 p-4 rounded-lg border-2 border-yellow-900 w-5/6 max-w-md">
                                    <h2 className="text-xl font-bold mb-2 text-center">Chief's Map</h2>
                                    <div className="border-2 border-yellow-900 p-4 bg-yellow-50">
                                        <svg viewBox="0 0 200 200" className="w-full">
                                            {/* Treasure map */}
                                            <rect x="10" y="10" width="180" height="180" fill="none" stroke="brown" strokeWidth="2" />
                                            
                                            {/* Path */}
                                            <path d="M20,180 C50,150 70,160 100,120 C130,80 150,60 180,20" 
                                                stroke="brown" strokeWidth="2" strokeDasharray="5,5" fill="none" />
                                            
                                            {/* Current position */}
                                            <circle cx={20 + (level * 160/55)} cy={180 - (level * 160/55)} r="8" fill="blue" />
                                            
                                            {/* X marks the spot */}
                                            <text x={20 + ((level+1) * 160/55)} y={180 - ((level+1) * 160/55)} 
                                                fontSize="15" fill="red" fontWeight="bold">X</text>
                                            
                                            {/* Location indicator */}
                                            <text x="100" y="100" fontSize="14" textAnchor="middle" fill="brown">{currentEnvironment.name}</text>
                                        </svg>
                                    </div>
                                    <div className="text-center mt-4">
                                        <p className="mb-2">Find the villain in {currentEnvironment.name}!</p>
                                        <button 
                                            onClick={() => setShowMap(false)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                        >
                                            Close Map
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Game controls */}
                    <div className="bg-gray-200 p-2 grid grid-cols-2 gap-2">
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onTouchStart={() => moveCharacter('left')}
                                onClick={() => moveCharacter('left')}
                                className="bg-blue-400 text-white rounded-lg p-4 text-center active:bg-blue-600"
                            >
                                ← Left
                            </button>
                            <button
                                onTouchStart={() => moveCharacter('right')}
                                onClick={() => moveCharacter('right')}
                                className="bg-blue-400 text-white rounded-lg p-4 text-center active:bg-blue-600"
                            >
                                Right →
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onTouchStart={jump}
                                onClick={jump}
                                className="bg-green-500 text-white rounded-lg p-4 text-center active:bg-green-700"
                            >
                                Jump ↑
                            </button>
                            <button
                                onTouchStart={attack}
                                onClick={attack}
                                className="bg-red-500 text-white rounded-lg p-4 text-center active:bg-red-700"
                            >
                                Fight
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

ReactDOM.render(<DogManGame />, document.getElementById('root'));
