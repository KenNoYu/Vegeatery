import React, { useState, useEffect } from "react";
import http from "../../../http";
import { Button, TextField, Card, CardContent, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

const AdminPointsManager = () => {
    const [points, setPoints] = useState([]);
    const [newPoint, setNewPoint] = useState("");
    const [newDescription, setNewDescription] = useState("");


    // Fetch points from backend
    useEffect(() => {
        http.get("/Points") // Using the custom axios instance
            .then((response) => setPoints(response.data))
            .catch((error) => console.error(error));
    }, []);

    // Add a new point
    const handleAddPoint = () => {
        if (newPoint < 1 || newPoint > 5) {
            alert("Points must be between 1 and 5.");
            return;
        }
        http.post("/Points", { value: newPoint, description: newDescription }) // Using the custom axios instance
            .then((response) => {
                setPoints([...points, response.data]);
                setNewPoint("");
                setNewDescription("");
            })
            .catch((error) => console.error(error));
    };

    // Delete a point
    const handleDeletePoint = (id) => {
        http.delete(`/Points/${id}`) // Using the custom axios instance
            .then(() => {
                setPoints(points.filter((point) => point.id !== id));
            })
            .catch((error) => console.error(error));
    };

    return (
        <div>
            <h1>Manage Points</h1>
            <div style={{ marginBottom: "20px" }}>

                <TextField
                    label="Title of Point"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={1} // Adjust as needed
                    style={{ marginTop: "10px" }}
                />

                <TextField
                    type="number"
                    label="Point Value (1-5)"
                    value={newPoint}
                    onChange={(e) => setNewPoint(e.target.value)}
                />




                <Button onClick={handleAddPoint} variant="contained" style={{ marginLeft: "10px" }}>
                    Add Point
                </Button>
            </div>

            {points.map((point) => (
                <Card key={point.id} style={{ marginBottom: "10px" }}>
                    <CardContent>
                        {point.description && (
                            <div style={{ fontWeight: 'bold' }}>
                                {point.description}
                            </div>
                        )}
                        <div>Point Value: {point.value}</div>
                        <IconButton
                            onClick={() => handleDeletePoint(point.id)}
                            style={{ float: "right" }}
                        >
                            <Delete />
                        </IconButton>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default AdminPointsManager;
