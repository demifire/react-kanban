

import { FETCH_ITEMS, NEW_ITEMS } from './types';
import axios from 'axios';

export const fetchItems = () => dispatch => {
    console.log('FETCHING DA FUAK');
    axios
        .get('/items')
        .then ( items => dispatch({
            type: FETCH_ITEMS,
            payload: items
        }))
        .catch( err => {
          console.log('err', err)
        })
    }
