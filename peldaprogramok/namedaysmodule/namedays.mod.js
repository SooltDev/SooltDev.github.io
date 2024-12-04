const nameDays = (function(){

    const uri = 'https://raw.githubusercontent.com/SooltDev/JSON/main/nevnapok.json';
    let nameDaysData = [];

    const fetchData = fetch(uri);

    const loadData = async function() {
        const res = await fetchData;
        
        if (!res.bodyUsed)
            nameDaysData = await res.json();  

        return nameDaysData;
    }

    const getNameDays = async function() {
        const d = new Date();
        let month = d.getMonth() + 1;
        let date = d.getDate();

        let data = await loadData();

        return data[month][date];
    }

    const getNameDaysToName = async function(name) {    
    
        const ret = {
            main: [],
            other:[]
        };

        await loadData();
    
        for (let month in nameDaysData){
            for (let day in nameDaysData[month]){

                if ( nameDaysData[month][day].main.join().toUpperCase().includes(name.toUpperCase()) )
                    ret.main.push({month, day});
    
                if ( nameDaysData[month][day].other.join().toUpperCase().includes(name.toUpperCase()) )
                    ret.other.push({month, day});
            }
        }
    
        return ret;
    }

    return {
        getNameDays, getNameDaysToName
    }
})();