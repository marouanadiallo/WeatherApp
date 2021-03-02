const initialState = { favorites: [] }

const toggleFavorite = (state = initialState, action) => {
  let nextState;
  //console.log(state);
    switch (action.type) {
      case 'TOGGLE_FAVORITE':
        const favoriteIndex = state.favorites.findIndex(elem=> elem.geocode.latitude === action.value.geocode.latitude && elem.geocode.longitude === action.value.geocode.longitude)
        if (favoriteIndex !== -1) {
          // L'item est déjà dans les favoris, on le supprime de la liste
          nextState = {
            ...state,
            favorites: state.favorites.filter( (item, index) => index !== favoriteIndex)
          }
        }
        else {
          // L'item n'est pas dans les favoris, on l'ajoute à la liste
          nextState = {
            ...state,
            favorites: [...state.favorites, action.value]
          }
        }
        return nextState || state;
    default:
      return state;
    }
}

export default toggleFavorite;