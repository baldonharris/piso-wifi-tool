const firebase = 'https://hcb-piso-wifi-default-rtdb.asia-southeast1.firebasedatabase.app';

export const environment = {
  production: true,
  earnings: ['Joanne Onsing', 'Te Aner', 'Te Eday'],
  components: {
    'Orange Pi': 1700,
    'Custom Board': 850,
    Coinslot: 500,
    'Wifi ng Bayan': 650,
    'USB to LAN': 330,
    PSU: 500,
    'TP Link 110': 1790,
    'SD Card': 0,
    'Service Charge': 0,
    'Coinslot LED': 201.5
  },
  investors: ['Harris', 'Homer'],
  firebase: {
    earnings: `${firebase}/earnings.json`,
    orders: `${firebase}/orders.json`
  }
};
