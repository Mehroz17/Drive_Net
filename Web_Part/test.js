// Your JSON data
const jsonData = `{
    "8": {
        "id": 8,
        "url_slug": "avalon",
        "name": "Avalon",
        "name_ur": "آویلون",
        "position": 5,
        "carsure_enabled": true,
        "active": false,
        "published": true,
        "popular": false,
        "generations": {},
        "versions": {},
        "_id": "661956b7cd9fce4950708023"
    },
    "9": {
        "id": 9,
        "url_slug": "camry",
        "name": "Camry",
        "name_ur": "کیمری",
        "position": 5,
        "carsure_enabled": true,
        "active": true,
        "published": true,
        "popular": true,
        "generations": {},
        "versions": {}
    }
}`;

// Parse JSON
const data = JSON.parse(jsonData);

// Extract names
const names = Object.values(data).map(obj => obj.name);

// Print names
console.log(names);
