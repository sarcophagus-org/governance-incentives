import axios from "axios";

export function FETCH_STAKERS() {
    return `query {
        transfers {
            id
            from
            amount
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

subgraphQuery(FETCH_STAKERS()).then((data) => {console.log(data)});
//make this promise a call, then console log the data