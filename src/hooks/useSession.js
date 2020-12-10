import { useEffect, useState } from 'react';

import axios from 'axios';

import {
  API_ROUTE_AUTH_CHECK_SESSION,
  TOKEN_VALIDITY_VALID,
} from '../functions/constants';

const useSession = () => {
  const [calledCheck, setCalledCheck] = useState(false);

  const [isValid, setIsValid] = useState(null);
  const [claims, setClaims] = useState(null);

  useEffect(() => {
    if(!calledCheck) {
      setCalledCheck(true);

      const getOpts = {
        withCredentials: true,
        validateStatus: (httpCode => httpCode === 200 || httpCode === 401),
      };

      axios.get(API_ROUTE_AUTH_CHECK_SESSION, getOpts)
        .then(res => {
          setClaims(res.data.tokenClaims);
          setIsValid(res.data.status === TOKEN_VALIDITY_VALID);
        })
        .catch(err => setIsValid(false));
    }
  }, [calledCheck]);

  return { isValid, claims };
};

export default useSession;