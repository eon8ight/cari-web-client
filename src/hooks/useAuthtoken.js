import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
  API_ROUTE_AUTH_CHECK_TOKEN,
  TOKEN_VALIDITY_VALID,
} from '../functions/constants'

const useAuthtoken = tokenType => {
  const loc = useLocation();

  const queryParams = loc.search
        .replace(/^[?]/, '')
        .split('&')
        .reduce((acc, val) => {
          const [key, value] = val.split('=');
          acc[key] = value;
          return acc;
        }, {});

  const token = queryParams.token;

  const [calledCheck, setCalledCheck] = useState(false);

  const [isValid, setIsValid] = useState(!token ? false : null);
  const [claims, setClaims] = useState(null);

  useEffect(() => {
    if (token && !calledCheck) {
      setCalledCheck(true);

      const getOpts = { validateStatus: (httpCode => httpCode === 200 || httpCode === 401) };

      axios.get(`${API_ROUTE_AUTH_CHECK_TOKEN}?token=${token}&type=${tokenType}`, getOpts)
        .then(res => {
          setClaims(res.data.tokenClaims);
          setIsValid(res.data.status === TOKEN_VALIDITY_VALID);
        })
        .catch(err => {
          setIsValid(false);
        });
    }
  }, [calledCheck, token, tokenType]);

  return {
    token,
    isValid,
    claims,
  };
};

export default useAuthtoken;