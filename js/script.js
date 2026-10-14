  const PALABRA = document.getElementById('palabra');
  const TECLADO = document.getElementById('teclado');
  const ERROR = document.getElementById('error');

  const partesCuerpo = [
    "#pierna-izq", // Fallo 1
    "#pierna-der", // Fallo 2
    "#tronco",     // Fallo 3
    "#brazo-izq",  // Fallo 4
    "#brazo-der",  // Fallo 5
    "#cabeza"      // Fallo 6
  ];

  let palabraRandom = "";
  let palabraAdivinada = [];
  let intentos = 6;
  let error = 0;
    
  function pintarErrores() {
  const parte = document.querySelector(partesCuerpo[error-1]);
  if (parte) {
    // 1. Делаем линию видимой, но полностью прозрачной
    parte.style.display = "block";
    parte.classList.add("opacity-0");
    
    // 2. Через 20 миллисекунд плавно включаем полную видимость
    setTimeout(() => {
      parte.classList.remove("opacity-0");
      parte.classList.add("opacity-100");
    }, 20);
  }

  ERROR.innerHTML = error + "/" + intentos;
 }

  function pintarPalabra() {
    PALABRA.innerHTML = palabraAdivinada.join(' ');
  }

  function empezar() {
  document.getElementById("texto-errores").innerHTML = 'Número de Errores: <span id="error">0</span>';

  palabraRandom = PALABRAS[Math.floor(Math.random() * PALABRAS.length)].toUpperCase();
  palabraAdivinada = Array(palabraRandom.length).fill('_');
  
  document.querySelectorAll(".parte-cuerpo").forEach(parte => {
    parte.style.display = "none";
    parte.classList.remove("opacity-100"); // <-- Добавь эту строчку!
  });

  
  error = 0;
  pintarErrores(); 
  pintarPalabra();
  teclado();
  }


  function teclado() {
  TECLADO.innerHTML = '';
  let abc = "QWERTYUIOPASDFGHJKLÑZXCVBNM";
  
  // Массив цветов для кнопок 
  const colores = [
    "bg-pink-100 hover:bg-pink-200 border-pink-200 text-pink-700",
    "bg-blue-100 hover:bg-blue-200 border-blue-200 text-blue-700",
    "bg-purple-100 hover:bg-purple-200 border-purple-200 text-purple-700",
    "bg-emerald-100 hover:bg-emerald-200 border-emerald-200 text-emerald-700",
    "bg-amber-100 hover:bg-amber-200 border-amber-200 text-amber-700"
  ];
  
  for (let letra of abc) {
    let button = document.createElement("button");
    button.id = letra;
    button.addEventListener("click", () => pulsar(letra));
    button.innerHTML = letra;

    // Выбираем случайный цвет из нашего массива для текущей буквы
    const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];

    // Базовые настройки формы кнопки + случайный цвет фона, текста и границ
    button.className = `px-1 py-1.5 border font-normal rounded-xl shadow-sm transition-all duration-150 text-center text-lg active:scale-95 disabled:opacity-30 disabled:pointer-events-none ${colorAleatorio}`;
    button.style.fontFamily = "'Luckiest Guy', cursive";

    TECLADO.appendChild(button);
    }
  }

  function pulsar(valor) {
  const boton = document.getElementById(valor);
  if (boton) {
    boton.disabled = true;
  }

  if (palabraRandom.includes(valor)) {
    for (let i = 0; i < palabraRandom.length; i++) {
      if (palabraRandom[i] === valor) {
        palabraAdivinada[i] = valor;
      }
    }
    pintarPalabra();

  } else {
    error++;
    pintarErrores();
  }

    // 3. Проверка финала игры (Адаптивный размер шрифта)
  if (!palabraAdivinada.includes('_')) {
    confetti( {
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    } );
    
    document.getElementById("texto-errores").innerHTML = "<span class='text-green-600 font-bold text-lg sm:text-xl block animate-bounce'>¡Ganaste! 🎉</span>";    
    document.querySelectorAll("#teclado button").forEach(boton => boton.disabled = true);
  } 
  else if (error >= intentos) {
    document.getElementById("texto-errores").innerHTML = `<span class='text-red-600 font-bold text-sm sm:text-base block whitespace-nowrap tracking-tight sm:tracking-normal'>¡Perdiste! 😢 — <span class='text-slate-500 font-normal text-xs sm:text-sm'>Era:</span> ${palabraRandom}</span>`;
    document.querySelectorAll("#teclado button").forEach(boton => boton.disabled = true);
    }
  }


  