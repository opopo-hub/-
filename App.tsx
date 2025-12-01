import React, { useState, useEffect, useRef } from 'react';
import { GamePhase, PlayerStats, Pokemon, Question, LeaderboardEntry, Boss } from './types';
import { POKEMON_CONFIG, DIALGA_CONFIG, SHOP_CONFIG, CHARIZARD_MOVES } from './constants';
import { generateRound1Questions, generateRound2Questions, calculateDamage } from './services/gameLogic';
import { PokemonDisplay } from './components/PokemonDisplay';
import { QuizGame } from './components/QuizGame';
import { HealthBar } from './components/HealthBar';
import { Shop } from './components/Shop';
import { BossBattle } from './components/BossBattle';
import { Leaderboard } from './components/Leaderboard';
import { Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  // Game State
  const [phase, setPhase] = useState<GamePhase>(GamePhase.INTRO);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  
  // Stats
  const [stats, setStats] = useState<PlayerStats>({
    hp: 80,
    maxHp: 80,
    score: 0,
    streak: 0,
    inventory: { oranBerry: 0 },
    name: 'Player'
  });

  // Pokemon
  const [pokemon, setPokemon] = useState<Pokemon>({
    stage: 0, // Charmander
    isShiny: false
  });

  // Boss
  const [boss, setBoss] = useState<Boss>({
    hp: 610,
    maxHp: 610
  });

  // Battle Specifics
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [moveUsage, setMoveUsage] = useState<Record<string, number>>({});
  
  // UI Effects
  const [isHit, setIsHit] = useState(false);
  const [isBossHit, setIsBossHit] = useState(false); // Visual state for boss taking damage
  const [evolutionMessage, setEvolutionMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerNameInput, setPlayerNameInput] = useState('');

  // Audio Control
  useEffect(() => {
    if (audioRef.current) {
      if (phase === GamePhase.BOSS_BATTLE) {
        // Boss battle volume
        audioRef.current.volume = 0.5;
      } else {
        // Normal volume
        audioRef.current.volume = 0.3;
      }
      if (!isMuted) {
          audioRef.current.play().catch(() => { /* Auto-play policy */ });
      } else {
          audioRef.current.pause();
      }
    }
  }, [phase, isMuted]);

  // Load Leaderboard
  useEffect(() => {
    const saved = localStorage.getItem('dragon_music_leaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
  }, []);

  const saveScore = (name: string, score: number) => {
    const newEntry: LeaderboardEntry = { name, score, date: new Date().toISOString() };
    const newLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    setLeaderboard(newLeaderboard);
    localStorage.setItem('dragon_music_leaderboard', JSON.stringify(newLeaderboard));
  };

  // Sound Effect System
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    return audioCtxRef.current;
  };

  const generateThudSound = (ctx: AudioContext, startTime: number, volume: number = 1.0) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Low frequency triangle wave for "Thud"
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, startTime);
    osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.1);
    
    // Envelope
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
    
    osc.start(startTime);
    osc.stop(startTime + 0.3);
  };

  const playSoundEffect = (type: 'impact' | 'cry' | 'defeat', isCritical: boolean = false) => {
    if (isMuted) return;

    if (type === 'defeat') {
        // Cat hiss when Boss dies
        const audio = new Audio('https://actions.google.com/sounds/v1/animals/cat_hiss.ogg');
        audio.volume = 0.8;
        audio.play().catch(e => console.error("Defeat sound failed", e));
        return;
    }

    const ctx = getAudioContext();
    if (!ctx) return;
    
    // Ensure context is running (browsers suspend it until user interaction)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (type === 'cry') {
      const cries = [
        'https://actions.google.com/sounds/v1/animals/tiger_roar.ogg',
        'https://actions.google.com/sounds/v1/animals/grey_wolf_howl.ogg',
        'https://actions.google.com/sounds/v1/animals/cat_hiss.ogg'
      ];
      const selected = cries[Math.floor(Math.random() * cries.length)];
      const audio = new Audio(selected);
      audio.volume = 0.6;
      audio.play().catch(e => console.error("Cry play failed", e));
    } else if (type === 'impact') {
        const now = ctx.currentTime;
        
        // Initial Hit
        generateThudSound(ctx, now, 1.0);

        if (isCritical) {
            // Echo Effect: Repeat the sound 8 times over 2 seconds
            // 2000ms / 8 = 250ms interval
            for (let i = 1; i <= 8; i++) {
                const delay = i * 0.25; // 0.25, 0.5, ... 2.0
                const decayVolume = Math.max(0, 1.0 - (i * 0.12)); // Volume fades out
                generateThudSound(ctx, now + delay, decayVolume);
            }
        }
    }
  };

  const handleRestart = () => {
    window.location.reload();
  };

  const startGame = () => {
    if (!playerNameInput.trim()) return alert("이름을 입력해주세요!");
    
    // Initialize Audio Context on user interaction
    getAudioContext();
    
    setStats(prev => ({ ...prev, name: playerNameInput }));
    setQuestions(generateRound1Questions());
    setPhase(GamePhase.ROUND_1);
  };

  const handleAnswer = (value: any) => {
    const currentQ = questions[currentQIndex];
    if (currentQ.correctValue === value) {
      // Correct
      const interest = stats.streak > 0 ? Math.pow(1.1, stats.streak) : 1;
      const points = 20 * interest;
      
      setStats(prev => ({
        ...prev,
        score: prev.score + points,
        streak: prev.streak + 1
      }));

      nextQuestion();
    } else {
      // Wrong
      takeDamage();
    }
  };

  const takeDamage = () => {
    const { dmg, msg } = calculateDamage();
    const isCritical = dmg === 45; // Critical hit condition defined in gameLogic

    playSoundEffect('impact', isCritical);
    
    // Animation trigger
    setIsHit(true);
    setTimeout(() => setIsHit(false), 500);

    setStats(prev => {
      const newHp = prev.hp - dmg;
      if (newHp <= 0) {
        setTimeout(() => setPhase(GamePhase.GAME_OVER), 1000);
        return { ...prev, hp: 0, streak: 0 };
      }
      return { ...prev, hp: newHp, streak: 0 };
    });

    if (phase === GamePhase.BOSS_BATTLE) {
         addBattleLog(`디아루가의 공격! ${msg ? msg : ''} (-${dmg} HP)`);
    } else {
        if (msg) alert(msg);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      // Round Complete
      handleRoundCompletion();
    }
  };

  const handleRoundCompletion = () => {
    evolvePokemon();
  };

  const evolvePokemon = () => {
    const nextStage = pokemon.stage + 1;
    
    if (nextStage > 2) {
      // Start Boss Battle
      setPhase(GamePhase.PRE_BOSS);
      setTimeout(() => setPhase(GamePhase.BOSS_BATTLE), 3000);
      return;
    }

    let isShiny = pokemon.isShiny;
    let shinyText = "";

    // Shiny roll if not already shiny
    if (!isShiny) {
       const roll = Math.random();
       if (roll <= 0.04) {
           isShiny = true;
           shinyText = "이로치 포켓몬이 나왔다!!! ";
       }
    }

    const nextConfig = POKEMON_CONFIG[nextStage as 0|1|2];
    const prevConfig = POKEMON_CONFIG[pokemon.stage];
    
    const evolveMsg = isShiny 
        ? `${shinyText}이로치 포켓몬 ${prevConfig.name}가 ${nextConfig.name}로 진화했다!!`
        : `일반 포켓몬 ${prevConfig.name}가 ${nextConfig.name}로 진화했다!`;

    setEvolutionMessage(evolveMsg);
    setPhase(GamePhase.EVOLUTION);
    
    // Update stats
    setPokemon({ stage: nextStage as 0|1|2, isShiny });
    setStats(prev => ({ ...prev, maxHp: nextConfig.maxHp, hp: nextConfig.maxHp }));
    
    setTimeout(() => {
        setEvolutionMessage(null);
        if (nextStage === 1) {
            setQuestions(generateRound2Questions());
            setCurrentQIndex(0);
            setPhase(GamePhase.ROUND_2);
        } else if (nextStage === 2) {
             setPhase(GamePhase.PRE_BOSS);
             setTimeout(() => setPhase(GamePhase.BOSS_BATTLE), 3000);
        }
    }, 4000);
  };

  // Boss Battle Logic
  const handleBossAttack = (moveId: string) => {
     if (!isPlayerTurn) return;
     
     const move = CHARIZARD_MOVES.find(m => m.id === moveId);
     if (!move) return;

     // Update usage
     const currentUsage = moveUsage[moveId] || 0;
     if (move.maxUses !== Infinity && currentUsage >= move.maxUses) return;

     setMoveUsage(prev => ({...prev, [moveId]: currentUsage + 1}));
     
     // Play Attack Cry
     playSoundEffect('cry');

     // Deal damage to Boss
     setBoss(prev => {
        const newHp = Math.max(0, prev.hp - move.damage);
        return { ...prev, hp: newHp };
     });

     // Trigger Boss Hit Visual
     setIsBossHit(true);
     setTimeout(() => setIsBossHit(false), 500);

     // Play Impact Sound shortly after
     setTimeout(() => playSoundEffect('impact'), 300);

     addBattleLog(`${pokemon.isShiny ? '이로치 ' : ''}리자몽의 ${move.name}! 디아루가에게 ${move.damage} 데미지.`);

     setIsPlayerTurn(false);

     // Check Win
     if (boss.hp - move.damage <= 0) {
         playSoundEffect('defeat'); // Play defeat sound
         setTimeout(handleVictory, 1500); // Delay victory to let sound play
     } else {
         setTimeout(bossTurn, 1500);
     }
  };

  const bossTurn = () => {
      // Pick random move
      const moves = DIALGA_CONFIG.moves;
      
      // Weighted random Logic:
      // 0: 용의 숨결 (10%)
      // 1: 메탈크로우 (20%)
      // 2: 용성군 (30%)
      // 3: 아이언헤드 (40%)
      const rand = Math.random();
      let moveIndex = 0;
      
      if (rand < 0.1) moveIndex = 0;
      else if (rand < 0.3) moveIndex = 1; // 0.1 + 0.2 = 0.3
      else if (rand < 0.6) moveIndex = 2; // 0.1 + 0.2 + 0.3 = 0.6
      else moveIndex = 3; // rest (0.4)

      const move = moves[moveIndex];
      
      // Critical Hit Check for Boss
      // 30% chance for Critical Hit
      const isBossCrit = Math.random() < 0.3;
      // 50% extra damage if Critical
      const damage = isBossCrit ? Math.floor(move.damage * 1.5) : move.damage;
      
      addBattleLog(`디아루가의 ${move.name}! ${isBossCrit ? '급소에 맞았다! (Critical +50% Damage)' : ''}`);
      
      // Animation delay then damage
      setTimeout(() => {
          setIsHit(true);
          // Pass isBossCrit as second arg to trigger echo if critical
          playSoundEffect('impact', isBossCrit); 
          setTimeout(() => setIsHit(false), 500);
          
          setStats(prev => {
              const newHp = prev.hp - damage;
              if (newHp <= 0) {
                  setTimeout(() => setPhase(GamePhase.GAME_OVER), 1000);
                  return { ...prev, hp: 0 };
              }
              return { ...prev, hp: newHp };
          });
          
          addBattleLog(`당신은 ${damage}의 피해를 입었습니다.`);
          setIsPlayerTurn(true);
      }, 1000);
  };

  const handleVictory = () => {
      setPhase(GamePhase.VICTORY);
      saveScore(stats.name, stats.score);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
  };

  const addBattleLog = (msg: string) => {
      setBattleLog(prev => [...prev, msg]);
  };

  const buyBerry = () => {
      setStats(prev => ({
          ...prev,
          score: prev.score - SHOP_CONFIG.berryCost,
          inventory: { oranBerry: prev.inventory.oranBerry + 1 }
      }));
  };

  const useBerry = () => {
      setStats(prev => {
          const healAmount = Math.floor(prev.maxHp * SHOP_CONFIG.berryHealPercent);
          return {
              ...prev,
              hp: Math.min(prev.maxHp, prev.hp + healAmount),
              inventory: { oranBerry: prev.inventory.oranBerry - 1 }
          };
      });
  };

  // Renders
  if (phase === GamePhase.INTRO) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4">
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 mb-8 animate-pulse text-center leading-tight">
                  DRAGON MUSIC<br/>MATH EVOLUTION
              </h1>
              <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 w-full max-w-md">
                <label className="block text-gray-300 mb-2">당신의 이름은?</label>
                <input 
                    type="text" 
                    value={playerNameInput}
                    onChange={(e) => setPlayerNameInput(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-2 text-white mb-6 focus:outline-none focus:border-yellow-500"
                    placeholder="지우"
                />
                <button 
                    onClick={startGame}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-all shadow-lg shadow-yellow-500/20"
                >
                    모험 시작하기
                </button>
              </div>
          </div>
      );
  }

  if (phase === GamePhase.GAME_OVER) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-black text-red-600 p-4">
              <h1 className="text-6xl font-black mb-4">GAME OVER</h1>
              <p className="text-gray-400 mb-8">당신의 드래곤이 쓰러졌습니다...</p>
              <Leaderboard entries={leaderboard} currentScore={stats.score} onRestart={handleRestart} />
          </div>
      );
  }

  if (phase === GamePhase.VICTORY) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-black text-white p-4">
            <h1 className="text-6xl font-black text-yellow-400 mb-4 animate-bounce">VICTORY!</h1>
            <p className="text-xl mb-8">디아루가를 물리치고 세계를 구했습니다!</p>
            <Leaderboard entries={leaderboard} currentScore={stats.score} onRestart={handleRestart} />
        </div>
      );
  }

  if (phase === GamePhase.EVOLUTION) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-4">
             <div className="text-center animate-fade-in-up">
                <h2 className="text-3xl font-bold mb-8">{evolutionMessage}</h2>
                <div className="relative w-64 h-64 mx-auto">
                    <img src={POKEMON_CONFIG[pokemon.stage].isShiny ? POKEMON_CONFIG[pokemon.stage].shinySprite : POKEMON_CONFIG[pokemon.stage].sprite} className="w-full h-full object-contain animate-bounce" />
                </div>
             </div>
          </div>
      );
  }
  
  // Audio Element
  const AudioPlayer = () => (
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="fixed top-4 right-4 z-50 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
      >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          <audio ref={audioRef} loop src="https://ia800100.us.archive.org/24/items/pokemon-diamond-and-pearl-music-compilation/Pokemon%20Diamond%20and%20Pearl%20-%20Battle%21%20Dialga_Palkia.mp3" autoPlay />
      </button>
  );

  const MainLayout = ({ children }: { children?: React.ReactNode }) => (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row overflow-hidden relative">
          <AudioPlayer />
          
          {/* Left Panel: Stats & Pokemon */}
          <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-800 border-r border-gray-700 p-6 flex flex-col justify-between z-10">
            <div>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-yellow-400">{stats.name}</h2>
                    <p className="text-gray-400 text-sm">Score: {Math.floor(stats.score)}</p>
                </div>
                
                <PokemonDisplay 
                    pokemon={pokemon} 
                    stats={stats} 
                    isHit={isHit} 
                    attackAnimation={phase === GamePhase.BOSS_BATTLE && !isPlayerTurn} // simplified visual logic
                />

                <Shop stats={stats} onBuy={buyBerry} onUse={useBerry} />
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
                Round: {phase === GamePhase.ROUND_1 ? '1' : phase === GamePhase.ROUND_2 ? '2' : 'BOSS'}
            </div>
          </div>

          {/* Right Panel: Game Area */}
          <div className="flex-1 p-6 md:p-12 relative flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            <div className="relative z-10 w-full">
                {children}
            </div>
          </div>
      </div>
  );

  return (
    <MainLayout>
        {(phase === GamePhase.ROUND_1 || phase === GamePhase.ROUND_2) && (
            <QuizGame 
                question={questions[currentQIndex]}
                round={phase === GamePhase.ROUND_1 ? 1 : 2}
                currentQuestionIndex={currentQIndex}
                totalQuestions={questions.length}
                onAnswer={handleAnswer}
                streak={stats.streak}
            />
        )}
        {(phase === GamePhase.PRE_BOSS) && (
             <div className="text-center animate-pulse">
                <h1 className="text-6xl font-black text-red-600 mb-4">WARNING</h1>
                <p className="text-2xl">전설의 포켓몬 디아루가가 나타났다!</p>
             </div>
        )}
        {phase === GamePhase.BOSS_BATTLE && (
            <BossBattle 
                boss={boss}
                playerStats={stats}
                moveUsage={moveUsage}
                onAttack={handleBossAttack}
                isPlayerTurn={isPlayerTurn}
                battleLog={battleLog}
                isHit={isBossHit}
            />
        )}
    </MainLayout>
  );
};

export default App;