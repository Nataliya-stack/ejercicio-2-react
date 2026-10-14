// Массив цветов для кнопок
const COLORES_BOTONES = [
  "bg-pink-100 hover:bg-pink-200 border-pink-200 text-pink-700",
  "bg-blue-100 hover:bg-blue-200 border-blue-200 text-blue-700",
  "bg-purple-100 hover:bg-purple-200 border-purple-200 text-purple-700",
  "bg-emerald-100 hover:bg-emerald-200 border-emerald-200 text-emerald-700",
  "bg-amber-100 hover:bg-amber-200 border-amber-200 text-amber-700"
];

const ABC = "QWERTYUIOPASDFGHJKLÑZXCVBNM".split('');
const ERRORES_MAX = 6;

function App() {
  // --- СОСТОЯНИЯ ИГРЫ ---
  const [palabraRandom, setPalabraRandom] = React.useState("");
  const [letrasPulsadas, setLetrasPulsadas] = React.useState([]);
  const [error, setError] = React.useState(0);
  const [animarFantasma, setAnimarFantasma] = React.useState(false);
  const [estilosBotones, setEstilosBotones] = React.useState({});

  // --- ЛОГИКА СТАРТА ИГРЫ (Аналог empezar) ---
  const empezarJuego = () => {
    // Безопасное чтение переменной PALABRAS из window
    const listaPalabras = window.palabras || [];
    if (listaPalabras.length === 0) return;

    const palabra = listaPalabras[Math.floor(Math.random() * listaPalabras.length)].toUpperCase();
    setPalabraRandom(palabra);
    setLetrasPulsadas([]);
    setError(0);
    setAnimarFantasma(false);

    // Раздаем кнопкам случайные цвета один раз за раунд
    const nuevosEstilos = {};
    ABC.forEach(letra => {
      nuevosEstilos[letra] = COLORES_BOTONES[Math.floor(Math.random() * COLORES_BOTONES.length)];
    });
    setEstilosBotones(nuevosEstilos);
  };

  // Автоматический старт при загрузке приложения
  React.useEffect(() => {
    empezarJuego();
  }, []);

  // --- ВЫЧИСЛЯЕМЫЕ ПЕРЕМЕННЫЕ ---
  const palabraAdivinada = palabraRandom ? palabraRandom.split('').map(letra => 
    letrasPulsadas.includes(letra) ? letra : '_'
  ) : [];

  const ganaste = palabraRandom.length > 0 && palabraAdivinada.every(l => l !== '_');
  const perdiste = error >= ERRORES_MAX;

  // Эффект Конфетти при победе
  React.useEffect(() => {
    if (ganaste) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  }, [ganaste]);

  // Эффект прыгающего призрака на 1.5 секунды при проигрыше
  React.useEffect(() => {
    if (perdiste) {
      setAnimarFantasma(true);
      const timer = setTimeout(() => setAnimarFantasma(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [perdiste]);

  // --- ОБРАБОТЧИК НАЖАТИЯ НА БУКВУ (Аналог pulsar) ---
  const handlePulsar = (letra) => {
    if (letrasPulsadas.includes(letra) || ganaste || perdiste) return;

    setLetrasPulsadas([...letrasPulsadas, letra]);

    if (!palabraRandom.includes(letra)) {
      setError(prev => prev + 1);
    }
  };

  return (
    <div className="w-11/12 sm:w-full max-w-4xl h-[94vh] flex flex-col justify-between p-4 sm:p-6 bg-white/40 backdrop-blur-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(165,180,252,0.2)] border border-white/60">
      
      {/* HEADER  */}
      <header class="w-full flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 sm:gap-4 border-b border-indigo-100/50 pb-3 text-center">
        <h2 className="text-3xl sm:text-5xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-300 to-teal-400 drop-shadow-[0_4px_10px_rgba(52,211,153,0.3)] tracking-wider text-center" style={{ fontFamily: "'Luckiest Guy', cursive" }}>
          <span className="sm:hidden">Ahorcado</span>
          <span className="hidden sm:inline">Juego del Ahorcado</span>
        </h2>

        {/* ДВОЙНАЯ КНОПКА-БАТОН */}
        <div className="flex items-center bg-gradient-to-r from-emerald-400 to-teal-600 p-1 rounded-full shadow-[0_4px_20px_rgba(52,211,153,0.4)] border border-emerald-300/30 transition-all duration-150 transform hover:-translate-y-0.5" style={{ fontFamily: "'Luckiest Guy', cursive" }}>
  
          {/* Левая половина: Играть снова (перезапуск раунда React) */}
          <button onClick={empezarJuego} className="px-4 py-1.5 text-white hover:text-emerald-100 active:scale-95 transition-all tracking-wider text-xs sm:text-sm cursor-pointer">
            Jugar
          </button>

          {/* Вертикальная разделяющая линия прямо посередине батона */}
          <div className="w-[2px] h-5 bg-white/40 rounded-full"></div>

          {/* Правая половина: Переключение на ванильную версию (ссылка на index-vanilla.html) */}
          <a href="./index-vanilla.html" className="px-4 py-1.5 text-white/90 hover:text-white active:scale-95 transition-all tracking-wider text-xs sm:text-sm text-center flex items-center justify-center" >
            Vanilla
          </a>
        </div>
      </header>

      {/* MAIN ЧАСТЬ С ИГРОВЫМ ЭКРАНОМ */}
      <main class="w-full flex-grow flex flex-col items-center justify-center gap-2 my-1">
        
        {/* Отображение загаданного слова */}
        {/* Было text-indigo-950, меняем на text-white для сочности */}
        <div id="palabra" className="text-3xl sm:text-5xl font-normal tracking-[0.2em] uppercase text-white my-2 select-none" style={{ fontFamily: "'Luckiest Guy', cursive" }}>
          <h2>{palabraAdivinada.join(' ')}</h2>
        </div>

        <div id="errores" class="flex flex-col items-center gap-3 bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-3xl shadow-[0_15px_40px_rgba(165,180,252,0.25)] border border-indigo-50/50 scale-90 sm:scale-100">
          
          {/* ТОЧНАЯ СТРУКТУРА SVG С ЧЕЛОВЕЧКОМ И ПРИЗРАКОМ */}
          <svg id="svg-ahorcado" width="200" height="220" viewBox="0 0 200 250" class="bg-indigo-50/50 rounded-2xl border border-indigo-100 shadow-inner">
            {/* Виселица — видна всегда, если мы не проиграли финал с призраком */}
            {!perdiste && (
              <React.Fragment>
                <line x1="10" y1="240" x2="150" y2="240" stroke="currentColor" strokeWidth="8" strokeLinecap="round" class="text-amber-800/80" />
                <line x1="40" y1="240" x2="40" y2="20" stroke="currentColor" strokeWidth="8" strokeLinecap="round" class="text-amber-800/80" />
                <line x1="40" y1="20" x2="120" y2="20" stroke="currentColor" strokeWidth="8" strokeLinecap="round" class="text-amber-800/80" />
                <line x1="120" y1="20" x2="120" y2="50" stroke="currentColor" strokeWidth="6" strokeLinecap="round" class="text-amber-700/60" />
              </React.Fragment>
            )}

            {/* Элементы человечка: в React мы используем классы прозрачности вместо display: none */}
            <line id="tronco" class="text-indigo-400 transition-opacity duration-500 ease-out" x1="120" y1="88" x2="120" y2="150" stroke="currentColor" strokeWidth="8" strokeLinecap="round" style={{ display: (!perdiste && error >= 3) ? 'block' : 'none' }} />
            <line id="brazo-izq" class="text-indigo-400 transition-opacity duration-500 ease-out" x1="120" y1="110" x2="90" y2="130" stroke="currentColor" strokeWidth="8" strokeLinecap="round" style={{ display: (!perdiste && error >= 4) ? 'block' : 'none' }} />
            <line id="brazo-der" class="text-indigo-400 transition-opacity duration-500 ease-out" x1="120" y1="110" x2="150" y2="130" stroke="currentColor" strokeWidth="8" strokeLinecap="round" style={{ display: (!perdiste && error >= 5) ? 'block' : 'none' }} />
            <line id="pierna-izq" class="text-indigo-400 transition-opacity duration-500 ease-out" x1="120" y1="150" x2="90" y2="190" stroke="currentColor" strokeWidth="8" strokeLinecap="round" style={{ display: (!perdiste && error >= 1) ? 'block' : 'none' }} />
            <line id="pierna-der" class="text-indigo-400 transition-opacity duration-500 ease-out" x1="120" y1="150" x2="150" y2="190" stroke="currentColor" strokeWidth="8" strokeLinecap="round" style={{ display: (!perdiste && error >= 2) ? 'block' : 'none' }} />

            {/* МУЛЬТЯШНЫЙ ПРИЗРАК ПРИ ПРОИГРЫШЕ */}
            {perdiste && (
              <g id="fantasma" class={animarFantasma ? 'animate-bounce' : ''}>
                <path d="M 60,130 C 60,70 140,70 140,130 C 140,155 135,160 125,150 C 120,145 115,155 110,150 C 105,145 100,155 95,150 C 90,145 85,155 80,150 C 70,160 60,155 60,130 Z" fill="white" stroke="#6ee7b7" strokeWidth="5" strokeLinecap="round" strokeJoin="round" />
                <circle cx="88" cy="110" r="7" fill="#4338ca" />
                <circle cx="86" cy="108" r="2.5" fill="white" />
                <circle cx="112" cy="110" r="7" fill="#4338ca" />
                <circle cx="110" cy="108" r="2.5" fill="white" />
                <circle cx="78" cy="120" r="4" fill="#fbcfe8" opacity="0.8" />
                <circle cx="122" cy="120" r="4" fill="#fbcfe8" opacity="0.8" />
                <ellipse cx="100" cy="122" rx="3" ry="5" fill="#4338ca" />
              </g>
            )}
          </svg>
          
          {/* СЧЕТЧИК ОШИБОК И ФИНАЛЬНЫЕ СООБЩЕНИЯ */}
          <h3 id="texto-errores" class="text-base sm:text-lg font-semibold text-slate-600">
            {!ganaste && !perdiste && (
              <React.Fragment>
                Número de Errores: <span id="error">{error}/{ERRORES_MAX}</span>
              </React.Fragment>
            )}
            {ganaste && <span class="text-green-600 font-bold animate-bounce block">¡Ganaste! 🎉</span>}
            {perdiste && <span class="text-red-600 font-bold block">¡Perdiste! 😢 — Era: {palabraRandom}</span>}
          </h3>
        </div>
      </main>

           {/* КЛАВИАТУРА ИЗ 9 КОЛОНОК */}
      <footer id="teclado" className="w-full max-w-xl sm:max-w-3xl grid grid-cols-9 gap-1 sm:gap-2 mt-2 mx-auto px-1 sm:px-4 pb-2">
        {ABC.map((letra) => (
          <button
            key={letra}
            disabled={letrasPulsadas.includes(letra) || ganaste || perdiste}
            onClick={() => handlePulsar(letra)}
            className={`px-1 py-1.5 border font-normal rounded-xl shadow-sm transition-all duration-150 text-center text-sm sm:text-lg active:scale-95 disabled:opacity-30 disabled:pointer-events-none ${estilosBotones[letra] || ''}`}
            style={{ fontFamily: "'Luckiest Guy', cursive" }}
          >
            {letra}
          </button>
        ))}
      </footer>

    </div>
  );
}

// Рендерим наше приложение по правилам React в элемент <div id="root">
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
