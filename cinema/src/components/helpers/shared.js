import React from 'react';

export const getRoundedRating = (rating) => {
    const result = Math.round(rating);
    return <span className="float-right">Rating: {result}/10</span>
};

export const sharedGetRequestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    }
};


