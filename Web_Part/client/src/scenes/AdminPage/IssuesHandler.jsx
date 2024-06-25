import React, { useState, useEffect } from "react";
import { Alert, Checkbox, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Link, Typography } from "@mui/material";

const IssuesHandlerComponent = () => {
    const [issues, setIssues] = useState([]);
    const [alertMsg, setAlertMsg] = useState()
    const checkboxStates = {};

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            const response = await fetch("http://localhost:3001/issues", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const data = await response.json();
                setIssues(data);
            } else {
                console.error("Failed to fetch issues:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching issues:", error);
        }
    };

    const updateIssue = async (status)=>{
        const issuesList = [];
        for (const id in checkboxStates) {
            const issue = issues.find(item=>item._id==id);
            issue.status = status;
            issuesList.push(issue);
        }
  
        const response = await fetch("http://localhost:3001/issues", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({issuesList})
        });

        if (response.ok){
            setAlertMsg("Issue Status Updated to "+status)
            setIssues([...issues])
        }
    }
    

    return (
        <Box>
            {
                alertMsg &&
                <Alert severity="success" variant="outlined" onClose={()=>{setAlertMsg(null)}}>{alertMsg}</Alert>
            }
            <Box display="flex" flexWrap="wrap" justifyContent={'end'} gap={1}>
                <Button variant="contained" onClick={()=>{updateIssue("resolved")}} >
                    Resolve
                </Button>
                <Button variant="contained" onClick={()=>{updateIssue("processing")}} >
                    Process
                </Button>
            </Box>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>User Info</TableCell>
                        <TableCell>Vehicle Ad ID</TableCell>
                        <TableCell>Details</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {issues.map((issue) => (
                        <TableRow key={issue._id}>
                            <TableCell>
                                <Box>{issue.userInfo.username}</Box>
                                <Box>{issue.userInfo.phone}</Box>
                            </TableCell>
                            <TableCell>
                                <Box>
                                    <Typography >Vehicle</Typography>
                                    <Link href={`/market/${issue.vehicleAdId}`} target="_blank" rel="noopener">
                                        {issue.vehicleAdId}
                                    </Link>
                                    {issue.sellerId? <Box>
                                        <Typography >Seller</Typography>
                                    <Link href={`/profile/${issue.sellerId}`} target="_blank" rel="noopener">
                                        {issue.sellerId}
                                    </Link>
                                    </Box>:<></>}
                                </Box>
                            </TableCell>
                            <TableCell>{issue.details}</TableCell>
                            <TableCell>{issue.category}</TableCell>
                            <TableCell>{issue.status}</TableCell>
                            <TableCell>{new Date(issue.createdAt).toLocaleString()}</TableCell>
                            <TableCell>
                                <Checkbox  
                                    value={checkboxStates[issue._id]}
                                    onChange={(event)=>checkboxStates[issue._id]= event.target.checked}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </Box>
    );
};

export default IssuesHandlerComponent;
