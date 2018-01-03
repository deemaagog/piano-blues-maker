
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

const randomSections = [];

randomSections.push(
  {
    id: generateId(),
    presetId: '',
    type: 'INTRO',
    phrases: [
      {
        id: generateId(),
        type: 'I-I-I-I',
        bars: [
          {
            id: generateId(),
            trebleVoices: [
              {
                notes: [
                  { keys: ['b/4'], duration: 'qr', id: generateId() },
                  { keys: ['E/4', 'G/4'], duration: '8', id: generateId() },
                  { keys: ['C/5'], duration: '8', id: generateId() },
                  { keys: ['E/4', 'G/4'], duration: '8', id: generateId() },
                  { keys: ['Eb/4', 'Gb/4'], duration: '8', id: generateId() },
                  { keys: ['C/5'], duration: '8', id: generateId() },
                  { keys: ['Eb/4', 'Gb/4'], duration: '8', id: generateId() },
                  { keys: ['d/4', 'f/4'], duration: '8', id: generateId() },
                  { keys: ['C/5'], duration: '8', id: generateId() },
                  { keys: ['d/4', 'f/4'], duration: '8', id: generateId() },
                ],
                beams: [
                  { from: 1, to: 4 },
                  { from: 4, to: 7 },
                  { from: 7, to: 10 }
                ],
                tuplets: [
                  { from: 1, to: 4 },
                  { from: 4, to: 7 },
                  { from: 7, to: 10 }
                ],
                ties: []
              }
            ],
            bassVoices: [
              {
                notes: [
                  { keys: ['d/3'], duration: 'qr', id: generateId(), clef: 'bass' },
                  { keys: ['Bb/3'], duration: 'q', id: generateId(), clef: 'bass' },
                  { keys: ['A/3'], duration: 'q', id: generateId(), clef: 'bass' },
                  { keys: ['Ab/3'], duration: 'q', id: generateId(), clef: 'bass' }
                ]
              }
            ]
          },
          {
            id: generateId(),
            trebleVoices: [
              {
                notes: [
                  { keys: ['C/4', 'E/4'], duration: '8', id: generateId() },
                  { keys: ['C/5'], duration: '8', id: generateId() },
                  { keys: ['C/4', 'E/4'], duration: '8', id: generateId() },
                  { keys: ['C/4', 'Eb/4'], duration: '8', id: generateId() },
                  { keys: ['C/5'], duration: '8', id: generateId() },
                  { keys: ['C/4', 'Eb/4'], duration: '8', id: generateId() },
                  { keys: ['b/3', 'd/4'], duration: 'h', id: generateId() }
                ],
                tuplets: [
                  { from: 0, to: 3 },
                  { from: 3, to: 6 },
                ],
                beams: [
                  { from: 0, to: 3 },
                  { from: 3, to: 6 },
                ],
                ties: []
              }
            ],
            bassVoices: [
              {
                notes: [
                  { keys: ['g/3'], duration: 'q', id: generateId(), clef: 'bass' },
                  { keys: ['ab/2', 'gb/3'], duration: 'q', id: generateId(), clef: 'bass' },
                  { keys: ['g/2', 'f/3'], duration: 'h', id: generateId(), clef: 'bass' }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
);

randomSections.push(
  {
    id: generateId(),
    presetId: '',
    type: 'PROGRESSION',
    phrases: [
      {
        id: generateId(),
        type: 'I-I-I-I',
        bars: [
          {
            id: generateId(),
            trebleVoices: [
              {
                notes: [
                  { keys: ['E/4'], duration: '8', id: generateId(), stem: 'up' },
                  { keys: ['Bb/4', 'C/5'], duration: '8', id: generateId() },
                  { keys: ['C/5'], duration: 'qr', id: generateId() },
                  { keys: ['C/5'], duration: 'hr', id: generateId() },
                ],
                tuplets: [],
                ties: []
              }
            ],
            bassVoices: [
              {
                notes: [
                  { keys: ['C/2'], duration: 'q', id: generateId(), clef: 'bass', stem: 'up' },
                  { keys: ['G/2'], duration: '8', id: generateId(), clef: 'bass' },
                  { keys: ['E/2'], duration: '8', id: generateId(), clef: 'bass' },
                  { keys: ['G/2'], duration: 'q', id: generateId(), clef: 'bass' },
                  { keys: ['E/2'], duration: '8', id: generateId(), clef: 'bass' },
                  { keys: ['G/2'], duration: '8', id: generateId(), clef: 'bass' }
                ]
              }
            ]
          }
        ]
      }
    ]
  });


randomSections.push(
  {
    id: generateId(),
    presetId: '',
    type: 'PROGRESSION',
    phrases: [
      {
        id: generateId(),
        type: 'I-I-I-I',
        bars: [
          {
            id: generateId(),
            trebleVoices: [
              {
                notes: [
                  { keys: ['E/4'], duration: 'w', id: generateId(), stem: 'up' }
                ],
                tuplets: [],
                ties: []
              }
            ],
            bassVoices: [
              {
                notes: [
                  { keys: ['C/2'], duration: 'w', id: generateId(), clef: 'bass', stem: 'up' }
                ]
              }
            ]
          }
        ]
      }
    ]
  });

randomSections.push(
  {
    id: generateId(),
    presetId: '',
    type: 'ENDING',
    phrases: [
      {
        id: generateId(),
        type: 'I-I-I-I',
        bars: [
          {
            id: generateId(),
            trebleVoices: [
              {
                notes: [
                  { keys: ['f/4','B/4','Eb/5'], duration: 'q', id: generateId(), stem: 'up' },
                  { keys: ['E/4','Bb/4','D/5'], duration: 'h', id: generateId(), stem: 'up' },
                  { keys: ['B/4'], duration: 'qr', id: generateId(), stem: 'up' }
                ],
                tuplets: [],
                ties: []
              }
            ],
            bassVoices: [
              {
                notes: [
                  { keys: ['Db/2','Db/3'], duration: 'q', id: generateId(), clef: 'bass', stem: 'up' },
                  { keys: ['C/2','C/3'], duration: 'h', id: generateId(), clef: 'bass', stem: 'up' },
                  { keys: ['D/3'], duration: 'qr', id: generateId(), clef: 'bass', stem: 'up' }

                ]
              }
            ]
          }
        ]
      }
    ]
  });

randomSections.push(
  {
    id: generateId(),
    presetId: '',
    type: 'PROGRESSION',
    phrases: [
      {
        id: generateId(),
        type: 'I-I-I-I',
        bars: [
          {
            id: generateId(),
            trebleVoices: [
              {
                notes: [
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                  { keys: ['E/4'], duration: '16', id: '', stem: 'up' },
                ],
                tuplets: [],
                ties: []
              }
            ],
            bassVoices: [
              {
                notes: [
                  { keys: ['C/2'], duration: 'q', id: '', clef: 'bass', stem: 'up' },
                  { keys: ['G/2'], duration: '8', id: '', clef: 'bass' },
                  { keys: ['E/2'], duration: '8', id: '', clef: 'bass' },
                  { keys: ['G/2'], duration: 'q', id: '', clef: 'bass' },
                  { keys: ['E/2'], duration: '8', id: '', clef: 'bass' },
                  { keys: ['G/2'], duration: '8', id: '', clef: 'bass' }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
)

export default randomSections;