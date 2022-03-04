// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const firebase = 'https://hcb-piso-wifi-default-rtdb.asia-southeast1.firebasedatabase.app';

export const environment = {
  production: false,
  earnings: [
    'Joanne Onsing',
    'Te Aner',
    'Te Eday'
  ],
  components: {
    'Orange Pi': 1700,
    'Custom Board': 850,
    'Coinslot': 500,
    'Wifi ng Bayan': 650,
    'USB to LAN': 330,
    'PSU': 500,
    'TP Link 110': 1790,
    'SD Card': 0,
    'Service Charge': 0
  },
  investors: [
    'Harris',
    'Homer'
  ],
  firebase: {
    earnings: `${firebase}/earnings.json`
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
