
const feetInAMile = 5280;
const oneThousand= 1000;
const meters = 'meters';
const feet = 'feet';
const km = 'km';
const miles = 'miles';

const numRules = {
  'imperial': {
    unitDivider: feetInAMile,
    kmOrMiles: miles,
    mOrFt: feet
  },
  'metric': {
    unitDivider: oneThousand,
    kmOrMiles: km,
    mOrFt: meters
  }
}

export default {
  numRules
};
