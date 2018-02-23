export const setEnding = (id) => {
    return {
        type: 'SET_ENDING',
        id
    }
}

// export const setEndingData = (data) => {
//     return {
//         type: 'SET_ENDING_DATA',
//         data
//     }
// }

// export const fetchError = (bool) => {
//     return {
//         type: 'FETCH_ERROR',
//         fetchError: bool
//     }
// }

//thunk  async action

// export function fetchEnding(id) {
//     return (dispatch) => {
//         if (id === null) {
//             return dispatch(setEndingData(null))
//         }  
          
//         fetch(`/presets/${id}.json`)
//             .then(response => response.json())
//             .then(data => dispatch(setEndingData(data)))
//             .catch(err => console.log(err));
//     };
// }