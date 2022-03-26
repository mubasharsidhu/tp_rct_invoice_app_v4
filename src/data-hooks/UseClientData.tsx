import { useEffect, useReducer } from "react";


//TODO always make reducers type safe when using .tsx
export const reducer = (state, action) => {

  switch(action.type) {

    case "CLEAN_LOADING" : {
      return {
        isLoaded         : false,
        targetClientToken: 111,
        error: null,
        clients: []
      }
    }
    case "SET_CLIENT_LIST" : {
      return {
        ...state,
        isLoaded : true,
        clients: action.payload.clients
      }
    }
    case "SET_CLIENT_LIST" : {
      return {
        ...state,
        isLoaded : true,
        error: action.payload.error
      }
    }

  }
  return state;

}


export const useClientData = (authToken: null | string) => {
  const [clientData, dispatchClientData] = useReducer(
    reducer,
    {
      isLoaded         : false,
      error: null as string | null,
      clients          : [] as Record<string, any>[]
    }
  );

  useEffect(()=>{

    if ( authToken == null ) {
      return;
    }

    let isEffectActive = true;

    dispatchClientData({
      type: "CLEAN_LOADING"
    });

    fetch(`${process.env.NEXT_PUBLIC_INVOICE_API_HOST}/clients`, {
      headers : {
        "Authorization": `Bearer ${authToken}`
      }
    })
    .then((httpResponse)=>{
      if ( httpResponse.status === 401 ) {
        // Some sort of logout here
      }
      return httpResponse.json();
    })
    .then((jsonResponse)=>{

      if ( isEffectActive ) {
        dispatchClientData({
          type: "SET_CLIENT_LIST",
          payload: {
            clients : jsonResponse.clients
          }
        });
      }

    })
    .catch((err)=>{
      dispatchClientData({
        type: "SET_CLIENT_FETCH_ERROR",
        payload : {
          error: "Data fetching error occured."
        }
      });
    });

    return () => {
      isEffectActive = false;
    }

  }, [authToken]);

  return [clientData, dispatchClientData];
}
