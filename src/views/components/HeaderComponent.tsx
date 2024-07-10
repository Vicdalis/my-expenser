import { ReactNode } from "react";

interface HeaderContent {
    title: string
    subtitle: string
    children?: ReactNode;
}

const HeaderComponent = (props:  HeaderContent) => {

    
    return (
        <div>
            <div className="flex justify-between">

                <div className="mb-4 lg:mb-6">
                    <h3>{props.title}</h3>
                    <p>{props.subtitle}</p>
                </div>
                {props.children}
            </div>
            
        </div>
    )
}

export default HeaderComponent;