import axios from "axios";

interface Transfer {
  from: string;
}

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

export async function stakingAddresses(): Promise<string[]> {
  const transfersData = await subgraphQuery(FETCH_STAKERS())
  const transfers: Transfer[] = transfersData.transfers
  const vrAddresses = transfers.map((transfer) => transfer.from)
  const uniqueVrAddresses = [ ...new Set(vrAddresses) ]
  return uniqueVrAddresses
}

