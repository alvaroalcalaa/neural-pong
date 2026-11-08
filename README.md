# Neural Pong

> Un Pong de navegador donde el rival observa cómo juegas y adapta su defensa en tiempo real.

**Neural Pong** es un microjuego en HTML, CSS y JavaScript sin dependencias. El oponente no usa una red neuronal pesada: emplea un modelo adaptativo explicable que aprende el sesgo vertical y la velocidad media de tus devoluciones mediante una media móvil exponencial.

## Funcionalidades

- Controles con `W/S` o `↑/↓`.
- Rival adaptativo: estima tu patrón de rebote y anticipa la posición de la pelota.
- Dificultad progresiva a medida que el marcador avanza.
- HUD que muestra la confianza y la predicción del rival.
- Diseño retro-neón responsive.
- Sin build step ni librerías: abre `index.html`.

## Demo

1. Mueve tu pala y devuelve la pelota.
2. Juega varias rondas inclinando tus golpes hacia arriba o abajo.
3. El panel “AI read” cambia: el rival empieza a moverse hacia la zona que predice.

## Ejecutar

```bash
git clone https://github.com/alvaroalcalaa/neural-pong.git
cd neural-pong
# Abre index.html en el navegador
```

También puedes usar un servidor local:

```bash
python -m http.server 8000
```

Después visita `http://localhost:8000`.

## Stack y estructura

```text
neural-pong/
├── index.html   # UI y canvas
├── style.css    # diseño visual
├── game.js      # bucle del juego y modelo adaptativo
└── README.md
```

## English

Neural Pong is a dependency-free browser game. Its opponent learns the vertical bias and average speed of your returns with an interpretable exponential moving average, then uses that signal to predict where to defend. It is a compact example of adaptive game AI without opaque machine-learning tooling.

## License

MIT © 2026 Álvaro Alcalá
