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

export const sharedPostRequestOptions = (data) => {
  return {method: 'POST',
  headers: { 'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
  body: JSON.stringify(data)};
  
};

export const sharedPutRequestOptions = (data) => {
  return {method: 'PUT',
  headers: { 'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
  body: JSON.stringify(data)};
  
};

export const sharedDeleteRequestOptions = {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
  }
};

export const sharedResponse = response => {
  if (!response.ok) {
    return Promise.reject(response);
}
return response.json();
};



