
import React, { useState, useEffect, useRef } from 'react';
import { GamePhase, PlayerStats, Pokemon, Question, LeaderboardEntry, Boss, PokemonSpecies } from './types';
import { SPECIES_CONFIG, DIALGA_CONFIG, SHOP_CONFIG, CHARIZARD_MOVES, MUSIC_URLS } from './constants';
import { generateRound1Questions, generateRound2Questions, calculateDamage, getLeaderboardData, saveLeaderboardData } from './services/gameLogic';
import { PokemonDisplay } from './components/PokemonDisplay';
import { QuizGame } from './components/QuizGame';
import { HealthBar } from './components/HealthBar';
import { Shop } from './components/Shop';
import { BossBattle } from './components/BossBattle';
import { Leaderboard } from './components/Leaderboard';
import { Volume2, VolumeX, Share2, CheckCircle } from 'lucide-react';
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
    species: 'charmander',
    stage: 0,
    isShiny: false
  });

  // Pokemon Emotion State
  const [pokemonEmotion, setPokemonEmotion] = useState<'neutral' | 'happy' | 'sad'>('neutral');

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
  const [isBossHit, setIsBossHit] = useState(false);
  const [evolutionMessage, setEvolutionMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerNameInput, setPlayerNameInput] = useState('');

  // Music Logic
  const getMusicSrc = () => {
    switch (phase) {
      case GamePhase.INTRO:
      case GamePhase.SELECTION:
      case GamePhase.ROUND_1:
        return MUSIC_URLS.ROUND_1;
      case GamePhase.ROUND_2:
        return MUSIC_URLS.ROUND_2;
      case GamePhase.EVOLUTION:
        return MUSIC_URLS.EVOLUTION;
      case GamePhase.PRE_BOSS:
      case GamePhase.BOSS_BATTLE:
        return MUSIC_URLS.BOSS;
      case GamePhase.VICTORY:
        return MUSIC_URLS.VICTORY;
      default:
        return MUSIC_URLS.ROUND_1;
    }
  };

  const currentMusicSrc = getMusicSrc();

  // Audio Control
  useEffect(() => {
    if (audioRef.current) {
      // Adjust volume based on phase
      if (phase === GamePhase.BOSS_BATTLE || phase === GamePhase.PRE_BOSS) {
        audioRef.current.volume = 0.5;
      } else {
        audioRef.current.volume = 0.3;
      }
      
      // Handle playback state
      if (!isMuted) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
              playPromise.catch(() => {
                  // Auto-play prevented
              });
          }
      } else {
          audioRef.current.pause();
      }
    }
  }, [phase, isMuted, currentMusicSrc]);

  // Load Leaderboard on mount
  useEffect(() => {
    setLeaderboard(getLeaderboardData());
  }, []);

  const saveScore = (name: string, score: number, isShiny: boolean) => {
    const newLeaderboard = saveLeaderboardData(name, score, isShiny);
    setLeaderboard(newLeaderboard);
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

  const getNoiseBuffer = (ctx: AudioContext) => {
    if (!noiseBufferRef.current) {
        const bufferSize = ctx.sampleRate * 2; // 2 seconds
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        noiseBufferRef.current = buffer;
    }
    return noiseBufferRef.current;
  };

  const playNoise = (ctx: AudioContext, type: 'roar' | 'hiss' | 'growl') => {
      const t = ctx.currentTime;
      const noise = ctx.createBufferSource();
      noise.buffer = getNoiseBuffer(ctx);
      
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'roar') {
          // Low frequency roar (Tiger/Wolf)
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(600, t);
          filter.frequency.exponentialRampToValueAtTime(100, t + 1.5);
          
          gain.gain.setValueAtTime(0.8, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);
          
          noise.start(t);
          noise.stop(t + 1.5);
      } else if (type === 'hiss') {
          // High frequency hiss (Cat)
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(1500, t);
          
          gain.gain.setValueAtTime(0.5, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
          
          noise.start(t);
          noise.stop(t + 0.8);
      } else if (type === 'growl') {
          // Mid frequency growl
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(300, t);
          filter.Q.value = 1;
          
          gain.gain.setValueAtTime(0.6, t);
          gain.gain.linearRampToValueAtTime(0.8, t + 0.5);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);

          noise.start(t);
          noise.stop(t + 1.2);
      }
  };

  const generateThudSound = (ctx: AudioContext, startTime: number, volume: number = 1.0) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, startTime);
    osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.1);
    
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
    
    osc.start(startTime);
    osc.stop(startTime + 0.3);
  };

  const playEvolutionSound = () => {
      if (isMuted) return;
      const ctx = getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const notes = [392.00, 392.00, 392.00, 523.25];
      const durations = [0.15, 0.15, 0.15, 0.4];
      
      let startTime = now;
      notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, startTime);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          gain.gain.setValueAtTime(0.1, startTime);
          gain.gain.exponentialRampToValueAtTime(0.01, startTime + durations[i] - 0.05);
          
          osc.start(startTime);
          osc.stop(startTime + durations[i]);
          
          startTime += durations[i] + 0.05;
      });
  };

  const playSoundEffect = (type: 'impact' | 'cry' | 'defeat', isCritical: boolean = false) => {
    if (isMuted) return;

    const ctx = getAudioContext();
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (type === 'defeat') {
        playNoise(ctx, 'hiss');
        return;
    }

    if (type === 'cry') {
      const variants: ('roar' | 'hiss' | 'growl')[] = ['roar', 'growl', 'hiss'];
      const selected = variants[Math.floor(Math.random() * variants.length)];
      playNoise(ctx, selected);
    } else if (type === 'impact') {
        const now = ctx.currentTime;
        generateThudSound(ctx, now, 1.0);

        if (isCritical) {
            for (let i = 1; i <= 8; i++) {
                const delay = i * 0.25;
                const decayVolume = Math.max(0, 1.0 - (i * 0.12));
                generateThudSound(ctx, now + delay, decayVolume);
            }
        }
    }
  };

  const handleRestart = () => {
    window.location.reload();
  };

  const handleShare = () => {
      const url = window.location.origin + window.location.pathname;
      navigator.clipboard.writeText(url)
        .then(() => alert('사이트 링크가 복사되었습니다! 친구들에게 공유해보세요.'))
        .catch(() => alert('링크 복사에 실패했습니다.'));
  };

  const startGame = () => {
    if (!playerNameInput.trim()) return alert("이름을 입력해주세요!");
    getAudioContext();
    setStats(prev => ({ ...prev, name: playerNameInput }));
    setPhase(GamePhase.SELECTION); // Transition to Selection Screen
  };

  const handleSelectPokemon = (species: PokemonSpecies) => {
     setPokemon({ species, stage: 0, isShiny: false });
     setQuestions(generateRound1Questions());
     setPhase(GamePhase.ROUND_1);
  };

  const handleAnswer = (value: any) => {
    const currentQ = questions[currentQIndex];
    if (currentQ.correctValue === value) {
      const interest = stats.streak > 0 ? Math.pow(1.1, stats.streak) : 1;
      const points = 20 * interest;
      
      setStats(prev => ({
        ...prev,
        score: prev.score + points,
        streak: prev.streak + 1
      }));

      setPokemonEmotion('happy');
      setTimeout(() => setPokemonEmotion('neutral'), 2000);

      nextQuestion();
    } else {
      takeDamage();
      setPokemonEmotion('sad');
      setTimeout(() => setPokemonEmotion('neutral'), 2000);
    }
  };

  const takeDamage = () => {
    const { dmg, msg } = calculateDamage();
    const isCritical = dmg === 45;

    // Apply Defense Modifier based on Species
    // Lower Defense means Higher Damage Taken (multiplier > 1)
    const speciesData = SPECIES_CONFIG[pokemon.species];
    const defenseModifier = speciesData.modifiers.dmgTaken; 
    const finalDamage = Math.ceil(dmg * defenseModifier);

    playSoundEffect('impact', isCritical);
    
    setIsHit(true);
    setTimeout(() => setIsHit(false), 500);

    setStats(prev => {
      const newHp = prev.hp - finalDamage;
      if (newHp <= 0) {
        setTimeout(() => setPhase(GamePhase.GAME_OVER), 1000);
        return { ...prev, hp: 0, streak: 0 };
      }
      return { ...prev, hp: newHp, streak: 0 };
    });

    if (phase === GamePhase.BOSS_BATTLE) {
         addBattleLog(`디아루가의 공격! ${msg ? msg : ''} (-${finalDamage} HP)`);
    } else {
        if (msg) alert(`${msg}\n(방어력 보정: -${finalDamage})`);
        else alert(`틀렸습니다! 데미지를 입었습니다. (-${finalDamage})`);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      handleRoundCompletion();
    }
  };

  const handleRoundCompletion = () => {
    evolvePokemon();
  };

  const evolvePokemon = () => {
    const nextStage = pokemon.stage + 1;
    
    if (nextStage > 2) {
      setPhase(GamePhase.PRE_BOSS);
      setTimeout(() => setPhase(GamePhase.BOSS_BATTLE), 3000);
      return;
    }

    let isShiny = pokemon.isShiny;
    let shinyText = "";

    if (!isShiny) {
       const roll = Math.random();
       if (roll <= 0.04) {
           isShiny = true;
           shinyText = "이로치 포켓몬이 나왔다!!! ";
       }
    }

    const speciesData = SPECIES_CONFIG[pokemon.species];
    const nextConfig = speciesData.stages[nextStage as 0|1|2];
    const prevConfig = speciesData.stages[pokemon.stage];
    
    const evolveMsg = isShiny 
        ? `${shinyText}이로치 포켓몬 ${prevConfig.name}가 ${nextConfig.name}로 진화했다!!`
        : `일반 포켓몬 ${prevConfig.name}가 ${nextConfig.name}로 진화했다!`;

    setEvolutionMessage(evolveMsg);
    setPhase(GamePhase.EVOLUTION);
    playEvolutionSound();
    
    setPokemon({ ...pokemon, stage: nextStage as 0|1|2, isShiny });
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

  const handleBossAttack = (moveId: string) => {
     if (!isPlayerTurn) return;
     const move = CHARIZARD_MOVES.find(m => m.id === moveId);
     if (!move) return;

     const currentUsage = moveUsage[moveId] || 0;
     if (move.maxUses !== Infinity && currentUsage >= move.maxUses) return;

     setMoveUsage(prev => ({...prev, [moveId]: currentUsage + 1}));
     playSoundEffect('cry');

     // Apply Attack Modifier based on Species
     const speciesData = SPECIES_CONFIG[pokemon.species];
     const atkModifier = speciesData.modifiers.atk;
     const finalDamage = Math.floor(move.damage * atkModifier);

     setBoss(prev => {
        const newHp = Math.max(0, prev.hp - finalDamage);
        return { ...prev, hp: newHp };
     });

     setIsBossHit(true);
     setTimeout(() => setIsBossHit(false), 500);
     setTimeout(() => playSoundEffect('impact'), 300);

     addBattleLog(`${pokemon.isShiny ? '이로치 ' : ''}${speciesData.stages[2].name}의 ${move.name}! ${finalDamage} 데미지.`);

     setIsPlayerTurn(false);

     if (boss.hp - finalDamage <= 0) {
         playSoundEffect('defeat');
         setTimeout(handleVictory, 1500);
     } else {
         setTimeout(bossTurn, 1500);
     }
  };

  const bossTurn = () => {
      const moves = DIALGA_CONFIG.moves;
      const rand = Math.random();
      let moveIndex = 0;
      if (rand < 0.1) moveIndex = 0;
      else if (rand < 0.3) moveIndex = 1;
      else if (rand < 0.6) moveIndex = 2;
      else moveIndex = 3;

      const move = moves[moveIndex];
      const isBossCrit = Math.random() < 0.3;
      let damage = isBossCrit ? Math.floor(move.damage * 1.5) : move.damage;
      
      // Apply Player Defense Modifier to Boss Damage
      const speciesData = SPECIES_CONFIG[pokemon.species];
      const defenseModifier = speciesData.modifiers.dmgTaken;
      damage = Math.ceil(damage * defenseModifier);

      addBattleLog(`디아루가의 ${move.name}! ${isBossCrit ? '급소! (Crit)' : ''} (-${damage})`);
      
      setTimeout(() => {
          setIsHit(true);
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
      saveScore(stats.name, stats.score, pokemon.isShiny);
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

  // Audio Player Component
  const AudioPlayer = () => (
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="fixed top-4 right-4 z-50 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
      >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          <audio 
            ref={audioRef} 
            loop 
            src={currentMusicSrc} 
            key={currentMusicSrc} // Force re-mount on src change to restart track
            autoPlay 
          />
      </button>
  );

  const MainLayout = ({ children }: { children?: React.ReactNode }) => (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row overflow-hidden relative">
          <AudioPlayer />
          
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
                    attackAnimation={phase === GamePhase.BOSS_BATTLE && !isPlayerTurn}
                    emotion={pokemonEmotion}
                />

                <Shop stats={stats} onBuy={buyBerry} onUse={useBerry} />
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
                Round: {phase === GamePhase.ROUND_1 ? '1' : phase === GamePhase.ROUND_2 ? '2' : phase === GamePhase.BOSS_BATTLE ? 'BOSS' : '-'}
            </div>
          </div>

          <div className="flex-1 p-6 md:p-12 relative flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
            <div className="relative z-10 w-full">
                {children}
            </div>
          </div>
      </div>
  );

  // Render Phases
  if (phase === GamePhase.INTRO) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 overflow-y-auto">
              <AudioPlayer />
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600 mb-8 animate-pulse text-center leading-tight pt-10">
                  DRAGON MUSIC<br/>MATH EVOLUTION
              </h1>
              <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 w-full max-w-md mb-8">
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
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-all shadow-lg shadow-yellow-500/20 mb-3"
                >
                    모험 시작하기
                </button>
                <button 
                    onClick={handleShare}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    <Share2 size={16} /> 친구에게 공유하기
                </button>
              </div>
              <div className="w-full max-w-md pb-10">
                  <Leaderboard entries={leaderboard} hideButtons={true} />
              </div>
          </div>
      );
  }

  // Selection Screen
  if (phase === GamePhase.SELECTION) {
      return (
          <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
              <AudioPlayer />
              <h2 className="text-4xl font-bold mb-8 text-yellow-400 animate-fade-in-up">Choose Your Pokemon</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
                  {(Object.keys(SPECIES_CONFIG) as PokemonSpecies[]).map((species) => {
                      const data = SPECIES_CONFIG[species];
                      const sprite = data.stages[0].sprite;
                      return (
                          <div 
                            key={species} 
                            onClick={() => handleSelectPokemon(species)}
                            className="bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-yellow-500 rounded-2xl p-6 cursor-pointer transform hover:-translate-y-2 transition-all duration-300 shadow-xl flex flex-col items-center group"
                          >
                              <div className="w-32 h-32 mb-4 relative">
                                  <img src={sprite} alt={data.name} className="w-full h-full object-contain drop-shadow-lg pixelated group-hover:scale-110 transition-transform" />
                              </div>
                              <h3 className="text-2xl font-bold mb-2">{data.name}</h3>
                              <span className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-300 mb-4">{data.type}</span>
                              <p className="text-gray-400 text-center text-sm">{data.description}</p>
                              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-yellow-400 font-bold flex items-center gap-2">
                                  <CheckCircle size={16} /> 선택하기
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      );
  }

  if (phase === GamePhase.GAME_OVER) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-black text-red-600 p-4">
              <AudioPlayer />
              <h1 className="text-6xl font-black mb-4">GAME OVER</h1>
              <p className="text-gray-400 mb-8">당신의 포켓몬이 쓰러졌습니다...</p>
              <Leaderboard entries={leaderboard} currentScore={stats.score} onRestart={handleRestart} />
          </div>
      );
  }

  if (phase === GamePhase.VICTORY) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-black text-white p-4">
            <AudioPlayer />
            <h1 className="text-6xl font-black text-yellow-400 mb-4 animate-bounce">VICTORY!</h1>
            <p className="text-xl mb-8">디아루가를 물리치고 세계를 구했습니다!</p>
            <Leaderboard entries={leaderboard} currentScore={stats.score} onRestart={handleRestart} />
        </div>
      );
  }

  if (phase === GamePhase.EVOLUTION) {
      const speciesData = SPECIES_CONFIG[pokemon.species];
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-4">
             <AudioPlayer />
             <div className="text-center animate-fade-in-up">
                <h2 className="text-3xl font-bold mb-8">{evolutionMessage}</h2>
                <div className="relative w-64 h-64 mx-auto">
                    <img 
                        src={pokemon.isShiny ? speciesData.stages[pokemon.stage].shinySprite : speciesData.stages[pokemon.stage].sprite} 
                        className="w-full h-full object-contain animate-bounce" 
                    />
                </div>
             </div>
          </div>
      );
  }

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
