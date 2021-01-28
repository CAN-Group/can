import api from './connection';

export async function getCounties()
{ 
    const response = await fetch(api.endpoint('counties'));
    const json     = await response.json();

    return json.counties;
}

export async function getGeoJson()
{
    const response = await fetch(api.staticRes('counties.geojson'));
    const json     = await response.json();

    return json;
}

export async function getCases()
{
    const response = await fetch(api.endpoint('cases'));
    const json     = await response.json();

    return json.cases;
}

export async function getData()
{
    const counties = await getCounties();
    const cases    = await getCases();

    const countyInfo = await bindData(counties, cases);
    //TO jest grubymi nicmi szyte 
    return countyInfo;
}

async function bindData(counties, cases)
{
    const countyInfoMap = new Map();

    for(let index = 0; index < counties.length; index ++)
    {
        countyInfoMap.set(counties[index].id, {
            name: counties[index].name,
            population: counties[index].population,
            vid: counties[index].voivodeship_id,
            casesCount: cases[index].number_of_cases,
            lastUpdate: cases[index].updated,
        });
    }
    return countyInfoMap;
}

// async function setZoneLevel(countyInfo, zoneRange = [30,70])
// {
//     let ratioLevel = [];

//     countyInfo.forEach( (value,key) => {
//         let ratio = parseInt(value.casesCount) / parseInt(value.population) * 1000000; 
//         ratioLevel.push({key, ratio});
//     });

//     ratioLevel.sort( (a,b) => a.ratio - b.ratio);
  
//     const lowThresshold = Math.floor(0.3 * ratioLevel.length);
//     const highThresshold = Math.floor(0.7 * ratioLevel.length);

//     let color;
//     ratioLevel.forEach( (county, index) =>{
//         if(index <= lowThresshold) {
//             color = 'green';
//         }
//         else if(index >= highThresshold) {
//             color = 'red';
//         }
//         else {
//             color = 'yellow';
//         }

//         countyInfo.get(county.key).danger = color;


//     })


//     return countyInfo;
// }

export async function getProfiles()
{
    const response = await fetch(api.staticRes('routing_profiles.json'));
    return await response.json();
}