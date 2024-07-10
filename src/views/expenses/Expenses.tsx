import React, { useState } from "react";
import HeaderExpenses from "./HeaderExpenses";
import ProductList from "./ProductList";
import SalesByCategories from "../dashboard/SalesByCategories";

const ExpensesView = () => {
    const [expensesCategories, setCategories] = useState({
        labels: ['Comida', 'Belleza', 'Gym', 'Salud'],
        data: [351, 246, 144, 83],
    })
    
    return (
        <React.Fragment>
                <HeaderExpenses />
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <SalesByCategories
                        data={expensesCategories}
                    />
                    <div className="lg:col-span-3">
                        <ProductList  />
                    </div>
                </div>
        </React.Fragment>
    )
}

export default ExpensesView;