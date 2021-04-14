import { gql } from 'apollo-boost';
import {
    addItemToCart,
    clearItemFromCart,
    getCartItemCount,
    getCartTotal,
    removeItemFromCart,
} from './cart.utils';

// * Types definitions, ideally should be capitalized, that is why differ with the resolver.
export const typeDefs = gql`
    extend type Item {
        quantity: Int
    }

    extend type DateTime {
        nanoseconds: Int!
        seconds: Int!
    }
    
    extend type User {
        id: ID!
        displayName: String!
        email: String!
        createdAt: DateTime!
    }

    extend type Mutation {
        AddItemToCart(item: Item!): [Item]!
        ClearItemFromCart(item: Item!): [Item]!
        RemoveItemFromCart(item: Item!): [Item]!
        SetCurrentUser(user: User!): User!
        ToggleCartHidden: Boolean!
    }
`;

const GET_CART_HIDDEN = gql`
    {
        cartHidden @client
    }
`;

const GET_CART_ITEMS = gql`
    {
        cartItems @client
    }
`;

const GET_CART_TOTAL = gql`
    {
        cartTotal @client
    }
`;

const GET_ITEM_COUNT = gql`
    {
        itemCount @client
    }
`;

const GET_CURRENT_USER = gql`
    {
        currentUser @client
    }
`;

const updateCartItemsRelatedQueries = (cache, newCartItems) => {
    cache.writeQuery({
        query: GET_ITEM_COUNT,
        data: { itemCount: getCartItemCount(newCartItems) },
    });

    cache.writeQuery({
        query: GET_CART_TOTAL,
        data: { cartTotal: getCartTotal(newCartItems) },
    });

    cache.writeQuery({
        query: GET_CART_ITEMS,
        data: { cartItems: newCartItems },
    });
};

export const resolvers = {
    Mutation: {
        toggleCartHidden: (_root, _args, { cache }) => {
            const { cartHidden } = cache.readQuery({
                query: GET_CART_HIDDEN,
            });

            cache.writeQuery({
                query: GET_CART_HIDDEN,
                data: { cartHidden: !cartHidden },
            });

            return !cartHidden;
        },

        addItemToCart: (_root, { item }, { cache }) => {
            const { cartItems } = cache.readQuery({
                query: GET_CART_ITEMS,
            });

            const newCartItems = addItemToCart(cartItems, item);

            updateCartItemsRelatedQueries(cache, newCartItems);

            return newCartItems;
        },

        removeItemFromCart: (_root, { item }, { cache }) => {
            const { cartItems } = cache.readQuery({
                query: GET_CART_ITEMS,
            });

            const newCartItems = removeItemFromCart(cartItems, item);

            updateCartItemsRelatedQueries(cache, newCartItems);

            return newCartItems;
        },

        clearItemFromCart: (_root, { item }, { cache }) => {
            const { cartItems } = cache.readQuery({
                query: GET_CART_ITEMS,
            });

            const newCartItems = clearItemFromCart(cartItems, item);

            updateCartItemsRelatedQueries(cache, newCartItems);

            return newCartItems;
        },
        setCurrentUser: (_root, { user }, { cache }) => {
            cache.writeQuery({
                query: GET_CURRENT_USER,
                data: { currentUser: user },
            });

            return user;
        },
    },
};
