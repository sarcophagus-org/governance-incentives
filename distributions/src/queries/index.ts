import axios from "axios";
import { parseArgs } from "util";

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
  
    var uniq = [ ...new Set(arr) ]

    console.log(uniq)
  });
});
//make this promise a call, then console log the data

