// src/data/scenes.ts

export interface Character {
  src: string;
  alt: string;
  position: {
    x: string;  // posición horizontal (left): "20%", "150px"
    y: string;  // posición desde abajo  (bottom): "5%", "0px"
  };
  width?: number;
  height?: number;
  animation?: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'pop';
  delay?: number;
  particles?: string[]; // Emojis que salen al tocar el personaje
}

export interface Scene {
  id: number;
  title: string;
  narration: string;
  audioFile: string;
  background: string;
  characters: Character[];
  effects?: ('rain' | 'rain-heavy' | 'fog' | 'leaves' | 'sparkles')[];
}

export const scenes: Scene[] = [
  {
    id: 1,
    title: "La Herencia del Molinero",
    narration: "Había una vez, en un reino lejano y lleno de magia, un viejo molinero muy querido por todos. Cuando llegó su hora de partir, reunió a sus tres hijos y les entregó todo lo que tenía. Al mayor le dejó el gran molino de viento que tanto trabajo le había costado levantar. Al segundo le dio el burro fuerte y fiel que cargaba los sacos de harina cada mañana. Pero al hijo menor, el más joven y soñador de todos, solo le quedaba un gato anaranjado de ojos brillantes y mirada inteligente.",
    audioFile: "/audio/narration/escena1.mp3",
    background: "/images/escenarios/escenario1.webp",
    effects: ['leaves'],
    characters: [
      {
        src: "/images/personajes/gato-recibiendo-botas.webp",
        alt: "El gato recién heredado por el joven",
        position: { x: "calc(50% - 65px)", y: "0%" },
        width: 130,
        height: 185,
        animation: "fadeUp",
        delay: 0.3,
      }
    ]
  },
  {
    id: 2,
    title: "El Gato Habla",
    narration: "El joven se quedó mirando al gato con el corazón encogido. ¿Qué podría hacer con un simple gato? ¿Cómo iba a alimentarse sin dinero ni tierras? Pero entonces, para su enorme sorpresa, el gato abrió la boca y habló con voz clara y segura: '¡No te preocupes, amo! Consígueme unas botas resistentes y un saco de tela, y yo me encargaré de que seas el hombre más rico y respetado del reino.' El joven no podía creer lo que escuchaba, pero algo en los ojos del gato le decía que debía confiar en él.",
    audioFile: "/audio/narration/escena2.mp3",
    background: "/images/escenarios/escenario2.webp",
    characters: [
      {
        src: "/images/personajes/gato-gritando.webp",
        alt: "El gato hablando con su amo",
        position: { x: "32%", y: "0%" },
        width: 125,
        height: 175,
        animation: "fadeLeft",
        delay: 0.3,
      }
    ]
  },
  {
    id: 3,
    title: "Las Botas del Gato",
    narration: "El joven vendió sus últimas monedas para comprar las botas más finas que encontró en el mercado del pueblo. El gato se las calzó con elegancia, se colocó un sombrero de plumas en la cabeza y tomó el saco de tela con aire orgulloso. Se miró en el reflejo brillante del río y sonrió satisfecho. Con esas botas relucientes y su porte distinguido, ya no parecía un gato cualquiera. Parecía el gato más astuto y valiente de todos los reinos conocidos, listo para cumplir su gran promesa.",
    audioFile: "/audio/narration/escena3.mp3",
    background: "/images/escenarios/escenario3.webp",
    characters: [
      {
        src: "/images/personajes/gato-colocandose-las-botas.webp",
        alt: "El gato calzándose sus botas nuevas",
        position: { x: "calc(50% - 65px)", y: "0%" },
        width: 130,
        height: 185,
        animation: "pop",
        delay: 0.4,
      }
    ]
  },
  {
    id: 4,
    title: "La Caza de Conejos",
    narration: "El Gato con Botas se internó en el bosque con su saco lleno de zanahorias frescas y lechugas tiernas. Tendió una trampa en el claro más soleado del bosque y se escondió pacientemente entre los arbustos sin hacer el menor ruido. Los conejos, atraídos por el delicioso aroma, saltaron curiosos y cayeron uno a uno dentro del saco. Con gran habilidad, el gato capturó a los más gordos y lustrosos. Luego, con sus botas bien limpias y su mejor postura, marchó orgulloso hacia el palacio del Rey.",
    audioFile: "/audio/narration/escena4.mp3",
    background: "/images/escenarios/escenario4.webp",
    effects: ['fog', 'leaves'],
    characters: [
      {
        src: "/images/personajes/gato-cazador.webp",
        alt: "El gato tendiendo una trampa en silencio",
        position: { x: "10%", y: "0%" },
        width: 115,
        height: 162,
        animation: "fadeLeft",
        delay: 0.3,
      },
      {
        src: "/images/personajes/raton.webp",
        alt: "Un ratón curioso acercándose a la trampa",
        position: { x: "65%", y: "0%" },
        width: 85,
        height: 110,
        animation: "fadeRight",
        delay: 0.7,
      }
    ]
  },
  {
    id: 5,
    title: "El Regalo al Rey",
    narration: "Al llegar a las puertas doradas del palacio, el Gato con Botas se inclinó ante el Rey con toda la gracia y elegancia del mundo. 'Majestad,' dijo con voz solemne y segura, 'os traigo este humilde regalo de parte del ilustrísimo Marqués de Carabás, el noble más generoso y valiente de todas las tierras.' El Rey, impresionado por los refinados modales del gato y lo jugosos que se veían los conejos, aceptó el regalo con gran placer y una amplia sonrisa. '¡Qué extraordinario gato! Y qué generoso debe ser su señor,' pensó el monarca.",
    audioFile: "/audio/narration/escena5.mp3",
    background: "/images/escenarios/escenario5.webp",
    characters: [
      {
        src: "/images/personajes/reverencia-al-rey.webp",
        alt: "El gato haciendo una reverencia al presentar los regalos",
        position: { x: "10%", y: "0%" },
        width: 115,
        height: 162,
        animation: "fadeLeft",
        delay: 0.3,
      },
      {
        src: "/images/personajes/rey-regalando.webp",
        alt: "El Rey aceptando el regalo complacido",
        position: { x: "62%", y: "0%" },
        width: 115,
        height: 165,
        animation: "fadeRight",
        delay: 0.6,
      }
    ]
  },
  {
    id: 6,
    title: "Más y Más Regalos",
    narration: "Semana tras semana, el Gato con Botas regresaba al palacio con nuevos y espléndidos regalos: perdices asadas con hierbas del campo, peces plateados sacados del río más cristalino, codornices perfumadas y liebres del bosque. Cada vez que llegaba, anunciaba que todo era obsequio del poderoso y generoso Marqués de Carabás. El Rey comenzó a sentir una profunda admiración por ese noble tan dadivoso que nunca se presentaba en persona. Y la Princesa, intrigada y curiosa, preguntaba cada vez más sobre el misterioso marqués.",
    audioFile: "/audio/narration/escena6.mp3",
    background: "/images/escenarios/escenario6.webp",
    characters: [
      {
        src: "/images/personajes/reverencia-al-rey.webp",
        alt: "El gato haciendo una reverencia ante el Rey",
        position: { x: "12%", y: "0%" },
        width: 115,
        height: 162,
        animation: "fadeLeft",
        delay: 0.3,
      },
      {
        src: "/images/personajes/rey-regalando.webp",
        alt: "El Rey recibiendo los regalos complacido",
        position: { x: "65%", y: "0%" },
        width: 115,
        height: 165,
        animation: "fadeRight",
        delay: 0.6,
      }
    ]
  },
  {
    id: 7,
    title: "El Plan del Río",
    narration: "Una mañana dorada y soleada, el gato se enteró de que el Rey y su hija la Princesa pasearían en su carruaje real junto al río. Corrió veloz como el viento hasta donde estaba su amo y le dijo: '¡Escúchame, rápido! Quítate la ropa y métete al río ahora mismo. Haz exactamente lo que yo te diga y te prometo que tu fortuna quedará asegurada para siempre.' El joven, aunque muy confundido, obedeció sin dudar. El carruaje real se acercaba lentamente por el camino, y el gato ya tenía todo calculado al detalle.",
    audioFile: "/audio/narration/escena7.mp3",
    background: "/images/escenarios/escenario7.webp",
    characters: [
      {
        src: "/images/personajes/gato-engañando.webp",
        alt: "El gato explicando su plan astuto",
        position: { x: "calc(50% - 62px)", y: "0%" },
        width: 125,
        height: 175,
        animation: "fadeUp",
        delay: 0.4,
      }
    ]
  },
  {
    id: 8,
    title: "El Rescate Real",
    narration: "Cuando el carruaje dorado del Rey pasó junto al río, el Gato con Botas saltó al camino agitando los brazos con desesperación y gritando: '¡Socorro, Majestad! ¡Unos bandidos han robado las ropas del Marqués de Carabás mientras se bañaba!' El Rey, que tanto apreciaba los generosos regalos del marqués, ordenó de inmediato que le trajeran las mejores ropas de su guardarropa personal. Cuando el joven salió del río vestido con finas telas bordadas en hilo de oro, la Princesa lo miró fijamente y sintió que el corazón le daba un vuelco muy especial.",
    audioFile: "/audio/narration/escena8.mp3",
    background: "/images/escenarios/escenario8.webp",
    effects: ['rain'],
    characters: [
      {
        src: "/images/personajes/gato-gritando.webp",
        alt: "El gato pidiendo socorro al carruaje real",
        position: { x: "8%", y: "0%" },
        width: 110,
        height: 155,
        animation: "fadeLeft",
        delay: 0.3,
      },
      {
        src: "/images/personajes/princesa-y-principe.webp",
        alt: "La Princesa mirando al joven con admiración",
        position: { x: "62%", y: "0%" },
        width: 120,
        height: 170,
        animation: "fadeRight",
        delay: 0.6,
        particles: ['💖', '💕', '✨', '💗', '💖', '💫'],
      }
    ]
  },
  {
    id: 9,
    title: "Las Tierras del Marqués",
    narration: "Mientras el carruaje real avanzaba lentamente por los campos verdes, el Gato con Botas corría adelante a toda velocidad sin perder un segundo. Se detenía ante cada grupo de campesinos, labradores y pastores que encontraba en el camino. 'Escuchadme bien,' les decía señalando con su garra en alto, 'si el Rey os pregunta de quién son estas tierras y estos rebaños, diréis que todo pertenece al noble Marqués de Carabás.' Los campesinos, sorprendidos ante aquel gato tan serio y elegante, prometieron obedecer al instante.",
    audioFile: "/audio/narration/escena9.mp3",
    background: "/images/escenarios/escenario9.webp",
    effects: ['leaves'],
    characters: [
      {
        src: "/images/personajes/gato-engañando.webp",
        alt: "El gato dando instrucciones a los campesinos",
        position: { x: "calc(50% - 62px)", y: "0%" },
        width: 125,
        height: 175,
        animation: "pop",
        delay: 0.4,
      }
    ]
  },
  {
    id: 10,
    title: "El Castillo del Ogro",
    narration: "Al final de todas aquellas tierras se alzaba un enorme castillo de piedra oscura donde vivía el más temible de todos los ogros. Era tan poderoso y feroz que todos los reinos cercanos le pagaban tributo por miedo. El Gato con Botas llegó solo hasta sus puertas enormes, sin mostrar ni una pizca de miedo, con su sombrero bien puesto y sus botas relucientes. Llamó con fuerza a la gran puerta de hierro y esperó sereno. El ogro, asombrado de que alguien se atreviera a visitarle, abrió la puerta y miró al pequeño gato con curiosidad.",
    audioFile: "/audio/narration/escena10.mp3",
    background: "/images/escenarios/escenario10.webp",
    effects: ['fog', 'rain-heavy'],
    characters: [
      {
        // Ogro intencionalmente más grande para mostrar su amenaza
        src: "/images/personajes/ogro.webp",
        alt: "El temible ogro abriendo las puertas del castillo",
        position: { x: "58%", y: "0%" },
        width: 140,
        height: 200,
        animation: "fadeRight",
        delay: 0.3,
        particles: ['💥', '⚡', '💢', '🔥', '💥', '⚡'],
      },
      {
        // Gato más pequeño para el contraste de escala
        src: "/images/personajes/gato-cazador.webp",
        alt: "El gato enfrentando al ogro sin miedo",
        position: { x: "8%", y: "0%" },
        width: 100,
        height: 142,
        animation: "fadeLeft",
        delay: 0.6,
      }
    ]
  },
  {
    id: 11,
    title: "Las Transformaciones Mágicas",
    narration: "'Dicen que eres el ser más poderoso del mundo y que puedes transformarte en cualquier criatura,' dijo el gato con una sonrisa traviesa y desafiante. El ogro, furioso ante el reto, rugió y se transformó en un enorme y terrible león con melena dorada que llenó toda la sala. El gato saltó asustado pero se recompuso enseguida. 'Impresionante... pero lo verdaderamente difícil sería convertirse en algo tan pequeño como... un ratoncito.' El ogro, picado en su orgullo, se transformó en un diminuto ratón gris. Y el gato... de un solo salto, puso fin al ogro para siempre.",
    audioFile: "/audio/narration/escena11.mp3",
    background: "/images/escenarios/escenario11.webp",
    effects: ['sparkles'],
    characters: [
      {
        // León grande — impresionante
        src: "/images/personajes/ogro-leon.webp",
        alt: "El ogro transformado en un enorme león",
        position: { x: "8%", y: "0%" },
        width: 148,
        height: 192,
        animation: "fadeLeft",
        delay: 0.3,
      },
      {
        // Ratón diminuto — contraste cómico
        src: "/images/personajes/raton.webp",
        alt: "El ogro transformado en un diminuto ratón",
        position: { x: "72%", y: "0%" },
        width: 62,
        height: 78,
        animation: "pop",
        delay: 1.0,
        particles: ['🐭', '💨', '😱', '💫', '🐭', '💨'],
      }
    ]
  },
  {
    id: 12,
    title: "Felices Para Siempre",
    narration: "Con el ogro vencido, el gran castillo y todas las tierras del reino pasaron a pertenecer al joven hijo del molinero. El carruaje real llegó justo en ese momento, y el Gato con Botas anunció con gran pompa y orgullo: '¡Bienvenidos al majestuoso castillo del Marqués de Carabás!' El Rey, tan impresionado por las riquezas y tierras del marqués, le ofreció con alegría la mano de su hija la Princesa. Los dos jóvenes se miraron con cariño y aceptaron emocionados. Y así fue como, gracias a la valentía, la lealtad y la astucia de un gato con botas, el hijo más humilde del molinero se convirtió en el noble más feliz de todo el reino.",
    audioFile: "/audio/narration/escena12.mp3",
    background: "/images/escenarios/escenario12.webp",
    effects: ['sparkles', 'leaves'],
    characters: [
      {
        src: "/images/personajes/princesa-y-principe.webp",
        alt: "La Princesa y el Marqués, felices juntos",
        position: { x: "14%", y: "0%" },
        width: 130,
        height: 182,
        animation: "fadeLeft",
        delay: 0.3,
        particles: ['💖', '💕', '✨', '💗', '👑', '💫'],
      },
      {
        src: "/images/personajes/gato-con-botas.webp",
        alt: "El Gato con Botas, orgulloso de su hazaña",
        position: { x: "70%", y: "0%" },
        width: 112,
        height: 158,
        animation: "pop",
        delay: 0.7,
      }
    ]
  }
];
