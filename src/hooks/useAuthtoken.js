import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { API_ROUTE_AUTH_CHECK_TOKEN } from '../constants'

const useAuthtoken = () => {
  const [token, setToken] = useState(undefined);
  const [data, setData] = useState(undefined);

  const loc = useLocation();

  useEffect(() => {
    axios.get(API_ROUTE_AUTH_CHECK_TOKEN)
      .then(res => {
        const queryParams = loc.search
          .replace(/^[?]/, '')
          .split('&')
          .reduce((acc, val) => {
            const [key, value] = val.split('=');
            acc[key] = value;
            return acc;
          }, {});

        setToken(queryParams.authtoken);
        setData(res.data);
      })
      .catch(err => {
        setToken(null);
        setData(null);
      });
  }, [loc.search]);

  return { token, data };
};

export default useAuthtoken;