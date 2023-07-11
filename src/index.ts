/* eslint-disable no-console */
import { greetUser } from '$utils/greet';

window.Webflow ||= [];
window.Webflow.push(() => {
  const devBtn = document.querySelector('#devBtn');
  const subBtn = document.querySelector('#subBtn');
  // const devText = document.querySelector('#devText');
  const latForm = document.querySelector('#lat');
  const lngForm = document.querySelector('#lng');

  ///////////////////////////////////////////////////////
  const map = L.map('map').setView([44.96193, -93.19876], 12);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  // L.Control.geocoder().addTo(map);

  const schoolIcon = L.icon({
    iconUrl: 'https://img.icons8.com/fluency-systems-filled/512/school-building.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const layer = L.marker([44.962242019810816, -93.19836196172906], {
    icon: schoolIcon,
  }).addTo(map);
  layer.bindPopup('This is Avalon!').openPopup();

  const myHeaders = new Headers();
  myHeaders.append(
    'Authorization',
    'Bearer patrAJ8JGjXuGM2q1.42e1c29a4f18aa9bf9e192c82814e74e5d2ab9baae5543eb1d12f422d6461f02'
  );
  myHeaders.append(
    'Cookie',
    'brw=brwZvTCExMDX59gu8; AWSALB=y7aNExO+naIhJIQyRw6Fmi5UQZ1FRtVbaK4C50umFSJUV9ime2OaTRDvhbM1ZSWQu1P4kS4h9ai8pJUMZuPStOYw+AaBSTUUSnh4k2r+kyYgMhg6ITuMpB3Qd65K; AWSALBCORS=y7aNExO+naIhJIQyRw6Fmi5UQZ1FRtVbaK4C50umFSJUV9ime2OaTRDvhbM1ZSWQu1P4kS4h9ai8pJUMZuPStOYw+AaBSTUUSnh4k2r+kyYgMhg6ITuMpB3Qd65K'
  );

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  fetch('https://api.airtable.com/v0/appFU39SABmXIlZRs/tblYQ1DRIwpTLLUWS', requestOptions)
    .then((response) => response.json())
    .then((response) => response.records)
    .then((items) => {
      items.forEach((item) => {
        // console.log(item.fields);
        //   console.log(Lat, Lng);
        const { Name, contact, Lat, Lng, preference } = item.fields;
        const lat = Number(Lat);
        const lng = Number(Lng);
        const newMaker = L.marker([lat, lng], {
          title: Name,
          riseOnHover: true,
        }).addTo(map);
        newMaker
          .addTo(map)
          .bindPopup(
            `<b>Family:</b> ${Name}<br><b>Contact:</b> ${contact}<br><br><b>Preference:</b><br> ${preference}`
          );
      });
    })
    .catch((error) => console.log('error', error));

  let house;

  // L.Control.geocoder().addTo(map);

  map.once('click', function (e) {
    const homeIcon = L.icon({
      iconUrl: 'https://img.icons8.com/doodle/512/filled-flag.png',
      iconSize: [20, 20],
      iconAnchor: [10, -5],
    });

    house = L.marker([e.latlng.lat, e.latlng.lng], {
      draggable: true,
      icon: homeIcon,
    }).addTo(map);
    map.setView(house.getLatLng(), 14);
    house
      .bindPopup('Drag your flag to wherever you want,<br>and then submit the form below')
      .openPopup();
  });

  devBtn?.addEventListener('click', function () {
    const { lat, lng } = house.getLatLng();
    latForm.value = lat;
    lngForm.value = lng;
    const homeIcon2 = L.icon({
      iconUrl: 'https://static.wixstatic.com/media/c4450c_168cf5fbfc1b4ff5b175236c985a3086~mv2.png',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
    house.setIcon(homeIcon2);
    map.setView(house.getLatLng(), 13);
    house.bindPopup('This is you!<br>Explore the map to connect!').openPopup();
    // console.log('Ready to go');
  });

  subBtn?.addEventListener('click', function () {
    const name = document.querySelector('#name')?.value;
    const lat = document.querySelector('#lat')?.value;
    const lng = document.querySelector('#lng')?.value;
    const pref = document.querySelector('#preference')?.value;
    const cont = document.querySelector('#contact')?.value;
    const permBox = document.querySelector('#permissionBox').checked;
    const mapBox = document.querySelector('#mapBox').checked;
    const date = new Date(Date.now()).toLocaleString();
    // console.log(name, pref, cont, lat, lng, permBox);

    // map.setView(house.getLatLng(), 13);
    // house.bindPopup('This is you!<br>Explore the map to connect!').openPopup();
    // console.log(date, permBox);
    if (name && pref && cont && permBox === true && mapBox === true) {
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization:
            'Bearer patrAJ8JGjXuGM2q1.42e1c29a4f18aa9bf9e192c82814e74e5d2ab9baae5543eb1d12f422d6461f02',
        },
        body: JSON.stringify({
          fields: {
            Name: name,
            contact: cont,
            preference: pref,
            slug: name,
            Lat: lat,
            Lng: lng,
            Status: 'Active',
            date: date,
          },
        }),
      };
      fetch('https://api.airtable.com/v0/appFU39SABmXIlZRs/tblYQ1DRIwpTLLUWS', options)
        .then((response) => response.json())
        .then((response) => console.log(response))
        .catch((err) => console.error(err)); // STOPPEPD HERE

      document.querySelector('#name').value = '';
      // pref = '';
      document.querySelector('#contact').value = '';
      document.querySelector('#preference').value = '';

      document.querySelector('#permissionBox').checked = false;
      document.querySelector('#mapBox').checked = false;
      document.getElementById('submission-thanks').style.display = 'flex';
      document.querySelector('#subBtn').style.display = 'none';
      // console.log('CLEARED');
    } else console.log("something dind't work you fool");
  });

  // Assuming you have a button element with the id "scrollButton"
  // const targetElement = document.getElementById('targetElement');
  // console.log(targetElement);
  // targetElement.scrollIntoView({ behavior: 'smooth' });
  // console.log('THE END');
});

// const name = document.querySelector('#name')?.value;
// const lat = document.querySelector('#name')?.value;
// const name = document.querySelector('#name')?.value;
// const pref = document.querySelector('#preference')?.value;
// const cont = document.querySelector('#contact')?.value;
// const permBox = document.querySelector('#permissionBox').checked;
// const mapBox = document.querySelector('#mapBox').checked;
// const date = new Date(Date.now()).toLocaleString();
// console.log(name, pref, cont, permBox);
// console.log(date, permBox);
// if (name && pref && cont && permBox === true && mapBox === true) {

// const options = {
//   method: 'POST',
//   headers: {
//     accept: 'application/json',
//     'content-type': 'application/json',
//     authorization:
//       'Bearer patrAJ8JGjXuGM2q1.42e1c29a4f18aa9bf9e192c82814e74e5d2ab9baae5543eb1d12f422d6461f02',
//   },
//   body: JSON.stringify({
//     fields: {
//       Name: name,
//       contact: cont,
//       preference: pref,
//       slug: name,
//       Lat: `${lat.toString()}`,
//       Lng: `${lng.toString()}`,
//       Status: 'Active',
//       date: date,
//     },
//   }),
// };

// fetch('https://api.airtable.com/v0/appFU39SABmXIlZRs/tblYQ1DRIwpTLLUWS', options)
//   .then((response) => response.json())
//   .then((response) => console.log(response))
//   .catch((err) => console.error(err)); // STOPPEPD HERE

// const homeIcon2 = L.icon({
//   iconUrl:
//     'https://static.wixstatic.com/media/c4450c_168cf5fbfc1b4ff5b175236c985a3086~mv2.png',
//   iconSize: [20, 20],
//   iconAnchor: [15, -10],
// });
// house.setIcon(homeIcon2);
// map.setView(house.getLatLng(), 13);
// house.bindPopup('This is you!<br>Explore the map to connect!').openPopup();

// const scrollToElement = document.querySelector('#mapZoom').offsetTop;
// window.scrollTo(0, scrollToElement);
// } else console.log("something dind't work");
// });

// console.log('MANIAC YOU ? You1');
