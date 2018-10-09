console.log(Redux);

const { createStore} = Redux;

const initialState ={
  selectedFrets: [],
  selectedStrings: [],
  colorSelectedFrets: 'rgba(0,0,255, 0.3)',
  colorSelectedStrings: 'rgba(250,0,0, 0.3)',
},

const dataReducer = (state, {type, payload}) =>{
  switch(type){
    case type === types.ADD_HIGHLIGHTS:
      return {
        ...state,
        selectedFrets: payload,
      };

      case type === types.ADD_SELECTION_STRING:
        return {
          ...state,
          selectedStrings: selectedStrings,
        };
      case type === types.REMOVE_ALL_SELECTION:
        return {
          ...state,
          selectedStrings: [...state.selectedStrings, payload],
        };
    default: 
      return {...state};
  }
}

const types = {
  ADD_HIGHLIGHTS: 'ADD_HIGHLIGHTS',
  ADD_SELECTION_STRING: 'ADD_SELECTION_STRING',
  REMOVE_ALL_SELECTION: 'REMOVE_ALL_SELECTION',
};

const actions = {
  addHighlights: (frets) => ({type: types.ADD_HIGHLIGHTS, payload: frets}),
  addSelectionString: (string, fret) =>({type: types.ADD_SELECTION_STRING, payload: {string, fret}}),
  removeAllSelection: ()=>({type: types.REMOVE_ALL_SELECTION}),
}

