import axios from "axios";

export function FETCH_STAKERS() {
    return `query {
        transfers {
            from
          }
      }`;
  }

export async function subgraphQuery(query) {
  try {
    const SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/solidoracle/sarcovr";
    const response = await axios.post(SUBGRAPH_URL, {
      query,
    });
    if (response.data.errors) {
      console.error(response.data.errors);
      throw new Error(`Error making subgraph query ${response.data.errors}`);
    }
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Could not query the subgraph ${error.message}`);
  }
}

export async function stakingAddy(query) {
  subgraphQuery(query).then((data) => {
    var obj_entries = Object.entries(data).map(entry => {
       return entry[1]
     })
    obj_entries.forEach(object => {
       var i=0, arr=[];
       for (let i = 0; i < 20; i++) {
         arr[i] = object[i].from
       }
  
      var sarcoVrAddy = [ ...new Set(arr) ]
     });
   });
}

subgraphQuery(FETCH_STAKERS()).then((data) => {
  var obj_entries = Object.entries(data).map(entry => {
     return entry[1]
   })
  obj_entries.forEach(object => {
     var i=0, arr=[];
     // TODO: struggling to put a variable .length
     for (let i = 0; i < 20; i++) {
       arr[i] = object[i].from
     }

    var sarcoVrAddy = [ ...new Set(arr) ]
    console.log(sarcoVrAddy)
     
   });
 });

