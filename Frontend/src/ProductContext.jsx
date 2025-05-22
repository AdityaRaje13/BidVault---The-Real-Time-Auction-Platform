import { createContext, useState, useContext } from "react";

const ProductContext = createContext();

export const ProductProvider = ({children}) => {

    const [product, setProduct] = useState({});
    const [seller, setSeller] = useState({});

    return (
        <ProductContext.Provider value={{product, setProduct, seller, setSeller}}>
            {children}
        </ProductContext.Provider>
    );
};


export const useProduct = () => useContext(ProductContext);