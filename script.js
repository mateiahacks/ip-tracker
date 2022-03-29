let ip = document.getElementsByTagName('input')[0].value;
const arrow = document.getElementsByClassName('arrow')[0];
const infos = document.getElementsByClassName('info__secondLine');

arrow.addEventListener('click', () => {
    ip = document.getElementsByTagName('input')[0].value;
    getData();
});

let data = undefined;
let cords = undefined;
let map = undefined;

$.getJSON("https://api.ipify.org?format=json", function(data) {
    ip = data.ip;
    console.log(data.ip);
})

const getData = async () => {
    const apiLink = 'https://api.ipgeolocation.io/ipgeo?apiKey=740bbcdb1b434107862df384244cb0c2&ip=' + ip + '&output=json';
    const response = await fetch(apiLink);
    data = await response.json().catch((err) => console.log("err"));
    mapInit();
}

getData();


// initializing map

const mapInit = () => {
    cords = [data.latitude, data.longitude];
    if(map !== undefined) {
        map.off();
        map.remove();
    }

    let LeafIcon = L.Icon.extend({
        options: {
           iconSize:     [38, 50],
           shadowSize:   [50, 64],
           iconAnchor:   [22, 94],
           shadowAnchor: [4, 62],
           popupAnchor:  [-3, -76]
        }
    });

    let blackIcon = new LeafIcon({
        iconUrl: 'images/icon-location.svg'
    });

    map = L.map('map', {
        scrollWheelZoom: false,
        zoomControl: false,
        center: cords,
        zoom: 12
    }).setView(cords, 1);

    let marker = L.marker(cords, {icon: blackIcon}).addTo(map);

    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=w0ajVF4IwRnBuJxvsZgV',{
            tileSize: 512,
            zoomOffset: -1,
            minZoom: 13,
            attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
            crossOrigin: false
    }).addTo(map);

    infos[0].innerText = data.ip;
    infos[1].innerText = data.city + ", " + data.district;
    infos[2].innerText = data.time_zone.offset >= 0 ?  "UTC +" + data.time_zone.offset + ":00":"UTC " + data.time_zone.offset + ":00";
    infos[3].innerText = data.isp;
}

