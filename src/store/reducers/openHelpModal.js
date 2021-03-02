const initBool = {aboutModal:{haveToOpen: true, checked: false}}

const openHelpModal= (state = initBool, action) => {
    //console.log(state);
    let nextState;
    switch (action.type) {
        case "TOGGLE_OPEN":
            nextState = {
                ...state,
                aboutModal:{haveToOpen: action.value.isActive, checked: action.value.checked}
            }
            return nextState || state;
        default:
            return state;
    }
}

export default openHelpModal;