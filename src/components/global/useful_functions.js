import React from 'react';
import RegionImages from '../../_static/region-images';
// /////////////////////////////////////////////////////////////////////
function GetMyRank(users) {
  // console.log(users)
  for (let i = 0; i < users.length; i++) {
    if (window.steamid == users[i].id) {
      return users[i].rank;
    }
  }
}
// /////////////////////////////////////////////////////////////////////
function compare(a, b) {
  if (a.rank < b.rank) return -1;
  if (a.rank > b.rank) return 1;
  return 0;
}
// /////////////////////////////////////////////////////////////////////
function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
// //////////////////////////////////////////////////////////////
function GetUsername(users, id) {
  for (let i = 0; i < users.length; i++) {
    if (id == users[i].id) {
      return users[i].name;
    }
  }
  return 'Anonymous';
}
function ConvertTeam(obj) {
  switch (obj.teamId) {
    case 'COLONIALS':
      return 'colonial';
      break;
    case 'WARDENS':
      return 'warden';
      break;
    case 'NONE':
      return 'neutral';
      break;
    default:
  }
}
// /////////////////////////////////////////////////////////////////////
function GetAvatar(users, id) {
  if (id.includes('anonymous')) {
    return 'https://cdn.glitch.com/dd3f06b2-b7d4-4ccc-8675-05897efc4bb5%2Fdasd.jpg?1556805827222';
  }
  for (let i = 0; i < users.length; i++) {
    if (id == users[i].id) {
      return users[i].avatar;
    }
  }
  return 'https://cdn.glitch.com/dd3f06b2-b7d4-4ccc-8675-05897efc4bb5%2Fdasd.jpg?1556805827222';
}
// ////////////////////////////////////////////////////////////////////
function GetUser(users, id) {
  // console.log("Checking user",users,id)
  for (let i = 0; i < users.length; i++) {
    if (id == users[i].id) {
      const user = JSON.parse(JSON.stringify(users[i]));
      user.valid = true;
      if (user.id.includes('anonymous')) {
        user.avatar = 'https://cdn.glitch.com/dd3f06b2-b7d4-4ccc-8675-05897efc4bb5%2Fdasd.jpg?1556805827222';
      }
      return user;
    }
  }
  return { valid: false, role: 0 };
}
// /////////////////////////////////////////////////////////////////////
function signature(obj) {
  if (obj.regionId == undefined) {
    return obj.x + obj.y;
  }
  return obj.x + obj.y + obj.regionId;
}
// /////////////////////////////////////////////////////////////////////
function GetUpdate(props) {
  const { obj } = props;
  // console.log("Update obj",obj)
  return (
    <div
      className="card-header cardheader"
      data-toggle="collapse"
      href="#cardnotes"
    >
      Last Update:
      {' '}
      {GetDateString(new Date(obj.lastupdate))}
    </div>
  );

  function GetDateString(date) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const day = addZero(date.getDate());
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    if (year < 1100) {
      return 'None';
    }
    const hour = addZero(date.getHours());
    const minute = addZero(date.getMinutes());
    const second = addZero(date.getSeconds());
    const string = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    return string;
  }

  function addZero(num) {
    if (num < 10) {
      num = `0${num}`;
    }
    return num;
  }
}
// /////////////////////////////////////////////////////////////////////
function SplitTime(time) {
  let diffDays = Math.floor(time / 86400000);
  if (diffDays < 10) {
    diffDays = `0${diffDays}`;
  }
  let diffHrs = Math.floor((time % 86400000) / 3600000); // hours
  if (diffHrs < 10) {
    diffHrs = `0${diffHrs}`;
  }
  let diffMins = Math.floor(((time % 86400000) % 3600000) / 60000);
  if (diffMins < 10) {
    diffMins = `0${diffMins}`;
  }
  let diffSec = Math.floor((((time % 86400000) % 3600000) % 60000) / 1000);
  if (diffSec < 10) {
    diffSec = `0${diffSec}`;
  }
  const timestring = `${diffDays}:${diffHrs}:${diffMins}:${diffSec}`;
  return timestring;
}
// //////////////////////////////////////////////////////////////////
function GetTownName(regionid, town, staticdata) {
  let labellist = [];
  for (var i = 0; i <= RegionImages.regionCounter; i++) {
    if (regionid == staticdata[i].regionId) {
      labellist = staticdata[i].data.mapTextItems;
    }
  }
  function compare(a, b) {
    if (a.distance < b.distance) return -1;
    if (a.distance > b.distance) return 1;
    return 0;
  }
  try {
    for (var i = 0; i < labellist.length; i++) {
      const xdif = Math.abs(town.x - labellist[i].x);
      const ydif = Math.abs(town.y - labellist[i].y);
      const distance = Math.sqrt(Math.pow(xdif, 2) + Math.pow(ydif, 2));
      labellist[i].distance = distance;
    }
    labellist.sort(compare);
  } catch (err) {
    console.log(err, staticdata, regionid);
  }
  try {
    return labellist[0].text;
  } catch (err) {
    console.log(err);
    console.log('regionid', regionid);
    console.log('staticdata', staticdata);
    console.log('labellist', labellist);

    return 'undefined';
  }
}
// //////////////////////////////////////////////
function convert(regionid, x, y) {
  return RegionImages.convert(regionid, x, y);
}
// //////////////////////////////////////////////////
const GetStoreProps = (store) => {
  const privateinfo = store.private;
  const { selected } = store;
  if (selected.type == '' || selected.key == '') {
    return {
      storeObj: {},
      selected,
    };
  }
  let obj = {};
  if (selected.townname == 'misc') {
    obj = privateinfo.misc[selected.type][selected.key];
  } else {
    obj = privateinfo[selected.type][selected.key];
  }
  if (obj == undefined) {
    obj = {};
  } else if (selected.townname == 'misc') {
    obj = JSON.parse(
      JSON.stringify(privateinfo.misc[selected.type][selected.key]),
    );
  } else {
    obj = JSON.parse(
      JSON.stringify(privateinfo[selected.type][selected.key]),
    );
  }
  return {
    storeObj: obj,
    selected,
    refinery: privateinfo.refinery[selected.refinery],
    production: privateinfo.production[selected.production],
    storage: privateinfo.storage[selected.storage],
  };
};
// ////////////////////////////////
const squadnumbers = [
  'https://cdn.glitch.com/dd3f06b2-b7d4-4ccc-8675-05897efc4bb5%2F1s.png?1557484360213',
  'https://cdn.glitch.com/dd3f06b2-b7d4-4ccc-8675-05897efc4bb5%2Fs2.png?1557485248288',
  'https://cdn.glitch.com/dd3f06b2-b7d4-4ccc-8675-05897efc4bb5%2Fs3.png?1557485249108',
  'https://cdn.glitch.com/dd3f06b2-b7d4-4ccc-8675-05897efc4bb5%2Fs4.png?1557485250384',
  'https://cdn.glitch.com/dd3f06b2-b7d4-4ccc-8675-05897efc4bb5%2Fs5.png?1557485251552',
];
// //////////////////////////////////////////////////////////////////////////
const roleicons = [
  {
    name: 'No role',
    url:
      'https://cdn.glitch.com/dd3f06b2-b7d4-4ccc-8675-05897efc4bb5%2Ftrasp.png?1557577826580',
  },

  {
    name: '  Medic',
    url:
      'https://cdn.glitch.com/dd3f06b2-b7d4-4ccc-8675-05897efc4bb5%2F6393f3fd-16a7-4641-ae3d-994f8e7cea4eIconFilterMedical.png?1554067564203',
  },
  {
    name: '  Engineer',
    url:
      'https://cdn.glitch.com/6393f3fd-16a7-4641-ae3d-994f8e7cea4e%2FIconFilterUtility.png?1548935226605',
  },
  {
    name: '  Scrapper',
    url:
      'https://cdn.glitch.com/dd3f06b2-b7d4-4ccc-8675-05897efc4bb5%2F98ac14b2-4603-4541-b92e-320b855d2e65SledgeHammerItemIcon.png?1554067559208',
  },
  {
    name: '  Rifleman',
    url:
      'https://cdn.glitch.com/dd3f06b2-b7d4-4ccc-8675-05897efc4bb5%2F98ac14b2-4603-4541-b92e-320b855d2e65RifleItemIcon.png?1554067557676',
  },
  {
    name: '  Sniper',
    url:
      'https://cdn.glitch.com/dd3f06b2-b7d4-4ccc-8675-05897efc4bb5%2F98ac14b2-4603-4541-b92e-320b855d2e65SniperRifleItemIcon.png?1554067559653',
  },
  {
    name: '  Machine Gunner',
    url:
      'https://cdn.glitch.com/dd3f06b2-b7d4-4ccc-8675-05897efc4bb5%2F98ac14b2-4603-4541-b92e-320b855d2e65HeavyMachineGunIcon.png?1554067573521',
  },
  {
    name: '  Grenadier',
    url:
      'https://cdn.glitch.com/dd3f06b2-b7d4-4ccc-8675-05897efc4bb5%2F98ac14b2-4603-4541-b92e-320b855d2e65GrenadeItemIcon.png?1554067573845',
  },
  {
    name: '  RPG',
    url:
      'https://cdn.glitch.com/6393f3fd-16a7-4641-ae3d-994f8e7cea4e%2FRpgItemIcon.png?1548192480952',
  },
  {
    name: '  Artillery Crew',
    url:
      'https://cdn.glitch.com/dd3f06b2-b7d4-4ccc-8675-05897efc4bb5%2FField_Artillery.png?1555248898255',
  },
  {
    name: '  Sailor',
    url:
      'https://cdn.glitch.com/6393f3fd-16a7-4641-ae3d-994f8e7cea4e%2FMapIconShipyard.png?1547280455531',
  },
  {
    name: '  Vehicle Crew',
    url:
      'https://cdn.glitch.com/6393f3fd-16a7-4641-ae3d-994f8e7cea4e%2FPistolItemIcon.png?v=1548192477296',
  },
];
// ///////////////////////////////////////////////////////////////////////////
function GetShortDate(date) {
  let datestring = new Date(date).toDateString();
  datestring = datestring.split(' ');
  let timestring = new Date(date).toLocaleTimeString();
  timestring = timestring.split(':');
  return (
    `${datestring[1]
    } ${
      datestring[2]
    } ${
      datestring[3]
    } ${
      timestring[0]
    }:${
      timestring[1]}`
  );
}
// ////////////////////////////
function FormatNumber(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
// ///////////////////////////
export default {
  GetUpdate,
  GetMyRank,
  compare,
  GetUsername,
  GetAvatar,
  GetUser,
  signature,
  SplitTime,
  GetStoreProps,
  squadnumbers,
  roleicons,
  GetTownName,
  convert,
  ConvertTeam,
  copy,
  GetShortDate,
  FormatNumber,
};
