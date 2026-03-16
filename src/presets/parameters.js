/**
 * Named Gray-Scott parameter presets.
 * All use Du=0.2097, Dv=0.105 unless specified.
 *
 * Reference: Pearson (1993), Munafo's parameter map.
 */

export const PRESETS = {
  spots: {
    label: 'Spots',
    f: 0.035, k: 0.065,
    Du: 0.2097, Dv: 0.105,
    dt: 1.0,
    description: 'Isolated spots (coral-like). Classic Turing pattern.',
  },
  stripes: {
    label: 'Stripes / Labyrinths',
    f: 0.060, k: 0.062,
    Du: 0.2097, Dv: 0.105,
    dt: 1.0,
    description: 'Labyrinthine stripe patterns. Reminiscent of animal coat markings.',
  },
  worms: {
    label: 'Worms',
    f: 0.078, k: 0.061,
    Du: 0.2097, Dv: 0.105,
    dt: 1.0,
    description: 'Worm-like structures filling the space.',
  },
  mitosis: {
    label: 'Mitosis',
    f: 0.028, k: 0.053,
    Du: 0.2097, Dv: 0.105,
    dt: 1.0,
    description: 'Self-replicating spots that divide like biological cells.',
  },
  bubbles: {
    label: 'Bubbles',
    f: 0.098, k: 0.057,
    Du: 0.2097, Dv: 0.105,
    dt: 1.0,
    description: 'Growing bubble domains competing for space.',
  },
  coral: {
    label: 'Coral / Branching',
    f: 0.059, k: 0.062,
    Du: 0.2097, Dv: 0.105,
    dt: 1.0,
    description: 'Dendritic branching patterns like coral growth.',
  },
  solitons: {
    label: 'Solitons',
    f: 0.030, k: 0.057,
    Du: 0.2097, Dv: 0.105,
    dt: 1.0,
    description: 'Stable traveling wave pulses (solitons).',
  },
  chaos: {
    label: 'Chaos',
    f: 0.026, k: 0.051,
    Du: 0.2097, Dv: 0.105,
    dt: 1.0,
    description: 'Turbulent, unpredictable dynamics.',
  },
  negSpots: {
    label: 'Negative Spots',
    f: 0.039, k: 0.058,
    Du: 0.2097, Dv: 0.105,
    dt: 1.0,
    description: 'Inverted spot pattern — dark on light.',
  },
  waves: {
    label: 'Travelling Waves',
    f: 0.014, k: 0.045,
    Du: 0.2097, Dv: 0.105,
    dt: 1.0,
    description: 'Outward-propagating spiral waves.',
  },
}

export const PRESET_NAMES = Object.keys(PRESETS)

export function getPreset(name) {
  return PRESETS[name] || PRESETS.spots
}
