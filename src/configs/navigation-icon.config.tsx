import {
    HiCurrencyDollar,
    HiHome,
    HiClipboardList,
    HiLightBulb,
    HiCreditCard,
    HiCog
} from 'react-icons/hi';
import { MdSavings } from "react-icons/md";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiHome />,
    currency: <HiCurrencyDollar />,
    category: <HiClipboardList />,
    light: <HiLightBulb />,
    creditCard: <HiCreditCard />,
    config: <HiCog />,
    savings: <MdSavings />,
    incomes: <GiReceiveMoney />,
    expenses: <GiPayMoney />
}

export default navigationIcon
