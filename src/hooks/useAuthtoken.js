import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { API_ROUTE_AUTH_CHECK_TOKEN } from '../functions/constants'

const useAuthtoken = tokenType => {
  const [token, setToken] = useState(undefined);
  const [claims, setClaims] = useState(undefined);

  const loc = useLocation();

  useEffect(() => {
    axios.get(`${API_ROUTE_AUTH_CHECK_TOKEN}${loc.search}&type=${tokenType}`)
      .then(res => {
        const queryParams = loc.search
          .replace(/^[?]/, '')
          .split('&')
          .reduce((acc, val) => {
            const [key, value] = val.split('=');
            acc[key] = value;
            return acc;
          }, {});

        setToken(queryParams.token);
        setClaims(res.data.tokenClaims);
      })
      .catch(err => {
        setToken(null);
        setClaims(null);
      });
  }, [tokenType, loc.search]);

  return { token, claims };
};

export default useAuthtoken;