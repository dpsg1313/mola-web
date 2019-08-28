import moment from 'moment';
import AuthStore from '../stores/AuthStore';

export function set(profileId, datetime) {
    let userId = AuthStore.getUserId();
    if(!userId){
        return;
    }
    let history = get();
    history[profileId] = datetime;
    localStorage.setItem('history_' + userId, JSON.stringify(history));
}

export function get() {
    let userId = AuthStore.getUserId();
    if(!userId){
        return;
    }

    let history = localStorage.getItem('history_' + userId);
    history = history ? JSON.parse(history) : {};

    // Move history data for back compatibility with old version
    let oldHistory = localStorage.getItem('history');
    if(oldHistory){
        oldHistory = JSON.parse(oldHistory);
        history = Object.assign(oldHistory, history);
        localStorage.setItem('history_' + userId, JSON.stringify(history));
        localStorage.removeItem('history');
    }

    return history;
}

export function getSorted() {
    let history = get();
    let arr = [];
    for(let key of Object.keys(history)){
        arr.push({
            profileId: key,
            datetime: history[key]
        });
    }
    arr.sort((a, b) => moment(b.datetime) - moment(a.datetime));
    return arr;
}