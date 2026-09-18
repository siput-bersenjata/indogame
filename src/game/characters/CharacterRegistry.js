// Character Registry and Metadata for IndoGame Fighters

export const CHARACTERS = {
  gufron: {
    id: 'gufron',
    name: 'MAMA GUFRON',
    title: 'The Mystical Speaker',
    avatar: '/assets/fullbody/gufron.png',
    fullBody: '/assets/fullbody/gufron.png',
    portrait: '/assets/portraits/gufron.png',
    color: '#ca8a04',
    bgGradient: 'from-amber-900 to-yellow-600',
    stats: {
      power: 85,
      speed: 75,
      range: 95
    },
    moves: {
      special1: {
        name: 'Babi Hutan Charge',
        desc: 'Mama Gufron memanggil dan menunggangi babi hutan bertaring menerobos musuh dengan kepulan debu.',
        cost: 35,
        badge: 'CHARGE'
      },
      ultimate: {
        name: 'Jurus Semut Gaib',
        desc: 'Bersuara ke mikrofon memunculkan semburan ribuan semut ("ERUPT!") yang mengerubungi musuh ("K.O. BY SWARM").',
        cost: 100,
        badge: 'SWARM'
      }
    }
  },
  bahlil: {
    id: 'bahlil',
    name: 'BAHLIL',
    title: 'The Smiling Minister',
    avatar: '/assets/fullbody/bahlil.png',
    fullBody: '/assets/fullbody/bahlil.png',
    portrait: '/assets/portraits/bahlil.png',
    color: '#2563eb',
    bgGradient: 'from-blue-900 to-indigo-600',
    stats: {
      power: 80,
      speed: 90,
      range: 80
    },
    moves: {
      special1: {
        name: 'Hot Ethanol Splash',
        desc: 'Menyiram cairan kimia etanol membara yang membakar tubuh lawan ("FIRE!").',
        cost: 35,
        badge: 'FIRE'
      },
      ultimate: {
        name: 'Earth Oil Eruption',
        desc: 'Menyentuh tanah membangkitkan semburan geyser minyak mentah hitam yang menenggelamkan musuh ("TRAP").',
        cost: 100,
        badge: 'GEYSER'
      }
    }
  },
  wowo: {
    id: 'wowo',
    name: 'WOWO',
    title: 'The Safari Commander',
    avatar: '/assets/fullbody/wowo.png',
    fullBody: '/assets/fullbody/wowo.png',
    portrait: '/assets/portraits/wowo.png',
    color: '#dc2626',
    bgGradient: 'from-red-900 to-amber-700',
    stats: {
      power: 95,
      speed: 70,
      range: 85
    },
    moves: {
      special1: {
        name: 'Tray Makan Racun',
        desc: 'Melempar nampan makan beracun yang menciptakan genangan asam racun ("POISONED!").',
        cost: 35,
        badge: 'POISON'
      },
      ultimate: {
        name: 'Megaphone "HIDUP JOKOWI"',
        desc: 'Meneriakkan "HIDUP JOKOWI" lewat megafon bergelombang sonik raksasa yang menyetun musuh ("STUNNED!").',
        cost: 100,
        badge: 'SONIC'
      }
    }
  }
};

export const CHARACTER_LIST = Object.values(CHARACTERS);
