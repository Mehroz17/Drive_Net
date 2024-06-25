import { useGetData } from "hooks/apiHook";
import VehicleAdWidget from "./VehicleAdWidget";
import { useState } from "react";

const VehicleAdWidgetLink = ({
  id
}) => {
  //alert(id);
  const [vehicleAd, setVehicleAd] = useState();
  const {data:vehicleData} = useGetData("/market/"+id,'', 
    {defValue: undefined,
      onSuccess: (data)=>{setVehicleAd(data)},
      //onFail: (data)=>{alert(data)}
    });

  return (
    vehicleAd?
    <VehicleAdWidget vehicle={vehicleAd}/>
    :
    <></>
  );
};

export default VehicleAdWidgetLink;
