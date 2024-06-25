import React, { useState, useEffect } from "react";
import RoundProgressBar from 'components/RoundProgressBar';
import { useSelector } from 'react-redux'

import { Box, useMediaQuery } from "@mui/material";
import LineGraph from "components/lineGraph";
import { useGetData } from "hooks/apiHook";

const Dashboard = () => {
    const [report, setReport] = useState();
    const token = useSelector(state => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    useEffect(() => {
        getReport();
    }, []);

    const getReport = async () => {
        try {
            const response = await fetch("http://localhost:3001/report", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();

                setReport(data);
            } else {
                console.error("Failed to fetch report:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching report:", error);
        }
    };

    const {data:dummySiteVisitsData} = useGetData('/visits'); 
 
    return (
        report &&
        <Box
            width="100%"
            padding="2rem 6%"
            display={"flex"}
            flexDirection={isNonMobileScreens ? 'row' : 'column-reverse'}
            gap="0.5rem"
            justifyContent="space-between"
        >
            <Box flexBasis={isNonMobileScreens ?'50%':'100%'}>
                <h2>Site Visits Graph</h2>
                <LineGraph data={dummySiteVisitsData} />
            </Box>

            <Box flexBasis={isNonMobileScreens ?'50%':'100%'}>
            <Box display="flex" flexWrap="wrap" justifyContent={'center'}>
                <RoundProgressBar title='Users Registered' valueText={report.usersN} />
                <RoundProgressBar title='Vehicles on Sale' valueText={report.vehiclesN} />
                <RoundProgressBar title='Vehicles Sold'
                    isValue={true}
                    value={(report.vehiclesSoldN * 100 / report.vehiclesN)}
                    valueText={`${report.vehiclesSoldN}/${report.vehiclesN}`}
                />
                <RoundProgressBar title='Issues Resolved'
                    isValue={true}
                    value={(report.issuesResolvedN * 100 / report.issuesN)}
                    valueText={`${report.issuesResolvedN}/${report.issuesN}`}
                />
            </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;
