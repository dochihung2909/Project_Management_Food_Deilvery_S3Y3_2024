export const CartReducer = (current, action) => {
    switch (action.type) {
        case "add":
            return action.payload;
        case "remove":
            return action.payload; 
        case "payment":
            return null;
    }
    return current;
}