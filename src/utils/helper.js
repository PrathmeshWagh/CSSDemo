import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { baseURL } from './config';
import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';


export const storeData = async data => {
    try {
        await AsyncStorage.setItem('user_data', JSON.stringify(data));
    } catch (error) {
        console.log('storeData err', error);
    }
};

export const getStorageData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('user_data');
        return JSON.parse(jsonValue);
    } catch (e) {
        console.log('getStorageData err', e);
    }
};

export const postMethod = async (url, body) => {
    try {
        let internet = await NetInfo.fetch();
        let StoredData = await getStorageData();
        
        const setHeader = () => {
            if (StoredData !== null) {
                return `Bearer ${StoredData.access_token}`
            }
        };

        if (internet.isInternetReachable) {
            console.log('aaa');
            return await axios.post(baseURL + url, body, {
                headers: {
                    Authorization: setHeader(),
                    'Accept': 'application/json',
                },
            });
        } else {
            console.log('postMethod error reason is internet =>', internet);
            Snackbar.show({
                text: 'Check Your Internet',
                duration: Snackbar.LENGTH_SHORT,
                textColor: '#AE1717',
                backgroundColor: '#F2A6A6',
            });
            return internet.isInternetReachable;
        }
    } catch (e) {
        console.log('postMethod error reason is =>', e);
        return e;
    }
};

export const getMethod = async url => {
    try {
        let internet = await NetInfo.fetch();
        let StoredData = await getStorageData();
        // console.log('StoredData',StoredData.access_token);
        
        const setHeader = () => {
            if (StoredData.token !== null) {
                return `Bearer ${StoredData.access_token}`;

            }
        };

        if (internet.isInternetReachable) {
            return await axios.get(baseURL + url, {
                headers: {
                    Authorization: setHeader(),
                    'Accept': 'application/json',

                },
            });
        } else {
            console.log('getMethod error reason is internet =>', internet);
            Snackbar.show({
                text: 'Check Your Internet',
                duration: Snackbar.LENGTH_SHORT,
                textColor: '#AE1717',
                backgroundColor: '#F2A6A6',
            });
            return internet.isInternetReachable;
        }
    } catch (e) {
        console.log('getMethod error reason is =>', e);
        return e;
    }
};


export const FormPostMethod = async (url, body) => {
    try {
        let internet = await NetInfo.fetch();
        let StoredData = await getStorageData();
        const setHeader = () => {
            if (StoredData.token !== null) {
                return `Bearer ${StoredData.access_token}`;
            }
        };

        if (internet.isInternetReachable) {
            return await axios.post(baseURL + url, body, {
                maxBodyLength: 'infinity',
                headers: {
                    Authorization: setHeader(),
                    'Accept': 'application/json',
                    "Content-Type": "multipart/form-data; charset=utf-8;"

                }
            });
        } else {
            console.log('postMethod error reason is internet =>', internet);
            Snackbar.show({
                text: 'Check Your Internet',
                duration: Snackbar.LENGTH_SHORT,
                textColor: '#AE1717',
                backgroundColor: '#F2A6A6',
            });
            return internet.isInternetReachable;
        }
    } catch (error) {
        console.log('postMethod error reason is =>', error);
        return error;
    }
}