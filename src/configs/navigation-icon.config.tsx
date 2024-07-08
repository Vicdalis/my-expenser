import {
    HiCurrencyDollar,
    HiHome,
    HiClipboardList,
    HiLightBulb,
    HiCreditCard,
    HiCog
} from 'react-icons/hi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiHome />,
    currency: <HiCurrencyDollar />,
    category: <HiClipboardList />,
    light: <HiLightBulb />,
    creditCard: <HiCreditCard />,
    config: <HiCog />,
}

export default navigationIcon
