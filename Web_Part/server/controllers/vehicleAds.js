import VehicleAd from "../models/VehicleAd.js"




export const test = async (req, res) => {
  console.log("testing1122: " + req.body.title);
  res.status(200).json(req.body);
}


export const setVehicleStatus = async (req, res) => {
  try {
    const { vehicleAdId } = req.params;
    const { status, remarks } = req.body;

    console.log("finding: " + vehicleAdId);

    const vehicle = await VehicleAd.findOne({ _id: vehicleAdId })

    vehicle.status = status;
    vehicle.remarks = remarks;
    await vehicle.save();
    res.status(200).json(vehicle);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
}

// export const createVehicleAd = async (req, res) => {
//   try {
//     console.log("testing1123332: "+req.body.title);
//     res.status(200).json(req.body);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const delVehicleAd = async (req, res) => {
  const { vehicleAdId } = req.params;
  try {
    const deletedEvent = await VehicleAd.findByIdAndDelete(vehicleAdId);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Vehicle Ad not found" });
    }

    res.status(200).json({ message: "Vehicle Ad deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const createVehicleAd = async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      price,
      estPrice,
      mileage,
      year,
      make,
      model,
      variant,
      cityReg,
      color,
      city,
      area,
      features,
      tags,
    } = req.body;

    console.log(estPrice);

    const images = req.files.map(file => file.filename);

    const newVehicleAd = new VehicleAd({
      seller: userId,
      title,
      description,
      price,
      estPrice,
      mileage,
      year,
      make,
      model,
      variant,
      location: { city, area },
      cityReg,
      color,
      images,
      features,
      tags
    });
    await newVehicleAd.save();
    res.status(201).json(newVehicleAd)
  }
  catch (err) {
    res.status(409).json({ message: err.message })
  }

}

export const updateVehicleAd = async (req, res) => {
  try {
    const {
      vehicleAdId,
      title,
      description,
      price,
      estPrice,
      mileage,
      year,
      make,
      model,
      variant,
      cityReg,
      color,
      city,
      area,
      features,
      prevImages //images that were present previously before updating
    } = req.body;

    console.log(estPrice);
    // Find the user by ID
    const vehicle = await VehicleAd.findById(vehicleAdId);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle Ad not found!" });
    }

    //there images are the new images that user uploaded
    var images = req.files.map(file => file.filename);
    images = [...images, ...prevImages];
    vehicle.title = title,
    vehicle.description = description,
    vehicle.price = price,
    vehicle.estPrice = estPrice;
    vehicle.mileage = mileage,
    vehicle.year = year,
    vehicle.make = make,
    vehicle.model = model,
    vehicle.variant = variant,
    vehicle.location = { city, area },
    vehicle.cityReg = cityReg,
    vehicle.color = color,
    vehicle.images = images,
    vehicle.features = features;
    vehicle.status = 'new';

    await vehicle.save();

    //console.log(JSON.stringify(newVehicleAd));
    res.status(201).json(vehicle)
  }
  catch (err) {
    res.status(409).json({ message: err.message })
  }

}

export const incViews = async (req, res)  =>{
  try{
    const {vehicleAdId} = req.params;
    const vehicle = await VehicleAd.findById(vehicleAdId);
    vehicle.views += 1;
    await vehicle.save();
    res.status(200).json(vehicle);
  }catch(err){
    res.status(409).json({ message: err.message })
  }
}

export const getUserVehicleAds = async (req, res) => {
  try {
    const { userId } = req.params;
    const vehicleAds = await VehicleAd.find({ seller: userId }).sort({ createdAt: -1 })
    res.status(200).json(vehicleAds);
  } catch (err) {
    res.status(409).json({ message: error.message });
  }
}

export const getVehicleAdsAll = async (req, res) => {
  try {
    const vehicleAds = await VehicleAd.find().sort({ createdAt: -1 })
    res.status(200).json(vehicleAds);
  } catch (err) {
    res.status(409).json({ message: error.message });
  }
}

export const getVehicleAds = async (req, res) => {
  try {
    const vehicleAds = await VehicleAd.find({ status: 'approved' }).sort({ createdAt: -1 })
    res.status(200).json(vehicleAds);
  } catch (err) {
    res.status(409).json({ message: error.message });
  }
}

export const getVehicleAd = async (req, res) => {
  try {
    const { vehicleAdId } = req.params;
    const vehicleAd = await VehicleAd.findById(vehicleAdId);

    res.status(200).json(vehicleAd);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }

}

export const soldVehicleAd= async (req, res) => {
  try {
    const { vehicleAdId } = req.params;
    const vehicleAd = await VehicleAd.findById(vehicleAdId);
    vehicleAd.status = 'sold';
    await vehicleAd.save();
    res.status(200).json(vehicleAd);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }

}