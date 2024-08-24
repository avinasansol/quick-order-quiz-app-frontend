import React, { useEffect, useState } from 'react';
import { request } from '../api';
import '../css/AppStatus.css';

const AppStatus = () => {
    const [status, setStatus] = useState(null);

    const fetchAppStatus = async () => {
        try {
            const response = await request("POST", "/api/appstat/", {});
            setStatus(response.data);
        } catch (error) {
            console.error('Error fetching app status:', error);
        }
    };

    useEffect(() => {
        fetchAppStatus(); // Fetch status once on component mount
    }, []); // Empty dependency array ensures it runs only once

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newStatus = status === 'Y' ? 'N' : 'Y';

        try {
            const response = await request("POST", "/api/appstat/", { activate: newStatus });
            setStatus(response.data); // Update the status based on the server response
        } catch (error) {
            console.error('Error updating app status:', error);
        }
    };

    return (
        <div className="appstat-container">
            <div className="appstat-form">
                <h2>App Status: {(status === 'Y' && "Active") || (status === 'N' && "Disabled")}</h2>
                {status !== null ? (
                    <form onSubmit={handleSubmit}>
                        <input type="hidden" name="activate" value={status === 'Y' ? 'N' : 'Y'} />
                        <button 
                            type="submit" 
                            className={status === 'Y' ? 'deactivate-button' : 'activate-button'}>
                            {status === 'Y' ? 'Deactivate' : 'Activate'}
                        </button>
                    </form>
                ) : (
                    <p>Loading status...</p>
                )}
            </div>
        </div>
    );
};

export default AppStatus;
