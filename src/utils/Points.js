import FunctionStore from '../stores/FunctionStore';
import StructureStore from '../stores/StructureStore';

export function calculate(getProfile, giveProfile) {
    let functions = FunctionStore.getFunctions();
    let giveFunction = functions[giveProfile.functionId];
    
    if(!giveFunction) {
        return 0;
    }

    let sameGroupLevel = getSameGroupLevel(getProfile, giveProfile);
    if(sameGroupLevel == null){
        return 0;
    }

    let points = distanceCorrection(functionBasePoints(giveFunction.id), giveFunction.level, sameGroupLevel);

    points += associationBonus(giveProfile);

    points += giveProfile.woodbadgeCount * 0.5; // 1/2 point per woodbadge bead

    if (giveProfile.priest){
        // If person is a priest then points are doubled
        // Don't add this bonus at the moment
        //points *= 2;
    }

    return points;
}

function functionBasePoints(functionId) {
    switch (functionId) {
        case "0-1": // kein Amt
            return 0;
        case "1-1": // Leiter
            return 1;
        case "1-2": // StaVo
            return 5;
        case "2-1": // BezirksAK
            return 6;
        case "2-2": // Bezirksreferent
            return 10;
        case "2-3": // BeVo
            return 15;
        case "3-1": // DiöAK
            return 14;
        case "3-2": // Diöreferent
            return 20;
        case "3-3": // DeVo
            return 30;
        case "4-1": // BundesAK
            return 35;
        case "4-2": // Bundeshauptamt
            return 35;
        case "4-3": // Bundesreferent
            return 40;
        case "4-4": // BuVo
            return 50;
        case "5-1": // International
            return 48;
        default:
            return 0;
    }
}

function getSameGroupLevel(profileA, profileB) {
    let sameGroupLevel = 'world';

    if(profileB.dioceseId === profileA.dioceseId) {
        sameGroupLevel = 'diocese';

        if(profileB.tribeId === profileA.tribeId) {
            sameGroupLevel = "tribe";
        }else{
            let dioceses = StructureStore.getDioceses();
            let diocese = dioceses[profileB.dioceseId];

            if(!diocese){
                return null;
            }

            if(diocese.hasRegions && profileB.regionId === profileA.regionId) {
                sameGroupLevel = "region";
            }
        }
    }
    return sameGroupLevel;
}

function distanceCorrection(functionBasePoints, functionLevel, sameGroupLevel) {
    let points = functionBasePoints;
    switch (functionLevel) {
        case 'Diocese':
            if(sameGroupLevel === 'world') {
                points += 2;
            }
            break;

        case 'Region':
            if (sameGroupLevel === 'world') {
                points += 2;
            }else if(sameGroupLevel === 'diocese') {
                points += 1;
            }
            break;

        case 'Tribe':
            if (sameGroupLevel === 'world') {
                points += 2;
            }else if (sameGroupLevel === 'diocese') {
                points += 1;
            }else if(sameGroupLevel === 'tribe') {
                // functions on tribe level don't give points for members of the same tribe
                points = 0;
            }
            break;
        case 'None':
        case 'Bund':
        default:
            break;
    }
    return points;
}

function associationBonus(profile) {
    let bonus = 0;
    switch (profile.association) {
        case 'kein e.V.-Mitglied':
            bonus = 0;
            break;
        case 'Stammes-e.V.':
            bonus = 1;
            break;
        case 'Bezirks-e.V.':
            bonus = 2;
            break;
        case 'Diözesan-e.V.':
            bonus = 3;
            break;
        case 'Bundes-e.V.':
            bonus = 5;
            break;
        default:
            bonus = 0;
            break;
    }
    if(profile.functionId === '0-1') {
        // if no function then bonus is doubled
        bonus *= 2;
    }
    return bonus;
}