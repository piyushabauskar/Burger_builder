import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-2a359-default-rtdb.firebaseio.com/'
});

export default instance;