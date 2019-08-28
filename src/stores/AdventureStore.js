import moment from 'moment';
import Config from '../Config';
import AuthStore from './AuthStore';

const cachePrefix = 'mola-adventure-cache_';

export function get(profileId) {
    return new Promise((resolve, reject) => {
        let key = cachePrefix + profileId;
        let string = localStorage.getItem(key);
        if(string === null){
            console.log('AdventuresStore: cache not found');
            fetchAndCache(profileId)
            .then((adventures) => {
                resolve(adventures);
            })
            .catch((error) => {
                reject(error);
            })
        }else{
            console.log('AdventuresStore: cache found');
            let cache = JSON.parse(string);
            if(moment(cache.cacheTime).isBefore(moment().subtract(Config.cacheTTL, 'minutes'))){
                console.log('AdventuresStore: cache too old');
                fetchAndCache(profileId)
                .then((adventures) => {
                    resolve(adventures);
                })
                .catch((error) => {
                    console.log(error);
                    console.log('AdventuresStore: serving from cache');
                    resolve(cache.data);
                })
            }else{
                console.log('AdventuresStore: serving from cache');
                resolve(cache.data);
            }
        }
    });
}

function fetchAndCache(profileId){
    console.log('AdventuresStore: fetching from api');
    return fetch(
        Config.baseUrl + 'adventures/' + profileId, 
        { 
            headers: new Headers({ 
                'Authorization': 'Bearer ' + AuthStore.getAuthToken(),
                'Content-Type': 'application/json'
            }),
        }
    ).then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error('API response status code was: ' + response.status);
    }).then(adventures => {
        set(profileId, adventures);
        return adventures;
    })
}

export function set(profileId, adventures) {
    let key = cachePrefix + profileId;
    let content = {
        cacheTime: moment(),
        data: adventures
    }
    localStorage.setItem(key, JSON.stringify(content));
}