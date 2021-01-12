
export async function getCounties()
{ 
    const response = await fetch('data/test.csv');
    const data     = await response.text();  
    return await parseCSV(data);
}


async function parseCSV(responseText)
{
    const countiesData = [];
    const table = responseText.split('\n').slice(1);

    table.forEach(row => {
        const columns = row.split(',');
        countiesData.push(columns);
    });
    return countiesData;
}


//const rgb = (r, g ,b, a=1) => `rgb(${r},${g}, ${b}, ${a})`;   