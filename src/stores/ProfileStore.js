import moment from 'moment';
import Config from '../Config';
import AuthStore from './AuthStore';

const cachePrefix = 'mola-profile-cache_';
const cacheTTL = 2; // Minutes

export function get(profileId, forceRefresh=false, onNetwork) {
    return new Promise((resolve, reject) => {
        let key = cachePrefix + profileId;
        let string = localStorage.getItem(key);
        if(string === null){
            console.log('ProfileStore: cache not found');
            fetchAndCache(profileId)
            .then((profile) => {
                resolve(profile);
            })
            .catch((error) => {
                reject(error);
            })
        }else{
            console.log('ProfileStore: cache found');
            let cache = JSON.parse(string);
            if(moment(cache.cacheTime).isBefore(moment().subtract(cacheTTL, 'minutes'))){
                console.log('ProfileStore: cache too old');
                fetchAndCache(profileId)
                .then((profile) => {
                    resolve(profile);
                })
                .catch((error) => {
                    console.log(error);
                    console.log('AdventuresStore: serving from cache');
                    resolve(cache.data);
                })
            }else{
                console.log('ProfileStore: serving from cache');
                resolve(cache.data);
            }
        }
    });
}

function fetchAndCache(profileId){
    console.log('ProfileStore: fetching from api');
    return fetch(
        Config.baseUrl + 'profile/' + profileId, 
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
    }).then(profile => {
        set(profileId, profile);
        return profile;
    })
}

export function set(profileId, profile) {
    let key = cachePrefix + profileId;
    let content = {
        cacheTime: moment(),
        data: profile
    }
    localStorage.setItem(key, JSON.stringify(content));
}