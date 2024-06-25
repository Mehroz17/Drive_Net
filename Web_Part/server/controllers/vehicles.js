import Vehicle from "../models/Vehicle.js";

export const addVehicleDetails = async (req, res) => {
  try {
      const {make, model} = req.params;
      const {variant, engineC, transType, fuelType, category} = req.body;

      const vehicle = await Vehicle.findOne({name:make})
    
      if (!vehicle) {
          return res.status(404).json({ message: "Vehicle not found" });
      }
      const jsonData = JSON.stringify(vehicle);
      const data = JSON.parse(jsonData);
      const modelId = Object.values(data.models).find(item=>item.name==model).id;
      const vehModel = vehicle.models.get(`${modelId}`);
      if (! Array.isArray(vehModel.versions)) {
        vehModel.versions = []
      }

      const varientToUpdate = variant? variant : 'default';

      console.log('update the variant: '+varientToUpdate);

      //if varient is defined, then find this varient in array
      //if varient found, then update it
      const jsonVariants = JSON.parse(JSON.stringify(vehModel.versions));
      const target = jsonVariants.find(item=>item.name === varientToUpdate); //this line works
      //const target = vehModel.versions.find(item=>item.name == 'default');  // but this doesn't
 
      if (target){
        target.engineC = engineC;
        target.fuelType = fuelType;
        target.transType = transType;
        target.category = category;
      }else{
        jsonVariants.push({
            name:varientToUpdate,
            engineC,
            fuelType,
            transType,
            category
        });
      }
      vehModel.versions = []
      vehModel.versions = jsonVariants;
      //vehModel.versions = [];
      await vehicle.save();
      res.status(200).json(vehModel);
  } catch (error) {
        console.log(error.message);
      res.status(500).json({ message: error.message });
  }
};


export const getVehicleDetails = async (req, res) => {
    try {
        const {make, model} = req.params;
        console.log(model)
        const {variant} = req.query;
        console.log(variant)
        const vehicle = await Vehicle.findOne({name:make})
      
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        const jsonData = JSON.stringify(vehicle);
        const data = JSON.parse(jsonData);
        const modelId = Object.values(data.models).find(item=>item.name==model).id;
        const vehModel = vehicle.models.get(`${modelId}`);
        if (! Array.isArray(vehModel.versions)) {
          vehModel.versions = []
        }
  
        const varientToUpdate = variant? variant : 'default';

        //if varient is defined, then find this varient in array
        //if varient found, then update it
        const jsonVariants = JSON.parse(JSON.stringify(vehModel.versions));
        const target = jsonVariants.find(item=>item.name === varientToUpdate); //this line works
        //const target = vehModel.versions.find(item=>item.name == 'default');  // but this doesn't
        res.status(200).json(target);
    } catch (error) {
          console.log(error.message);
        res.status(500).json({ message: error.message });
    }
  };
  


// Controller to fetch all names with their IDs
export const getVehicleMakes = async (req, res) => {
    try {
        const vehicleMakes = await Vehicle.find({}, { _id: 0, name: 1 });
        res.status(200).json(vehicleMakes.map(obj=>obj.name));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Controller to get all names of models based on the vehicle ID
export const getVehicleModels = async (req, res) => {
    try {

        //make could be suzuki, toyota, etc
        //and models returned will be for example for suzuki -> vxl, vxr
        const { make } = req.params;
        const vehicle = await Vehicle.findOne({name:make})
    
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        const jsonData = JSON.stringify(vehicle);
        const data = JSON.parse(jsonData);
        const names = Object.values(data.models).map(obj => obj.name);
        /**
         * the following code didn't work due to unknown reason,
         * but its same as our current code
         *        const models = vehicle.models;
         *        const modelNames = Object.values(vehicle.models).map(model => model.name);
         */
        res.status(200).json(names);
    } catch (error) {
        // If an error occurs, respond with an error message
        res.status(500).json({ message: error.message });
    }
};
