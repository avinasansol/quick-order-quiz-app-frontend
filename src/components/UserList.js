import React, { useState, useEffect } from 'react';
import { request } from '../api'; // Import the request function
import '../css/UserList.css';
import spinner from '../public/spinner.gif';

// Helper function to capitalize each word
const capitalizeWords = (str) => {
    const capitalizedStr = str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    if (capitalizedStr.length <= 16) {
        return capitalizedStr;
    }

    // Truncate without breaking the last word
    const truncatedStr = capitalizedStr.slice(0, 16);
    return truncatedStr.slice(0, truncatedStr.lastIndexOf(' '));
};

const UserList = ({ username }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = () => {
            setLoading(true); // Set loading to true before making the request
            request("GET", "/api/user/all", {})
                .then(response => {
                    const sortedData = response.data.sort((a, b) => b.points - a.points);
                    setData(sortedData);
                    setLoading(false); // Set loading to false after data is fetched
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setLoading(false); // Set loading to false even if there's an error
                });
        };

        // Fetch data initially
        fetchData();

        // Set up the interval to refresh data every 20 seconds
        const intervalId = setInterval(fetchData, 20000);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const assignRanks = (users) => {
        let rank = 1;
        return users.map((user, index) => {
            if (index > 0 && user.points < users[index - 1].points) {
                rank = index + 1;
            }
            return { ...user, rank };
        });
    };

    const rankedData = data ? assignRanks(data) : [];

    return (
        <>
            {loading ? (
                <div>
                    <div className="user-list-load">
                        <p><img src={spinner} alt="Loading User List..." /></p>
                    </div>
                </div>
            ) : (
                data && data.length > 0 ? (
                    <div>
                        <div className="user-list-grid">
                            <div className="user-list-header">
                                <div>Rank</div>
                                <div>Name</div>
                                <div>Points</div>
                            </div>
                            {rankedData.map((user, index) => (
                                <div
                                    key={index}
                                    className={`user-list-row ${user.name === username ? 'highlighted' : ''}`}
                                >
                                    <div className="user-rank">{user.rank}</div>
                                    <div className="user-name">{capitalizeWords(user.name)}</div>
                                    <div className="user-points">{user.points}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>No Users Found</p>
                )
            )}
        </>
    );
};

export default UserList;
