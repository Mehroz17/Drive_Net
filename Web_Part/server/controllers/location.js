import { location } from "../data/LocationData.js";

// Controller to fetch all names with their IDs
export const getCities = async (req, res) => {
    try {
        const cities = Object.values(location).map(item=>item.name).sort();
        res.status(200).json(cities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getAreas = async (req, res) => {

    const {city:cityRequested} = req.params;
    try {
        const city = Object.values(location).find(city=>city.name == cityRequested);
        if (!city) {
            return res.status(404).json({ message: "City not found!" });
        }
        const areas = Object.values(city.areas).map(item=>item.name)?.sort() ?? [];
        res.status(200).json(areas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

