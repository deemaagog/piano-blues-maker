export const keysOffsets = {
    'C': 0,
    'Db': 1,
    'D': 2,
    'Eb': 3,
    'E': 4,
    'F': 5,
    'Gb': -6,
    'G': -5,
    'Ab': -4,
    'A': -3,
    'Bb': -2,
    'B': -1
  }

export  const durations = {
    '64': 0.0625,
    '32': 0.125,
    '16': 0.25,
    '8': 0.5,
    'q': 1,
    'h': 2,
    'w': 4
  };

  // export  const keysAccidentals = {
  //   'C': [],
  //   'Db': ['Bb', 'Eb', 'Ab', 'Db', 'Gb'],
  //   'D': ['F#', 'C#'],
  //   'Eb': ['Bb', 'Eb', 'Ab'],
  //   'E': ['F#', 'C#', 'G#', 'D#'],
  //   'F': ['Bb'],
  //   'Gb': ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'],
  //   'G': ['F#'],
  //   'Ab': ['Bb', 'Eb', 'Ab', 'Db'],
  //   'A': ['F#', 'C#', 'G#'],
  //   'Bb': ['Bb', 'Eb'],
  //   'B': ['F#', 'C#', 'G#', 'D#', 'A#']
  // }  

  export  const keysAccidentals = {
    'C': {},
    'Db': {'B':'b','E':'b','A':'b','D':'b','G':'b'},
    'D': {'F':'#', 'C':'#'},
    'Eb': {'B':'b','E':'b','A':'b'},
    'E': {'F':'#', 'C':'#', 'G':'#', 'D':'#'},
    'F': {'B':'b'},
    'Gb': {'B':'b', 'E':'b', 'A':'b', 'D':'b', 'G':'b', 'C':'b'},
    'G': {'F':'#'},
    'Ab': {'B':'b','E':'b','A':'b','D':'b'},
    'A': {'F':'#', 'C':'#', 'G':'#'},
    'Bb': {'B':'b','E':'b'},
    'B': {'F':'#', 'C':'#', 'G':'#', 'D':'#', 'A':'#'}
  }  

  export const accidentalOffsets = {
    'bb':-2,'b':-1,'n':0,'#':1,'x':2
  }