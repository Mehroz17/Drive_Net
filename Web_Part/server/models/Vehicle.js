import mongoose, { Schema } from "mongoose";

// Define the schema for the model
const VehicleSchema = new mongoose.Schema({
    id: Number,
    url_slug: String,
    name: String,
    name_ur: String,
    position: Number,
    carsure_enabled: Boolean,
    published: Boolean,
    models: {
        type: Map,
        of: {
            id: Number,
            url_slug: String,
            name: String,
            name_ur: String,
            position: Number,
            carsure_enabled: Boolean,
            active: Boolean,
            published: Boolean,
            popular: Boolean,
            generations: {
                type: Map,
                of: Object
            },
            versions: [
                {
                    type: Map,
                    of: {
                        name: String,
                        transType: String, 
                        fuelType: String, 
                        category: String, 
                        engineC: Number,
                        
                    }
                }
            ]
        }
    }
});

// Create the model
const Vehicle = mongoose.model('Vehicle', VehicleSchema);

export default Vehicle;
